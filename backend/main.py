from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import uvicorn
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
# Add psutil for system metrics
try:
    import psutil
except ImportError:
    print("WARNING: psutil not installed. System metrics will be limited.")
    # Provide a fallback psutil module with minimal functionality
    class FallbackPsUtil:
        class VirtualMemory:
            def __init__(self):
                self.total = 8 * 1024 * 1024 * 1024  # 8GB
                self.available = 4 * 1024 * 1024 * 1024  # 4GB
                self.percent = 50.0
        
        def virtual_memory(self):
            return self.VirtualMemory()
        
        def cpu_percent(self, interval=0.1):
            return 25.0
        
        def cpu_count(self, logical=True):
            return 4
    
    psutil = FallbackPsUtil()

# Load environment variables
load_dotenv()

# Define API description
description = """
# Sales Dashboard API

This API provides access to sales representatives data and AI-powered insights using Google's Gemini model.

## Features

* **Data Access**: Get detailed information about sales representatives
* **AI Insights**: Ask questions about sales data in natural language
* **Analytics**: Get aggregated sales performance metrics

## Authentication

This API currently does not require authentication, but it may be added in future versions.

## Rate Limiting

There are no rate limits currently applied to the API endpoints, but please use them responsibly.
"""

# Initialize FastAPI with metadata
app = FastAPI(
    title="Sales Dashboard API",
    description=description,
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT License",
    },
    openapi_tags=[
        {
            "name": "AI",
            "description": "Operations with AI-powered insights and analysis"
        },
        {
            "name": "Data",
            "description": "Access to raw sales representatives data"
        },
        {
            "name": "Analytics",
            "description": "Aggregated sales metrics and statistics"
        },
        {
            "name": "System",
            "description": "System operations and health monitoring"
        }
    ],
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

# Configure Google Gemini API
GEMINI_API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("WARNING: Gemini API key not found. AI features will be disabled.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Define request and response models for better documentation
class AIQuestion(BaseModel):
    question: str = Field(
        ..., 
        example="Who is the top performer in North America?",
        description="A natural language question about sales data"
    )

class AIResponse(BaseModel):
    answer: str = Field(
        ...,
        example="Based on the data, Alice is the top performer in North America with $120,000 in closed deals.",
        description="AI-generated answer to the user's question"
    )

class HealthResponse(BaseModel):
    status: str = Field(
        ...,
        example="healthy",
        description="API health status"
    )
    timestamp: float = Field(
        ...,
        example=1713042456.789,
        description="Unix timestamp of the health check"
    )
    version: str = Field(
        ...,
        example="1.0.0",
        description="API version"
    )
    components: Dict[str, Any] = Field(
        ...,
        example={
            "datastore": {"status": "up", "type": "file"},
            "gemini_api": {"status": "up", "responseTime": 124.56}
        },
        description="Status of individual system components"
    )

class SalesAnalytics(BaseModel):
    totalDealCount: int
    dealStatusSummary: Dict[str, int]
    totalDealValue: float
    averageDealValue: float
    regionDistribution: List[str]

# Generate context from DUMMY_DATA
def generate_sales_context():
    """
    Create a detailed, comprehensive context based on the sales representatives data
    """
    # Overall sales team statistics
    total_reps = len(DUMMY_DATA.get('salesReps', []))
    total_deals = sum(len(rep['deals']) for rep in DUMMY_DATA.get('salesReps', []))
    total_deal_value = sum(sum(deal['value'] for deal in rep['deals']) for rep in DUMMY_DATA.get('salesReps', []))
    
    # Deal status aggregation
    deal_status = {
        "Closed Won": sum(len([d for d in rep['deals'] if d['status'] == 'Closed Won']) for rep in DUMMY_DATA.get('salesReps', [])),
        "In Progress": sum(len([d for d in rep['deals'] if d['status'] == 'In Progress']) for rep in DUMMY_DATA.get('salesReps', [])),
        "Closed Lost": sum(len([d for d in rep['deals'] if d['status'] == 'Closed Lost']) for rep in DUMMY_DATA.get('salesReps', []))
    }
    
    # Detailed sales representatives breakdown
    rep_details = []
    for rep in DUMMY_DATA.get('salesReps', []):
        # Calculate rep-specific statistics
        rep_total_deals = len(rep['deals'])
        rep_total_value = sum(deal['value'] for deal in rep['deals'])
        rep_won_deals = len([d for d in rep['deals'] if d['status'] == 'Closed Won'])
        rep_won_value = sum(deal['value'] for deal in rep['deals'] if deal['status'] == 'Closed Won')
        
        rep_summary = (
            f"{rep['name']} ({rep['role']} in {rep['region']}):\n"
            f"  - Key Skills: {', '.join(rep['skills'])}\n"
            f"  - Total Deals: {rep_total_deals}\n"
            f"  - Total Deal Value: ${rep_total_value:,}\n"
            f"  - Closed Won Deals: {rep_won_deals} (${rep_won_value:,})\n"
            f"  - Top Clients: {', '.join(client['name'] for client in rep['clients'])}"
        )
        rep_details.append(rep_summary)
    
    # Compose the full context
    full_context = f"""
        Sales Team Comprehensive Overview:

        Team Composition:
        - Total Sales Representatives: {total_reps}
        - Regions Covered: North America, Europe, Asia-Pacific, South America, Middle East

        Overall Performance:
        - Total Deals: {total_deals}
        - Total Deal Value: ${total_deal_value:,}
        - Deal Status Breakdown:
        * Closed Won: {deal_status['Closed Won']}
        * In Progress: {deal_status['In Progress']}
        * Closed Lost: {deal_status['Closed Lost']}

        Detailed Representative Insights:
        {chr(10).join(rep_details)}

        Strategic Recommendations:
        - Focus on converting 'In Progress' deals
        - Analyze factors contributing to successful deal closures
        - Leverage top performers' skills across the team
        - Investigate reasons behind 'Closed Lost' deals
        - Continue expanding into diverse industry sectors

        Operational Context:
        - Diverse skill sets including Negotiation, CRM, Client Relations
        - Representation across multiple global regions
        - Mix of roles from Sales Representatives to Regional Managers
    """
    
    return full_context

# Generate context once when the module is loaded
SALES_CONTEXT = generate_sales_context()

@app.post("/api/ai", response_model=AIResponse, tags=["AI"], summary="Get AI-powered answer to sales questions")
async def ai_endpoint(question_data: AIQuestion):
    """
    Ask a question about sales data and get an AI-generated response.
    
    The AI has access to comprehensive information about:
    - Sales representatives and their performance
    - Deal statuses and values
    - Client information and industries
    - Regional performance metrics
    
    ## Example questions:
    - "Who is the top performer in North America?"
    - "What's the total value of closed deals?"
    - "Which region has the highest number of in-progress deals?"
    - "What skills do the most successful sales reps have?"
    - "Compare the performance of sales reps in Europe vs. Asia-Pacific"
    - "What's the average deal value across all regions?"
    
    ## Notes:
    - Questions should be related to the available sales data
    - Responses are limited to 200 words for conciseness
    - If the Gemini API key is not configured, AI features will be unavailable
    
    ## Error Handling:
    - Returns 200 with explanatory message if AI features are disabled
    - Returns 200 with helpful message if question is empty
    - Returns 200 with error message if processing fails
    """
    try:
        # Check if API key is configured
        if not GEMINI_API_KEY:
            return AIResponse(answer="AI features are currently unavailable. Please contact support.")

        user_question = question_data.question

        # Validate input
        if not user_question.strip():
            return AIResponse(answer="Please ask a specific question about sales.")

        # Select Gemini 2.0 Flash-Lite model
        model = genai.GenerativeModel('gemini-2.0-flash-lite')

        # Generate response with optimized prompt
        full_prompt = f"""
        Sales Context:
        {SALES_CONTEXT}

        Analyze and respond to this query concisely:
        {user_question}

        Guidelines:
        - Be precise and data-driven
        - Provide clear, actionable insights
        - Limit response to 200 words
        """
        
        # Generate response with reduced tokens and specificity
        generation_config = {
            'temperature': 0.5,  # Balanced creativity and factuality
            'max_output_tokens': 200,  # Limit response length
        }
        
        response = model.generate_content(
            full_prompt, 
            generation_config=generation_config
        )

        # Extract and return the AI's response
        ai_answer = response.text.strip()
        return AIResponse(answer=ai_answer)

    except Exception as e:
        # Comprehensive error handling
        print(f"Error in AI endpoint: {e}")
        return AIResponse(answer="Sorry, I'm having trouble processing your request right now.")

@app.get("/api/sales-analytics", response_model=SalesAnalytics, tags=["Analytics"], summary="Get sales analytics metrics")
def get_sales_analytics():
    """
    Provide aggregated sales analytics based on the sales representatives data.
    
    Returns:
    - Total number of deals across all representatives
    - Breakdown of deals by status (Closed Won, In Progress, Closed Lost)
    - Total value of all deals
    - Average deal value
    - List of regions where sales representatives operate
    
    ## Response Details:
    - `totalDealCount`: Integer count of all deals across sales reps
    - `dealStatusSummary`: Counts of deals in each status category
    - `totalDealValue`: Sum of all deal values in dollars
    - `averageDealValue`: Mean value per deal across the entire dataset
    - `regionDistribution`: List of unique regions represented in the data
    
    This endpoint is useful for:
    - Dashboard overview metrics
    - Sales performance monitoring
    - Regional distribution analysis
    - Executive reporting
    """
    sales_reps = DUMMY_DATA.get('salesReps', [])
    
    # Calculate total deals and their statuses
    total_deals = []
    deal_status_summary = {
        "Closed Won": 0,
        "In Progress": 0,
        "Closed Lost": 0
    }
    total_deal_value = 0
    
    for rep in sales_reps:
        for deal in rep.get('deals', []):
            total_deals.append(deal)
            deal_status_summary[deal['status']] += 1
            total_deal_value += deal['value']
    
    return SalesAnalytics(
        totalDealCount=len(total_deals),
        dealStatusSummary=deal_status_summary,
        totalDealValue=total_deal_value,
        averageDealValue=total_deal_value / len(total_deals) if total_deals else 0,
        regionDistribution=list(set(rep['region'] for rep in sales_reps))
    )

@app.get("/api/data", tags=["Data"], summary="Get all sales representatives data")
def get_data():
    """
    Returns complete sales representatives data from the database.
    
    The data includes:
    - Sales representatives information (name, role, region)
    - Skills for each representative
    - Deal information (client, value, status)
    - Client information (name, industry, contact)
    
    ## Data Structure:
    ```json
    {
      "salesReps": [
        {
          "id": 1,
          "name": "String",
          "role": "String",
          "region": "String",
          "skills": ["String"],
          "deals": [
            { 
              "client": "String", 
              "value": Number, 
              "status": "String" 
            }
          ],
          "clients": [
            { 
              "name": "String", 
              "industry": "String", 
              "contact": "String" 
            }
          ]
        }
      ]
    }
    ```
    
    This endpoint provides the raw data for building:
    - Sales representative profiles
    - Deal tracking interfaces
    - Client relationship management
    - Performance analysis dashboards
    """
    return DUMMY_DATA


@app.get("/health", tags=["System"], summary="API health check")
async def health_check():
    """
    Comprehensive health check endpoint that verifies API is running
    along with critical dependencies and services.
    
    ## Response Structure:
    - `status`: Overall health status ("healthy", "degraded", or "unhealthy")
    - `timestamp`: Unix timestamp when health check was performed
    - `version`: API version string
    - `components`: Detailed status of individual system components including:
      - `datastore`: Status of the data storage system
      - `gemini_api`: Status and response time of the Gemini API
      - `system`: System resources like CPU and memory usage
    
    ## HTTP Status Codes:
    - 200: API is fully operational
    - 503: API is running but one or more components are degraded or unavailable
    
    This endpoint is designed to work with frontend health monitoring components
    and automated health check systems.
    """
    import time
    import psutil
    
    health_data = {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "components": {}
    }
    
    # Add system metrics
    try:
        health_data["components"]["system"] = {
            "status": "up",
            "memory": {
                "total": psutil.virtual_memory().total,
                "available": psutil.virtual_memory().available,
                "percent": psutil.virtual_memory().percent
            },
            "cpu": {
                "usage": psutil.cpu_percent(interval=0.1),
                "cores": psutil.cpu_count(logical=True)
            }
        }
    except Exception as e:
        health_data["components"]["system"] = {
            "status": "up",  # Still up even if we can't get detailed metrics
            "memory": {
                "total": 0,
                "available": 0,
                "percent": 0
            },
            "cpu": {
                "usage": 0,
                "cores": 0
            },
            "error": str(e)
        }
    
    # Check file system access
    try:
        start_time = time.time()
        with open("dummyData.json", "r") as f:
            pass
        response_time = time.time() - start_time
        
        health_data["components"]["datastore"] = {
            "status": "up",
            "type": "file",
            "responseTime": round(response_time * 1000, 2)
        }
    except Exception as e:
        health_data["components"]["datastore"] = {
            "status": "down",
            "type": "file",
            "error": str(e)
        }
        health_data["status"] = "degraded"
    
    # Check Gemini API connectivity
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-lite')
            start_time = time.time()
            model_info = model.count_tokens("test")
            response_time = time.time() - start_time
            
            health_data["components"]["gemini_api"] = {
                "status": "up",
                "responseTime": round(response_time * 1000, 2)
            }
        except Exception as e:
            health_data["components"]["gemini_api"] = {
                "status": "down",
                "error": str(e)
            }
            health_data["status"] = "degraded"
    else:
        health_data["components"]["gemini_api"] = {
            "status": "disabled",
            "reason": "API key not configured"
        }
    
    # Determine response status code
    response_status = status.HTTP_200_OK
    if health_data["status"] != "healthy":
        response_status = status.HTTP_503_SERVICE_UNAVAILABLE
        
    return JSONResponse(
        content=health_data,
        status_code=response_status
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
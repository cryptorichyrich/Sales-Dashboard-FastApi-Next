from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
import os
import psutil
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()

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

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns an AI-generated response using Gemini 2.0 Flash-Lite.
    """
    try:
        # Check if API key is configured
        if not GEMINI_API_KEY:
            return {"answer": "AI features are currently unavailable. Please contact support."}

        # Parse request body
        body = await request.json()
        user_question = body.get("question", "")

        # Validate input
        if not user_question.strip():
            return {"answer": "Please ask a specific question about sales."}

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
        return {"answer": ai_answer}

    except Exception as e:
        # Comprehensive error handling
        print(f"Error in AI endpoint: {e}")
        return {"answer": "Sorry, I'm having trouble processing your request right now."}

# Analytics Endpoint (unchanged)
@app.get("/api/sales-analytics")
def get_sales_analytics():
    """
    Provide sales analytics based on the sales representatives data.
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
    
    return {
        "totalDealCount": len(total_deals),
        "dealStatusSummary": deal_status_summary,
        "totalDealValue": total_deal_value,
        "averageDealValue": total_deal_value / len(total_deals) if total_deals else 0,
        "regionDistribution": list(set(rep['region'] for rep in sales_reps))
    }

@app.get("/api/data")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    return DUMMY_DATA

@app.get("/health")
async def health_check():
    """
    Comprehensive health check endpoint that verifies API is running
    along with all critical dependencies and services.
    
    Returns:
        JSON with detailed health status of various system components
    """
    import psutil
    import time
    from fastapi import status
    
    health_data = {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",  # Add your application version
        "components": {}
    }
    
    # Check file system access (data file)
    try:
        with open("dummyData.json", "r") as f:
            # Just checking if we can open the file
            health_data["components"]["datastore"] = {
                "status": "up",
                "type": "file",
                "responseTime": 0  # You could time this operation
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
            # Simple test to verify Gemini API is responsive
            # You might want to implement a lightweight call here
            model = genai.GenerativeModel('gemini-2.0-flash-lite')
            start_time = time.time()
            # Just check if the model is available without generating content
            # This is a lightweight operation
            model_info = model.count_tokens("test")
            response_time = time.time() - start_time
            
            health_data["components"]["gemini_api"] = {
                "status": "up",
                "responseTime": round(response_time * 1000, 2)  # in ms
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
        # This is expected behavior if API key isn't set, so we don't mark as degraded
    
    # System resources
    try:
        memory = psutil.virtual_memory()
        health_data["components"]["system"] = {
            "status": "up",
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent
            },
            "cpu": {
                "usage": psutil.cpu_percent(interval=0.1)
            }
        }
        
        # Optional: Set degraded status if resources are critically low
        if memory.percent > 95 or health_data["components"]["system"]["cpu"]["usage"] > 95:
            health_data["components"]["system"]["status"] = "warning"
            if health_data["status"] == "healthy":
                health_data["status"] = "degraded"
    except Exception as e:
        health_data["components"]["system"] = {
            "status": "unknown",
            "error": str(e)
        }
    
    # Determine response status code based on overall health
    response_status = status.HTTP_200_OK
    if health_data["status"] != "healthy":
        response_status = status.HTTP_503_SERVICE_UNAVAILABLE
        
    # Return health data with appropriate status code
    return JSONResponse(
        content=health_data,
        status_code=response_status
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
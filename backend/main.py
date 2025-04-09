from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import os
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
def health_check():
    """
    Simple health check endpoint to verify API is running.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def root():
    return {"message": "Welcome to the Sales Dashboard API"}

# Load dummy data
with open("dummyData.json", "r") as f:
    DUMMY_DATA = json.load(f)

@app.get("/api/data")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    return DUMMY_DATA

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a contextual AI response.
    """
    body = await request.json()
    user_question = body.get("query", "")

    # Enhanced contextual responses based on sales data
    user_question_lower = user_question.lower()

    if "sales" in user_question_lower:
        return {"response": "Our sales team covers multiple regions including North America, Europe, Asia-Pacific, South America, and the Middle East."}
    elif "performance" in user_question_lower:
        analytics = get_sales_analytics()
        return {"response": f"We have {analytics['totalDealCount']} total deals. Breakdown: {analytics['dealStatusSummary']['Closed Won']} closed won, {analytics['dealStatusSummary']['In Progress']} in progress, and {analytics['dealStatusSummary']['Closed Lost']} closed lost. Total deal value is ${analytics['totalDealValue']:,.2f}."}
    elif "region" in user_question_lower:
        return {"response": "Our sales representatives cover regions including North America, Europe, Asia-Pacific, South America, and the Middle East."}
    else:
        return {"response": f"I received your question: '{user_question}'. For specific sales information, try asking about sales performance, regions, or representatives."}

@app.get("/health")
def health_check():
    """
    Simple health check endpoint to verify API is running.
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
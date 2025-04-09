# Sales Dashboard Backend

A FastAPI backend for serving sales data and providing AI-powered insights using Google's Gemini model.

## Features

- **Data API**: Endpoints for accessing sales representatives data
- **AI Integration**: Natural language processing for sales queries using Gemini 2.0 Flash-Lite
- **Analytics**: Basic analytics endpoints for sales performance metrics
- **CORS Support**: Configured for cross-origin requests from frontend applications

## Project Structure

```
backend/
├── dummyData.json      # Mock sales data in JSON format
├── main.py             # FastAPI application with endpoints
└── requirements.txt    # Python dependencies
```

## Prerequisites

- Python 3.7 or later
- Google Gemini API key (for AI features)

## Setup Instructions

1. **Environment Setup**

   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Create a virtual environment
   python -m venv venv
   
   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Configure Gemini API**

   Create a `.env` file in the backend directory:

   ```
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

3. **Start the Server**

   ```bash
   # Run the server with auto-reload
   python main.py
   ```

   The server will run on http://localhost:8000

## API Endpoints

### Data Endpoints

- `GET /api/data` - Returns the full sales representatives data
  - Response: JSON object containing sales representatives information

### AI Endpoints

- `POST /api/ai` - Accepts a user question and returns an AI-generated response
  - Request Body: `{ "question": "your question here" }`
  - Response: `{ "answer": "AI-generated answer" }`

### Analytics Endpoints

- `GET /api/sales-analytics` - Provides aggregated sales analytics
  - Response: JSON object with deal counts, values, and status summaries

### Utility Endpoints

- `GET /health` - Simple health check endpoint
  - Response: `{ "status": "healthy" }`

## Data Schema

The backend works with the following data structure:

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

## AI Functionality

The backend uses Google's Gemini 2.0 Flash-Lite model to process natural language queries about the sales data. The AI features:

- Context-aware responses based on the available sales data
- Concise, actionable insights limited to 200 words
- Balanced creativity and factual accuracy with temperature of 0.5

## Configuration

The following environment variables can be configured:

- `GOOGLE_GEMINI_API_KEY`: Required for AI functionality

## Troubleshooting

- **Missing API Key**: If "AI features are currently unavailable" is returned, check your Gemini API key in the `.env` file
- **CORS Issues**: If frontend cannot access the API, check CORS configuration in `main.py`
- **Server Errors**: Check the console output for detailed error messages

## Potential Improvements

1. **Authentication**: Add JWT authentication for secure access
2. **Database Integration**: Replace dummyData.json with a proper database
3. **Caching**: Implement response caching for better performance
4. **Request Validation**: Add more comprehensive request validation
5. **Logging**: Add structured logging for better debugging
6. **Testing**: Add unit and integration tests
7. **Rate Limiting**: Protect endpoints from abuse with rate limiting
8. **Pagination**: Add pagination for large datasets
9. **Swagger Documentation**: Enhance API documentation with more details
10. **Containerization**: Add Docker support for easier deployment
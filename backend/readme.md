# Sales Dashboard Backend

A FastAPI backend for serving sales data and providing AI-powered insights using Google's Gemini model.

## Features

- **Data API**: Endpoints for accessing sales representatives data
- **AI Integration**: Natural language processing for sales queries using Gemini 2.0 Flash-Lite
- **Analytics**: Analytics endpoints for sales performance metrics
- **CORS Support**: Configured for cross-origin requests from frontend applications
- **Context Generation**: Automatic context generation from sales data for more accurate AI responses

## Project Structure

```
backend/
├── dummyData.json      # Mock sales data in JSON format
├── main.py             # FastAPI application with all endpoints
├── requirements.txt    # Python dependencies
├── .env                # Environment variables (create this file)
└── README.md           # This documentation file
```

## Prerequisites

- Python 3.7 or later
- Google Gemini API key (for AI features)
- Virtual environment tool (recommended: venv)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create and Activate Virtual Environment**

   ```bash
   # Create a virtual environment
   python -m venv venv
   
   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the backend directory with the following:

   ```
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

5. **Start the Server**

   ```bash
   # Run the server with auto-reload
   python main.py
   ```

   The server will run on http://localhost:8000 by default.

6. **Verify Installation**

   Visit http://localhost:8000/health in your browser or run:
   
   ```bash
   curl http://localhost:8000/health
   ```
   
   You should see: `{"status": "healthy"}`

## API Documentation

### Data Endpoints

- `GET /api/data` 
  - Returns the full sales representatives data
  - Response: JSON object containing sales representatives information
  - No parameters required

### AI Endpoints

- `POST /api/ai`
  - Accepts a user question and returns an AI-generated response
  - Request Body: `{ "question": "your question here" }`
  - Response: `{ "answer": "AI-generated answer" }`
  - Requires valid Gemini API key in the environment variables

### Analytics Endpoints

- `GET /api/sales-analytics`
  - Provides aggregated sales analytics
  - Response: JSON object with:
    - `totalDealCount`: Number of deals across all representatives
    - `dealStatusSummary`: Count of deals by status (Closed Won, In Progress, Closed Lost)
    - `totalDealValue`: Sum of all deal values
    - `averageDealValue`: Average deal value
    - `regionDistribution`: List of unique regions

### Utility Endpoints

- `GET /health`
  - Simple health check endpoint
  - Response: `{ "status": "healthy" }`

## Data Model

The backend works with the following data structure:

```json
{
  "salesReps": [
    {
      "id": Number,
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

## AI Implementation Details

The backend uses Google's Gemini 2.0 Flash-Lite model to process natural language queries about the sales data:

- **Context Generation**: The backend automatically generates a detailed context from the sales data using the `generate_sales_context()` function
- **Intelligent Prompting**: User questions are wrapped with the generated context for more relevant responses
- **Optimized Parameters**:
  - `temperature`: 0.5 (balanced creativity and factuality)
  - `max_output_tokens`: 200 (concise responses)
- **Error Handling**: Comprehensive error handling to provide graceful fallbacks when the AI service is unavailable

## Configuration Options

The following environment variables can be configured:

- `GOOGLE_GEMINI_API_KEY`: Required for AI functionality
- `PORT`: (Optional) Server port (defaults to 8000)
- `HOST`: (Optional) Server host (defaults to 0.0.0.0)

## Troubleshooting

- **Missing API Key Warning**: If you see "WARNING: Gemini API key not found. AI features will be disabled" on startup, check your `.env` file
- **AI Responses Unavailable**: If responses from `/api/ai` return "AI features are currently unavailable", verify your Gemini API key
- **CORS Issues**: If frontend cannot access the API, check the CORS configuration in `main.py`
- **Server Start Failures**: Check for port conflicts if the server fails to start
- **Dependencies Issues**: Make sure all dependencies are installed with `pip install -r requirements.txt`

## Security Considerations

- This implementation uses open CORS settings for development. For production, restrict `allow_origins` to your frontend domain
- The Gemini API key should be kept secure and not committed to version control
- For production, consider adding proper authentication and rate limiting

## Performance Optimization

- The sales context is generated once when the server starts, reducing processing time for each request
- Consider implementing caching for frequent queries to reduce API calls to Gemini

## Potential Improvements

1. **Database Integration**: Replace dummyData.json with a proper database (PostgreSQL, MongoDB)
2. **Authentication**: Add JWT authentication for secure access
3. **Pagination**: Add pagination support for large datasets
4. **Advanced Analytics**: Implement more sophisticated analytics with time-series data
5. **Request Validation**: Add more comprehensive request validation
6. **Logging**: Add structured logging for better debugging
7. **Testing**: Add unit and integration tests
8. **Containerization**: Add Docker support for easier deployment
9. **CI/CD Pipeline**: Set up continuous integration and deployment
10. **Swagger Documentation**: Enhance API documentation with more details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
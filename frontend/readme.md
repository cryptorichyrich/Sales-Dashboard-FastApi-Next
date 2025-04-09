# Sales Dashboard Frontend

A Next.js frontend application for visualizing sales representatives data and interacting with an AI chat assistant.

## Features

- **Sales Representatives Display**: View detailed cards for each sales representative
- **Region Filtering**: Filter sales reps by geographic region
- **AI Chat Interface**: Ask questions about sales data and receive AI-powered insights
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Project Structure

```
frontend/
├── components/           # React components
│   ├── ai/               # AI chat components
│   │   ├── ChatInput.js
│   │   ├── ChatMessages.js
│   │   └── ChatSection.js
│   ├── layout/           # Layout components
│   │   ├── Container.js
│   │   └── Header.js
│   └── sales/            # Sales data visualization
│       ├── RegionFilter.js
│       ├── SalesRepCard.js
│       └── SalesRepList.js
├── hooks/                # Custom React hooks
│   ├── useChat.js        # Chat functionality
│   └── useSalesData.js   # Data fetching
└── pages/                # Next.js pages
    ├── _app.js
    └── index.js          # Main dashboard page
```

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API running on http://localhost:8000

## Setup Instructions

1. **Install Dependencies**

   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   # OR if you use yarn
   yarn install
   ```

2. **Start the Development Server**

   ```bash
   npm run dev
   # OR with yarn
   yarn dev
   ```

   The application will be available at http://localhost:3000

## Using the Dashboard

1. **View Sales Representatives**:
   - Browse through sales rep cards showing their details, skills, and deals
   - Each deal shows its status (Closed Won, In Progress, Closed Lost) and value

2. **Filter by Region**:
   - Use the dropdown at the top of the Sales Representatives section to filter by region
   - Select "All Regions" to view all representatives

3. **Interact with the AI Assistant**:
   - Scroll to the bottom "Ask About Sales" section
   - Type your question about sales data (e.g., "Who is the top performer in North America?")
   - Click "Ask" or press CTRL+ENTER to submit your question
   - View the AI's response in the chat window

## Key Components

- **SalesRepsList**: Main component for displaying sales representatives
- **RegionFilter**: Dropdown for filtering by region
- **SalesRepCard**: Individual card showing rep details and deals
- **ChatSection**: Container for the AI chat interface
- **ChatMessages**: Displays chat history with formatting support
- **ChatInput**: Input field for entering questions

## Custom Hooks

- **useSalesData**: Fetches sales rep data from the backend API
- **useChat**: Manages chat state and handles sending/receiving messages

## Styling

The application uses Tailwind CSS for styling. Tailwind classes are applied directly within component files.

## Backend API Requirements

The frontend expects the following API endpoints to be available:

- `GET http://localhost:8000/api/data`: Returns sales representatives data
- `POST http://localhost:8000/api/ai`: Accepts chat questions and returns AI responses

## Troubleshooting

- **No data displayed**: Ensure the backend API is running on http://localhost:8000
- **AI chat not responding**: Verify the backend AI endpoint is configured correctly
- **Layout issues**: Make sure Tailwind CSS is properly installed and configured

## Potential Improvements

1. **Data Visualization**: Add charts and graphs for better sales metrics visualization
2. **Theming Support**: Add light/dark mode themes
3. **Internationalization**: Add multi-language support
4. **State Management**: Implement Redux or Context API for more complex state management
5. **Accessibility**: Improve keyboard navigation and screen reader support
6. **Testing**: Add Jest and React Testing Library tests
7. **Performance Optimization**: Implement code splitting and lazy loading
# Sales Dashboard Frontend

A Next.js frontend application for visualizing sales representatives data and interacting with an AI chat assistant powered by Google's Gemini model.

## Features

- **Sales Representatives Display**: View detailed cards for each sales representative
- **Region Filtering**: Filter sales reps by geographic region
- **AI Chat Interface**: Ask questions about sales data and receive AI-powered insights
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Markdown Support**: AI responses support markdown formatting for better readability
- **System Health Monitoring**: Continuously tracks the status and performance of the backend API, server, and AI components to ensure optimal functionality

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
├── pages/                # Next.js pages
│   ├── _app.js
│   └── index.js          # Main dashboard page
├── styles/               # Global styles
│   └── global.css        # Tailwind imports and custom styles
├── .env.local            # Environment variables (create this file)
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API (should be running on the URL specified in your environment variables)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   # Using npm
   npm install

   # OR using yarn
   yarn install
   ```

3. **Create Environment Variables**

   Create a `.env.local` file in the frontend root directory with the following variables:

   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

   Adjust the URL if your backend is running on a different port or host.

4. **Start the Development Server**

   ```bash
   # Using npm
   npm run dev

   # OR using yarn
   yarn dev
   ```

   The application will be available at http://localhost:3000

5. **Build for Production** (Optional)

   ```bash
   # Using npm
   npm run build
   npm start

   # OR using yarn
   yarn build
   yarn start
   ```

## Using the Dashboard

1. **View Sales Representatives**:
   - Browse through sales rep cards showing their details, skills, and deals
   - Each deal shows its status (Closed Won, In Progress, Closed Lost) with color coding and value

2. **Filter by Region**:
   - Use the dropdown at the top of the Sales Representatives section to filter by region
   - Select "All Regions" to view all representatives

3. **Interact with the AI Assistant**:
   - Scroll to the "Ask About Sales" section
   - Type your question about sales data (e.g., "Who is the top performer in North America?")
   - Click "Ask" or press CTRL+ENTER (CMD+ENTER on Mac) to submit your question
   - View the AI's response in the chat window with proper markdown formatting

## Implementation Details

### Data Fetching

The application uses custom React hooks for data fetching:

- `useSalesData`: Fetches and manages sales representatives data
- `useChat`: Handles chat state and communication with the AI backend

### Component Architecture

- Components are organized by feature area (ai, layout, sales)
- Each component has a single responsibility for better maintainability
- Tailwind CSS classes are used directly in components for styling

### Responsive Design

- The application is fully responsive using Tailwind's responsive utility classes
- Sales rep cards use a grid layout that adapts to different screen sizes
- Chat interface is optimized for both desktop and mobile use

## Troubleshooting

- **No data displayed**: 
  - Ensure the backend API is running
  - Check that your `.env.local` file has the correct API URL
  - Check browser console for network errors

- **AI chat not responding**: 
  - Verify the backend AI endpoint is configured correctly
  - Make sure the backend has a valid Gemini API key configured

- **Styling issues**: 
  - Make sure Tailwind CSS is properly installed and configured
  - Check that PostCSS is correctly set up

## Potential Improvements

1. **Data Visualization**: Add charts and graphs for better sales metrics visualization
2. **Authentication**: Implement user authentication system
3. **Real-time Updates**: Add WebSocket support for real-time data updates
4. **Customizable Dashboard**: Allow users to customize the dashboard layout
5. **Advanced Filtering**: Add more filtering options (by deal status, value range, etc.)
6. **Chat History**: Persist chat history between sessions
7. **Responsive Enhancements**: Further optimize the UI for different devices
8. **Accessibility**: Improve keyboard navigation and screen reader support
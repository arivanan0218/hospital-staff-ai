# Hospital Staff AI Chatbot Setup

This document explains how to set up and use the AI-powered chatbot for the Hospital Staff Management System.

## Prerequisites

1. GROQ API Key
   - Sign up at [GROQ Cloud](https://console.groq.com/) to get your API key
   - Add the API key to your backend `.env` file:
     ```
     GROQ_API_KEY=your_api_key_here
     ```

## Backend Setup

The chatbot backend consists of:

1. **chatbot_service.py** - Handles communication with the GROQ API
2. **chatbot.py** - Defines the FastAPI router and request/response models

### Environment Variables

Make sure you have the following in your `.env` file:
```
GROQ_API_KEY=your_api_key_here
```

## Frontend Setup

The chatbot frontend is implemented as a floating button that expands into a chat interface.

### Features

- Toggle chat window with a floating action button
- Real-time message exchange with the GROQ API
- Responsive design that works on all screen sizes
- Loading indicators during API calls
- Error handling and user feedback

## Usage

1. Click the chatbot icon in the bottom-right corner of any page
2. Type your question in the input field and press Enter or click Send
3. The assistant will respond based on the context of your question

## Customization

### Backend

You can modify the following in `chatbot_service.py`:
- `model`: Change the GROQ model (default: "llama2-70b-4096")
- `temperature`: Adjust creativity (0.0 to 1.0)
- `max_tokens`: Control response length

### Frontend

Customize the chat interface in `Chatbot.jsx`:
- Colors and styling in the `styled` components
- Initial greeting message
- Chat window size and position

## Troubleshooting

1. **Chatbot not responding**
   - Check browser console for errors
   - Verify the backend server is running
   - Ensure the GROQ API key is correctly set

2. **API errors**
   - Check the backend logs for detailed error messages
   - Verify your GROQ API key has sufficient credits

## Security Notes

- Never expose your GROQ API key in client-side code
- Keep your `.env` file in `.gitignore`
- Consider implementing rate limiting in production

## License

This project is part of the Hospital Staff AI system.

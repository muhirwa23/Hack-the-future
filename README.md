# MindCareAI Dashboard

A mental health dashboard application for Rwandan youth, featuring AI-powered insights and data visualization.

## Features

- **Mental Health Survey**: Submit information about your mental state for AI analysis
- **AI Insights**: Ask questions about mental health and receive AI-powered responses
- **Data Visualization**: View mental health statistics for Rwandan youth
- **Voice Input**: Use voice recognition to ask questions
- **Multiple AI Models**: Switch between Groq and Gemini AI models
- **Dark Mode**: Toggle between light and dark themes

## Technical Implementation

### AI Integration

The application integrates with two powerful AI models:

1. **Groq API**: Uses the LLaMA 3 70B model for fast and accurate responses
2. **Gemini API**: Leverages Google's Gemini Pro model for alternative insights

### Agentic Features

The application implements an agentic architecture that can:

- Analyze mental health survey responses
- Generate data visualizations based on user queries
- Recommend mental health resources
- Maintain conversation context for more relevant responses
- Automatically classify user queries to determine the appropriate action

### Data Sources

The application uses several data sources:
- Mental health statistics for Rwandan youth
- General population data
- World health statistics indicators
- Dementia diagnosis and treatment indicators

## Setup

1. Clone the repository
2. Open `api.js` and add your Groq and Gemini API keys
3. Open `index.html` in a web browser

## Usage

- Fill out the mental health survey to receive an AI-powered assessment
- Ask questions in the AI Insights section
- Toggle between Groq and Gemini models using the button in the header
- Use the voice input button to speak your questions
- Switch between light and dark mode using the toggle button

## Future Enhancements

- Integration with local mental health resources in Rwanda
- Multi-language support (Kinyarwanda, English, French)
- Mobile application version
- Offline functionality for areas with limited connectivity
- Integration with wearable devices for real-time monitoring

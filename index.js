const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const surveyForm = document.getElementById('survey-form');
const aiSubmit = document.getElementById('ai-submit');
const feedbackForm = document.getElementById('feedback-form');
const voiceInputBtn = document.getElementById('voice-input');
const aiQueryInput = document.getElementById('ai-query');
const modelToggle = document.getElementById('model-toggle');
const loadingIndicator = document.getElementById('loading-indicator');

// Import our AI agents
import { aiAgent, mentalHealthAgent } from './api.js';

// Initialize the mental health agent
async function initializeAgent() {
    try {
        await mentalHealthAgent.initialize();
        console.log('Mental Health Agent initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Mental Health Agent:', error);
    }
}

// Call initialization when the page loads
window.addEventListener('DOMContentLoaded', initializeAgent);

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

// Handle survey form submission
surveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading indicator
    const predictionResults = document.getElementById('prediction-results');
    predictionResults.innerHTML = "<p>Analyzing your responses...</p>";
    
    // Get form data
    const formData = new FormData(surveyForm);
    const name = formData.get('name');
    const age = formData.get('age');
    const gender = formData.get('gender');
    const mentalState = formData.get('mental_state');
    
    // Create a query for the AI
    const query = `Please analyze the following mental health survey response:
    Name: ${name}
    Age: ${age}
    Gender: ${gender}
    Mental state description: ${mentalState}
    
    Provide a brief assessment and recommendations.`;
    
    try {
        // Process the query using our mental health agent
        const result = await mentalHealthAgent.processUserQuery(query);
        
        if (result.success) {
            predictionResults.innerHTML = `<p>${result.response}</p>`;
        } else {
            predictionResults.innerHTML = "<p>Sorry, there was an error analyzing your responses. Please try again later.</p>";
        }
    } catch (error) {
        console.error('Error processing survey:', error);
        predictionResults.innerHTML = "<p>Sorry, there was an error analyzing your responses. Please try again later.</p>";
    }
});

// Handle AI query submission
aiSubmit.addEventListener('click', async () => {
    const query = aiQueryInput.value;
    if (!query.trim()) return;
    
    const aiResponse = document.getElementById('ai-response');
    
    // Show loading state
    aiResponse.innerHTML = '<p>Thinking...</p>';
    
    try {
        // Process the query using our mental health agent
        const result = await mentalHealthAgent.processUserQuery(query);
        
        if (result.success) {
            // Display which model was used
            const modelInfo = `<small>Powered by ${result.model === 'groq' ? 'Groq' : 'Gemini'}</small>`;
            aiResponse.innerHTML = `<p>${result.response}</p>${modelInfo}`;
        } else {
            aiResponse.innerHTML = "<p>Sorry, I couldn't process your question. Please try again.</p>";
        }
    } catch (error) {
        console.error('Error processing AI query:', error);
        aiResponse.innerHTML = "<p>Sorry, there was an error processing your question. Please try again later.</p>";
    }
});

// Toggle between Groq and Gemini models
if (modelToggle) {
    modelToggle.addEventListener('click', () => {
        const currentModel = aiAgent.getCurrentModel();
        const newModel = currentModel === 'groq' ? 'gemini' : 'groq';
        
        if (aiAgent.setModel(newModel)) {
            modelToggle.textContent = `Switch to ${currentModel === 'groq' ? 'Groq' : 'Gemini'}`;
            const modelIndicator = document.getElementById('model-indicator');
            if (modelIndicator) {
                modelIndicator.textContent = `Using: ${newModel === 'groq' ? 'Groq' : 'Gemini'}`;
            }
        }
    });
}

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
});

// Voice input functionality
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceInputBtn.addEventListener('click', () => {
        recognition.start();
        // Show recording indicator
        voiceInputBtn.classList.add('recording');
    });

    recognition.onresult = (event) => {
        aiQueryInput.value = event.results[0][0].transcript;
        // Remove recording indicator
        voiceInputBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        alert('Voice recognition error: ' + event.error);
        // Remove recording indicator
        voiceInputBtn.classList.remove('recording');
    };
    
    recognition.onend = () => {
        // Remove recording indicator
        voiceInputBtn.classList.remove('recording');
    };
} else {
    voiceInputBtn.disabled = true;
    voiceInputBtn.title = "Voice recognition not supported";
}

// Data visualization
const trace1 = {
    x: ['Depression', 'Anxiety', 'Stress'],
    y: [20, 14, 23],
    type: 'bar',
    name: 'Urban'
};

const trace2 = {
    x: ['Depression', 'Anxiety', 'Stress'],
    y: [12, 18, 29],
    type: 'bar',
    name: 'Rural'
};

const data = [trace1, trace2];

const layout = {
    barmode: 'group',
    title: 'Mental Health Conditions: Urban vs Rural',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
        color: '#333333'
    }
};

Plotly.newPlot('data-visualization', data, layout);

darkModeToggle.addEventListener('click', () => {
    const updateLayout = {
        font: {
            color: body.classList.contains('dark-mode') ? '#e0e0e0' : '#333333'
        }
    };
    Plotly.relayout('data-visualization', updateLayout);
});

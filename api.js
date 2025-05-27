// API Integration for Groq and Gemini
class AIAgent {
    constructor() {
        this.groqApiKey = ''; // Replace with your Groq API key
        this.geminiApiKey = ''; // Replace with your Gemini API key
        this.groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
        this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.currentModel = 'groq'; // Default model
    }

    // Switch between AI models
    setModel(model) {
        if (model === 'groq' || model === 'gemini') {
            this.currentModel = model;
            return true;
        }
        return false;
    }

    // Get the current model name
    getCurrentModel() {
        return this.currentModel;
    }

    // Process a query using the selected AI model
    async processQuery(query, context = []) {
        try {
            if (this.currentModel === 'groq') {
                return await this.queryGroq(query, context);
            } else {
                return await this.queryGemini(query, context);
            }
        } catch (error) {
            console.error('Error processing query:', error);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, there was an error processing your request.'
            };
        }
    }

    // Query the Groq API
    async queryGroq(query, context = []) {
        try {
            const messages = [
                ...context.map(item => ({ role: item.role, content: item.content })),
                { role: 'user', content: query }
            ];

            const response = await fetch(this.groqEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.groqApiKey}`
                },
                body: JSON.stringify({
                    model: 'llama3-70b-8192', // Using LLaMA 3 70B model
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                response: data.choices[0].message.content,
                model: 'groq',
                rawResponse: data
            };
        } catch (error) {
            console.error('Groq API error:', error);
            throw error;
        }
    }

    // Query the Gemini API
    async queryGemini(query, context = []) {
        try {
            // Format context and query for Gemini
            const contents = [];
            
            // Add context messages
            for (const item of context) {
                contents.push({
                    role: item.role === 'user' ? 'user' : 'model',
                    parts: [{ text: item.content }]
                });
            }
            
            // Add the current query
            contents.push({
                role: 'user',
                parts: [{ text: query }]
            });

            const response = await fetch(`${this.geminiEndpoint}?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                        topP: 0.95,
                        topK: 40
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return {
                success: true,
                response: data.candidates[0].content.parts[0].text,
                model: 'gemini',
                rawResponse: data
            };
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }
}

// Agent for handling complex mental health tasks
class MentalHealthAgent {
    constructor() {
        this.aiAgent = new AIAgent();
        this.conversationHistory = [];
        this.mentalHealthData = null;
    }

    // Initialize with data
    async initialize() {
        try {
            // Load mental health data from CSV files
            const mentalHealthData = await fetch('mental_health_data_rwanda_youth.csv')
                .then(response => response.text());
            
            this.mentalHealthData = this.parseCSV(mentalHealthData);
            return true;
        } catch (error) {
            console.error('Error initializing agent:', error);
            return false;
        }
    }

    // Parse CSV data
    parseCSV(csvText) {
        const lines = csvText.split('\\n');
        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            const entry = {};
            
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j].trim()] = values[j]?.trim() || '';
            }
            
            result.push(entry);
        }

        return result;
    }

    // Add message to conversation history
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        // Keep history manageable
        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }
    }

    // Process a user query with context
    async processUserQuery(query) {
        try {
            // Add user query to history
            this.addToHistory('user', query);
            
            // Analyze query to determine the appropriate action
            const action = await this.determineAction(query);
            
            let response;
            switch (action) {
                case 'mental_health_analysis':
                    response = await this.performMentalHealthAnalysis(query);
                    break;
                case 'data_visualization':
                    response = await this.generateDataVisualization(query);
                    break;
                case 'resource_recommendation':
                    response = await this.recommendResources(query);
                    break;
                default:
                    // General query - pass to AI with context
                    response = await this.aiAgent.processQuery(
                        query, 
                        this.conversationHistory.slice(0, -1) // Exclude the current query
                    );
            }
            
            // Add AI response to history
            this.addToHistory('assistant', response.response);
            
            return response;
        } catch (error) {
            console.error('Error processing user query:', error);
            return {
                success: false,
                error: error.message,
                response: 'Sorry, there was an error processing your request.'
            };
        }
    }

    // Determine the appropriate action based on query analysis
    async determineAction(query) {
        const lowerQuery = query.toLowerCase();
        
        // Simple rule-based classification
        if (lowerQuery.includes('analyze') || 
            lowerQuery.includes('assessment') || 
            lowerQuery.includes('diagnosis')) {
            return 'mental_health_analysis';
        } else if (lowerQuery.includes('chart') || 
                  lowerQuery.includes('graph') || 
                  lowerQuery.includes('visualization') ||
                  lowerQuery.includes('data')) {
            return 'data_visualization';
        } else if (lowerQuery.includes('resource') || 
                  lowerQuery.includes('help') || 
                  lowerQuery.includes('support') ||
                  lowerQuery.includes('recommendation')) {
            return 'resource_recommendation';
        }
        
        // For more complex classification, use AI
        const classificationPrompt = `Classify the following mental health query into one of these categories:
        1. mental_health_analysis - for queries about analyzing mental health conditions
        2. data_visualization - for queries about visualizing mental health data
        3. resource_recommendation - for queries about finding resources or help
        4. general_query - for general questions
        
        Query: "${query}"
        
        Category:`;
        
        const result = await this.aiAgent.processQuery(classificationPrompt);
        const category = result.response.trim().toLowerCase();
        
        if (category.includes('mental_health_analysis')) {
            return 'mental_health_analysis';
        } else if (category.includes('data_visualization')) {
            return 'data_visualization';
        } else if (category.includes('resource_recommendation')) {
            return 'resource_recommendation';
        } else {
            return 'general_query';
        }
    }

    // Perform mental health analysis
    async performMentalHealthAnalysis(query) {
        const prompt = `You are a mental health assistant analyzing a user query. 
        Based on the following query, provide a thoughtful analysis of potential mental health concerns.
        Be compassionate, informative, and cautious not to make definitive diagnoses.
        
        User query: "${query}"
        
        Provide your analysis:`;
        
        return await this.aiAgent.processQuery(prompt, this.conversationHistory.slice(0, -1));
    }

    // Generate data visualization recommendations
    async generateDataVisualization(query) {
        // This would typically generate visualization code or recommendations
        const prompt = `You are a data visualization expert specializing in mental health data.
        Based on the following query, recommend appropriate visualizations or data analysis approaches.
        Include specific chart types, key metrics to display, and interpretation guidance.
        
        User query: "${query}"
        
        Available data: Mental health statistics for Rwandan youth, including depression, anxiety, and stress levels
        across urban and rural areas, different age groups, and genders.
        
        Provide your visualization recommendation:`;
        
        return await this.aiAgent.processQuery(prompt, this.conversationHistory.slice(0, -1));
    }

    // Recommend mental health resources
    async recommendResources(query) {
        const prompt = `You are a mental health resource specialist in Rwanda.
        Based on the following query, recommend appropriate mental health resources, support services,
        or coping strategies. Focus on resources available in Rwanda, particularly for youth.
        
        User query: "${query}"
        
        Provide your resource recommendations:`;
        
        return await this.aiAgent.processQuery(prompt, this.conversationHistory.slice(0, -1));
    }
}

// Export the agents
export const aiAgent = new AIAgent();
export const mentalHealthAgent = new MentalHealthAgent();


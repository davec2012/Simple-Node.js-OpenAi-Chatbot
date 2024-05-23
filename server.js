process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require('express');
const path = require('path');
const { OpenAIAPI } = require('./openai');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/getChatbotResponse', async (req, res) => {
    const userMessage = req.body.userMessage;

    if (!userMessage) {
        console.error('Error: No user message provided');
        return res.status(400).json({ error: 'No user message provided' });
    }

    try {
        console.log('User message received:', userMessage);

        // Use OpenAI API to generate a response
        const chatbotResponse = await OpenAIAPI.generateResponse(userMessage);

        console.log('Chatbot response generated:', chatbotResponse);

        // Send the response back to the client
        res.json({ chatbotResponse });
    } catch (error) {
        console.error('Error in /getChatbotResponse:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

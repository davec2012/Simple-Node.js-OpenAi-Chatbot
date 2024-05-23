const fetch = require('node-fetch'); // Ensure you have node-fetch installed

class OpenAIAPI {
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.error('Error: OpenAI API key is not defined');
            return 'API key is missing. Please set the API key.';
        }

        const endpoint = 'https://api.openai.com/v1/chat/completions';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                    max_tokens: 150
                }),
            });

            if (!response.ok) {
                console.error('Error response from OpenAI API:', response.status, response.statusText);
                throw new Error(`OpenAI API request failed with status ${response.status}`);
            }

            const responseData = await response.json();
            // Log the entire API response for debugging
            console.log('Response from OpenAI API:', responseData);

            // Check if choices array is defined and not empty
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
                return responseData.choices[0].message.content.trim();
            } else {
                console.error('Error: No valid response from OpenAI API');
                return 'Sorry, I couldn\'t understand that.';
            }
        } catch (error) {
            console.error('Error in generating response:', error);
            return 'Sorry, something went wrong. Please try again later.';
        }
    }
}

module.exports = { OpenAIAPI };

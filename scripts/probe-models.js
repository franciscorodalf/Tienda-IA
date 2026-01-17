const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error('No API Key found.');
        return;
    }

    console.log('Listing models via raw Request...');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                // Check if model supports generateContent
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('Unexpected response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

listModels();

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testChat() {
    console.log('Testing Chat API...');

    if (!process.env.GOOGLE_API_KEY) {
        console.error('ERROR: GOOGLE_API_KEY is missing from .env.local');
        process.exit(1);
    }

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Hola, busco una chaqueta',
                history: [],
            }),
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.status === 200 && !data.error) {
            console.log('SUCCESS: API is working.');
        } else {
            console.error('FAILURE: API returned error.');
        }

    } catch (error) {
        console.error('Error fetching API:', error);
    }
}

testChat();

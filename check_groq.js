const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables manually since we aren't in Next.js runtime
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function checkGroq() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("❌ No se encontró GROQ_API_KEY en .env.local");
        return;
    }

    console.log("🔑 API Key encontrada (termina en ..." + apiKey.slice(-4) + ")");

    const groq = new Groq({ apiKey });

    try {
        console.log("📡 Conectando con Groq...");
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: '¿Estás operativo? Responde con un simple "Sí, listo".' }],
            model: 'llama-3.3-70b-versatile',
        });

        console.log("\n✅ ¡Conexión Exitosa!");
        console.log("🤖 Respuesta del modelo:", completion.choices[0].message.content);
        console.log("\nTodo parece estar listo. Puedes iniciar el servidor con `npm run dev`.");

    } catch (error) {
        console.error("\n❌ Error al conectar con Groq:", error.message);
        if (error.message.includes('401')) {
            console.error("   -> Probablemente la API Key es incorrecta.");
        }
    }
}

checkGroq();

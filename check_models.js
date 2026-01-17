const fs = require('fs');
const path = require('path');

// Función para leer la API Key desde .env.local
function getApiKey() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
            return match ? match[1].trim() : null;
        }
    } catch (err) {
        console.error("Error leyendo .env.local:", err);
    }
    return null;
}

const apiKey = getApiKey();

async function listModels() {
    if (!apiKey) {
        console.error("❌ No se encontró GOOGLE_API_KEY en .env.local");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error de la API:", data.error.message);
            return;
        }

        console.log("\n✨ MODELOS DISPONIBLES PARA TU CUENTA ✨");
        console.log("========================================");

        // Filtramos solo los que son 'generateContent' (chat)
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        chatModels.forEach(model => {
            console.log(`✅ Nombre: ${model.name.replace('models/', '')}`);
            console.log(`   Versión: ${model.version}`);
            console.log("----------------------------------------");
        });

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

// Validación de la key (detecta si es la por defecto/placeholder)
const PLACEHOLDER_KEY_PART = "AIzaSyAXwB-vY_fXRGAWRWWCpC7aOYdlDO8kSkw";

if (!apiKey || apiKey.includes(PLACEHOLDER_KEY_PART)) {
    console.log("⚠️  La API Key en .env.local parece ser la por defecto o es inválida.");
    console.log("    Por favor, edita .env.local y pon una clave válida de Google AI Studio.");
} else {
    listModels();
}
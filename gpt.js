require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration de l'API OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('La clé API OPENAI_API_KEY est manquante. Vérifiez votre fichier .env.');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Route pour gérer les requêtes de chat
app.post('/api/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        // Appel à l'API OpenAI pour générer une réponse
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage },
            ],
        });

        // Retourner la réponse générée par le modèle
        const botMessage = completion.choices[0].message.content;
        res.json({ botMessage });
        console.log(botMessage);
    } catch (error) {
        console.error('Erreur lors de la communication avec OpenAI:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

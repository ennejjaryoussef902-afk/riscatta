import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Gestione CORS obbligatoria per Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { pin } = req.body;
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            console.error("ERRORE: La variabile MONGODB_URI non è configurata su Vercel!");
            return res.status(500).json({ message: "Configurazione server mancante" });
        }

        const client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('Fabbricachat'); 
        const collection = db.collection('codici');

        const result = await collection.findOne({ pin: pin });
        await client.close();

        if (result) {
            return res.status(200).json({ success: true, amount: result.valore });
        } else {
            return res.status(401).json({ success: false, message: "PIN non trovato" });
        }
    } catch (error) {
        console.error("ERRORE DETTAGLIATO:", error);
        return res.status(500).json({ message: "Errore interno del database", details: error.message });
    }
}

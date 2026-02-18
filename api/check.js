import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Gestione CORS per permettere al sito di comunicare con l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { pin } = req.body;

    // 1. Controllo rapido tramite variabile d'ambiente (per velocità)
    if (pin === process.env.PIN_10_EURO) {
        return res.status(200).json({ success: true, amount: 10 });
    }

    // 2. Controllo tramite MongoDB (per database dinamico)
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('tuo_database');
        const collection = db.collection('codici');

        const result = await collection.findOne({ codice: pin });
        client.close();

        if (result) {
            return res.status(200).json({ success: true, amount: result.valore });
        } else {
            return res.status(401).json({ success: false, message: "PIN Errato" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Errore connessione DB" });
    }
}

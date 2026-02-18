import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    // Gestione CORS per evitare errori di blocco dal browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Metodo non consentito' });

    const { pin } = req.body;
    const uri = process.env.MONGODB_URI;

    if (!pin) return res.status(400).json({ message: 'Inserisci un PIN' });

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        
        // Puntiamo al tuo database "Fabbricachat"
        const db = client.db('Fabbricachat'); 
        const collection = db.collection('codici'); // Assicurati che la collezione si chiami 'codici'

        // Cerchiamo il PIN inserito dall'utente
        const result = await collection.findOne({ pin: pin });

        if (result) {
            return res.status(200).json({ 
                success: true, 
                amount: result.valore || 0 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'PIN errato o già utilizzato' 
            });
        }
    } catch (error) {
        console.error("Errore DB:", error);
        return res.status(500).json({ message: 'Errore tecnico del server' });
    } finally {
        if (client) await client.close();
    }
}

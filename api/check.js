export default async function handler(req, res) {
    // Permessi CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Gestione Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Se lo visiti dal browser (GET), non crashare!
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: "Online", 
            message: "Il server riscatta è attivo. Usa l'app per inviare i codici." 
        });
    }

    if (req.method === 'POST') {
        try {
            // Controllo se il body esiste prima di leggere il PIN
            const pin = req.body ? req.body.pin : null;

            if (!pin) {
                return res.status(400).json({ success: false, message: "PIN mancante" });
            }

            const code5 = process.env.CODE_5_EURO;
            const code10 = process.env.CODE_10_EURO;

            if (pin === code5) {
                return res.status(200).json({ success: true, amount: 5.00 });
            } else if (pin === code10) {
                return res.status(200).json({ success: true, amount: 10.00 });
            } else {
                return res.status(401).json({ success: false, message: "Codice errato" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Errore interno del server" });
        }
    }

    return res.status(405).json({ message: "Metodo non consentito" });
}

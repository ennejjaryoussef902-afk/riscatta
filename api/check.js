export default function handler(req, res) {
    // 1. Permessi per il browser (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { pin } = req.body;

        // 2. Confronto con le variabili d'ambiente di Vercel
        // Assicurati di aver creato queste chiavi nel pannello di Vercel
        const PIN_10 = process.env.PIN_10_EURO; 
        const PIN_5 = process.env.PIN_5_EURO;

        if (pin && pin === PIN_10) {
            return res.status(200).json({ success: true, amount: 10 });
        } else if (pin && pin === PIN_5) {
            return res.status(200).json({ success: true, amount: 5 });
        } else {
            return res.status(401).json({ success: false, message: "PIN Errato" });
        }
    } catch (error) {
        // Se arriviamo qui, il server ha un problema di sintassi
        return res.status(500).json({ success: false, error: "Errore Interno" });
    }
}

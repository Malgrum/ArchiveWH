import React, { useState, useEffect } from 'react';
const UNIVERSES = [
    { key: '40k', label: 'Warhammer 40,000' },
    { key: 'aos', label: 'Age of Sigmar' },
];
const MODES = [
    { key: 'classique', label: 'Classique' },
    { key: 'killteam', label: 'Kill Team' },
];
const FACTIONS = {
    '40k': ['Space Marines', 'Astra Militarum', 'Orks', 'Tyranids'],
    'aos': ['Stormcast', 'Nighthaunt', 'Orruks', 'Sylvaneth'],
};

function CodexPage() {
    const [step, setStep] = useState(() => localStorage.getItem('codex_step') || 'universe');
    const [universe, setUniverse] = useState(() => localStorage.getItem('codex_universe') || '');
    const [mode, setMode] = useState(() => localStorage.getItem('codex_mode') || '');
    const [faction, setFaction] = useState(() => localStorage.getItem('codex_faction') || '');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Persistance locale
    useEffect(() => {
        localStorage.setItem('codex_step', step);
        localStorage.setItem('codex_universe', universe);
        localStorage.setItem('codex_mode', mode);
        localStorage.setItem('codex_faction', faction);
    }, [step, universe, mode, faction]);

    // Charger les entrées du codex pour la faction sélectionnée
    useEffect(() => {
        if (step === 'index' && universe && mode && faction) {
            setLoading(true);
            fetch(`http://localhost:4000/api/codex?universe=${universe}&mode=${mode}&faction=${encodeURIComponent(faction)}`)
                .then(res => res.ok ? res.json() : Promise.reject('Erreur API'))
                .then(data => { setEntries(data); setError(null); })
                .catch(e => setError(e.toString()))
                .finally(() => setLoading(false));
        }
    }, [step, universe, mode, faction]);

    // Navigation
    const handleBack = () => {
        if (step === 'index') setStep('faction');
        else if (step === 'faction') setStep('mode');
        else if (step === 'mode') setStep('universe');
    };

    // Rendu dynamique selon l'étape
    let content;
    if (step === 'universe') {
        content = (
            <div>
                <h2>Choisis ton univers</h2>
                {UNIVERSES.map(u => (
                    <button key={u.key} onClick={() => { setUniverse(u.key); setMode(''); setFaction(''); setStep('mode'); }} style={{ display: 'block', margin: '12px 0', padding: '12px 24px', fontSize: '1.1rem' }}>{u.label}</button>
                ))}
            </div>
        );
    } else if (step === 'mode') {
        content = (
            <div>
                <h2>Mode de jeu</h2>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => { setMode(m.key); setFaction(''); setStep('faction'); }} style={{ display: 'block', margin: '12px 0', padding: '12px 24px', fontSize: '1.1rem' }}>{m.label}</button>
                ))}
                <button onClick={handleBack} style={{ marginTop: 24 }}>Retour</button>
            </div>
        );
    } else if (step === 'faction') {
        content = (
            <div>
                <h2>Faction</h2>
                {(FACTIONS[universe] || []).map(f => (
                    <button key={f} onClick={() => { setFaction(f); setStep('index'); }} style={{ display: 'block', margin: '12px 0', padding: '12px 24px', fontSize: '1.1rem' }}>{f}</button>
                ))}
                <button onClick={handleBack} style={{ marginTop: 24 }}>Retour</button>
            </div>
        );
    } else if (step === 'index') {
        content = (
            <div>
                <h2>Index de {faction}</h2>
                {loading ? <div>Chargement...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
                    entries.length === 0 ? <p>Aucun index trouvé.</p> : (
                        entries.map(entry => (
                            <div key={entry.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                                <h3>{entry.title}</h3>
                                <p>{entry.content}</p>
                            </div>
                        ))
                    )
                )}
                <button onClick={handleBack} style={{ marginTop: 24 }}>Retour</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Codex</h1>
            {content}
        </div>
    );
}

export default CodexPage;
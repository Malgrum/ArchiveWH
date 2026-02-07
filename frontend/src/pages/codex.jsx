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

function CodexPage({ user }) {
    const [step, setStep] = useState(() => localStorage.getItem('codex_step') || 'universe');
    const [universe, setUniverse] = useState(() => localStorage.getItem('codex_universe') || '');
    const [mode, setMode] = useState(() => localStorage.getItem('codex_mode') || '');
    const [faction, setFaction] = useState(() => localStorage.getItem('codex_faction') || '');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAdmin = !!user?.is_admin;
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        range_weapons: [
            { name: '', bonus: '', range: '', attacks: '', strength: '', ap: '', damage: '' }
        ],
        melee_weapons: [
            { name: '', bonus: '', range: 'Mêlée', attacks: '', strength: '', ap: '', damage: '' }
        ],
        abilitie: '',
        points: '',
        keywords: ''
    });

    // Persistance locale
    useEffect(() => {
        localStorage.setItem('codex_step', step);
        localStorage.setItem('codex_universe', universe);
        localStorage.setItem('codex_mode', mode);
        localStorage.setItem('codex_faction', faction);
    }, [step, universe, mode, faction]);

    // Charger les entrées du codex pour la faction sélectionnée
    const loadEntries = () => {
        if (step === 'index' && universe && mode && faction) {
            setLoading(true);
            fetch(`http://localhost:4000/api/codex?universe=${universe}&mode=${mode}&faction=${encodeURIComponent(faction)}`)
                .then(res => res.ok ? res.json() : Promise.reject('Erreur API'))
                .then(data => { setEntries(data); setError(null); })
                .catch(e => setError(e.toString()))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        loadEntries();
    }, [step, universe, mode, faction]);

    const resetForm = () => {
        setFormData({
            title: '',
            range_weapons: [
                { name: '', bonus: '', range: '', attacks: '', strength: '', ap: '', damage: '' }
            ],
            melee_weapons: [
                { name: '', bonus: '', range: 'Mêlée', attacks: '', strength: '', ap: '', damage: '' }
            ],
            abilitie: '',
            points: '',
            keywords: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const parseWeapons = (value, fallback = []) => {
        if (!value) return fallback;
        if (Array.isArray(value)) return value;
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    };

    const startEdit = (entry) => {
        setEditingId(entry.id);
        setShowForm(true);
        setFormData({
            title: entry.title || '',
            range_weapons: parseWeapons(entry.range_weapons, entry.range_weapon ? [{
                name: entry.range_weapon,
                bonus: entry.range_bonus || '',
                range: entry.range_range || '',
                attacks: entry.range_attacks ?? '',
                strength: entry.range_strength ?? '',
                ap: entry.range_ap ?? '',
                damage: entry.range_damage || ''
            }] : [{ name: '', bonus: '', range: '', attacks: '', strength: '', ap: '', damage: '' }]),
            melee_weapons: parseWeapons(entry.melee_weapons, entry.melee_weapon ? [{
                name: entry.melee_weapon,
                bonus: entry.melee_bonus || '',
                range: 'Mêlée',
                attacks: entry.melee_attacks ?? '',
                strength: entry.melee_strength ?? '',
                ap: entry.melee_ap ?? '',
                damage: entry.melee_damage || ''
            }] : [{ name: '', bonus: '', range: 'Mêlée', attacks: '', strength: '', ap: '', damage: '' }]),
            abilitie: entry.abilitie || '',
            points: entry.points ?? '',
            keywords: entry.keywords || ''
        });
    };

    const saveEntry = async (e) => {
        e.preventDefault();
        try {
            const normalizeWeapon = (w) => ({
                name: w.name || '',
                bonus: w.bonus || '',
                range: w.range || '',
                attacks: w.attacks === '' ? null : Number(w.attacks),
                strength: w.strength === '' ? null : Number(w.strength),
                ap: w.ap === '' ? null : Number(w.ap),
                damage: w.damage || ''
            });
            const payload = {
                title: formData.title,
                universe,
                mode,
                faction,
                range_weapons: (formData.range_weapons || []).map(normalizeWeapon),
                melee_weapons: (formData.melee_weapons || []).map(normalizeWeapon),
                abilitie: formData.abilitie,
                points: formData.points === '' ? null : Number(formData.points),
                keywords: formData.keywords
            };
            const url = editingId
                ? `http://localhost:4000/api/codex/${editingId}`
                : 'http://localhost:4000/api/codex';
            const method = editingId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Échec sauvegarde codex');
            resetForm();
            loadEntries();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteEntry = async (entryId) => {
        if (!window.confirm('Supprimer cette entrée du codex ?')) return;
        try {
            const response = await fetch(`http://localhost:4000/api/codex/${entryId}`, {
                method: 'DELETE',
                headers: { 'x-user-id': user?.id }
            });
            if (!response.ok) throw new Error('Échec suppression codex');
            loadEntries();
        } catch (err) {
            setError(err.message);
        }
    };

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
                {isAdmin && (
                    <div style={{ marginBottom: 16 }}>
                        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} style={{ padding: '8px 12px', marginRight: 8 }}>
                            {showForm ? 'Fermer' : 'Ajouter une entrée'}
                        </button>
                        {showForm && (
                            <form onSubmit={saveEntry} style={{ marginTop: 12, border: '1px solid #444', padding: 12, borderRadius: 6 }}>
                                <input
                                    type="text"
                                    placeholder="Titre"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                                />
                                <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
                                    <div style={{ border: '1px solid #444', padding: 10, borderRadius: 6 }}>
                                        <strong style={{ display: 'block', marginBottom: 8 }}>Armes de tir</strong>
                                        {formData.range_weapons.map((weapon, idx) => (
                                            <div key={`range-${idx}`} style={{ border: '1px dashed #555', padding: 8, borderRadius: 6, marginBottom: 8 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={weapon.name}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], name: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Bonus"
                                                    value={weapon.bonus}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], bonus: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Portée"
                                                    value={weapon.range}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], range: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Attaques"
                                                    value={weapon.attacks}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], attacks: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Force"
                                                    value={weapon.strength}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], strength: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="PA"
                                                    value={weapon.ap}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], ap: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dégâts"
                                                    value={weapon.damage}
                                                    onChange={(e) => setFormData(prev => {
                                                        const range_weapons = [...prev.range_weapons];
                                                        range_weapons[idx] = { ...range_weapons[idx], damage: e.target.value };
                                                        return { ...prev, range_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            range_weapons: prev.range_weapons.filter((_, i) => i !== idx)
                                                        }))}
                                                        style={{ padding: '6px 10px', color: '#f87171' }}
                                                    >
                                                        Supprimer l'arme
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                range_weapons: [...prev.range_weapons, { name: '', bonus: '', range: '', attacks: '', strength: '', ap: '', damage: '' }]
                                            }))}
                                            style={{ padding: '6px 10px' }}
                                        >
                                            + Ajouter une arme de tir
                                        </button>
                                    </div>
                                    <div style={{ border: '1px solid #444', padding: 10, borderRadius: 6 }}>
                                        <strong style={{ display: 'block', marginBottom: 8 }}>Armes de mêlée</strong>
                                        {formData.melee_weapons.map((weapon, idx) => (
                                            <div key={`melee-${idx}`} style={{ border: '1px dashed #555', padding: 8, borderRadius: 6, marginBottom: 8 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Nom"
                                                    value={weapon.name}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], name: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Bonus"
                                                    value={weapon.bonus}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], bonus: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Portée"
                                                    value={weapon.range}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], range: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Attaques"
                                                    value={weapon.attacks}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], attacks: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Force"
                                                    value={weapon.strength}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], strength: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="PA"
                                                    value={weapon.ap}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], ap: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dégâts"
                                                    value={weapon.damage}
                                                    onChange={(e) => setFormData(prev => {
                                                        const melee_weapons = [...prev.melee_weapons];
                                                        melee_weapons[idx] = { ...melee_weapons[idx], damage: e.target.value };
                                                        return { ...prev, melee_weapons };
                                                    })}
                                                    style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            melee_weapons: prev.melee_weapons.filter((_, i) => i !== idx)
                                                        }))}
                                                        style={{ padding: '6px 10px', color: '#f87171' }}
                                                    >
                                                        Supprimer l'arme
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                melee_weapons: [...prev.melee_weapons, { name: '', bonus: '', range: 'Mêlée', attacks: '', strength: '', ap: '', damage: '' }]
                                            }))}
                                            style={{ padding: '6px 10px' }}
                                        >
                                            + Ajouter une arme de mêlée
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Capacités"
                                    value={formData.abilitie}
                                    onChange={(e) => setFormData(prev => ({ ...prev, abilitie: e.target.value }))}
                                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', minHeight: '120px' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Points"
                                    value={formData.points}
                                    onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Mots-clés"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                                />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="submit" style={{ padding: '8px 12px' }}>{editingId ? 'Mettre à jour' : 'Créer'}</button>
                                    <button type="button" onClick={resetForm} style={{ padding: '8px 12px' }}>Annuler</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
                {loading ? <div>Chargement...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
                    entries.length === 0 ? <p>Aucun index trouvé.</p> : (
                        entries.map(entry => (
                            <div key={entry.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                                <h3>{entry.title}</h3>
                                {entry.abilitie && <p><strong>Capacités:</strong> {entry.abilitie}</p>}
                                {parseWeapons(entry.range_weapons, entry.range_weapon ? [{
                                    name: entry.range_weapon,
                                    bonus: entry.range_bonus || '',
                                    range: entry.range_range || '',
                                    attacks: entry.range_attacks ?? '',
                                    strength: entry.range_strength ?? '',
                                    ap: entry.range_ap ?? '',
                                    damage: entry.range_damage || ''
                                }] : []).map((w, idx) => (
                                    <p key={`r-${entry.id}-${idx}`}>
                                        <strong>Arme de tir:</strong> {w.name || '-'}
                                        {w.bonus ? ` (${w.bonus})` : ''}
                                        {' — '}
                                        Portée: {w.range || '-'}, Attaques: {w.attacks ?? '-'}, Force: {w.strength ?? '-'}, PA: {w.ap ?? '-'}, Dégâts: {w.damage || '-'}
                                    </p>
                                ))}
                                {parseWeapons(entry.melee_weapons, entry.melee_weapon ? [{
                                    name: entry.melee_weapon,
                                    bonus: entry.melee_bonus || '',
                                    range: 'Mêlée',
                                    attacks: entry.melee_attacks ?? '',
                                    strength: entry.melee_strength ?? '',
                                    ap: entry.melee_ap ?? '',
                                    damage: entry.melee_damage || ''
                                }] : []).map((w, idx) => (
                                    <p key={`m-${entry.id}-${idx}`}>
                                        <strong>Arme de mêlée:</strong> {w.name || '-'}
                                        {w.bonus ? ` (${w.bonus})` : ''}
                                        {' — '}
                                        Portée: {w.range || 'Mêlée'}, Attaques: {w.attacks ?? '-'}, Force: {w.strength ?? '-'}, PA: {w.ap ?? '-'}, Dégâts: {w.damage || '-'}
                                    </p>
                                ))}
                                {entry.points !== null && entry.points !== undefined && <p><strong>Points:</strong> {entry.points}</p>}
                                {entry.keywords && <p><strong>Mots-clés:</strong> {entry.keywords}</p>}
                                {isAdmin && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                        <button onClick={() => startEdit(entry)} style={{ padding: '6px 10px' }}>Modifier</button>
                                        <button onClick={() => deleteEntry(entry.id)} style={{ padding: '6px 10px', color: '#f87171' }}>Supprimer</button>
                                    </div>
                                )}
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
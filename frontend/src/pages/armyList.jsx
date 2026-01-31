import React, { useState, useEffect } from 'react';

const ArmyListPage = ({ username }) => {
    if (!username) {
        return (
            <div style={{ padding: '20px', color: '#f87171', textAlign: 'center' }}>
                <h1>Listes d'Armées</h1>
                <p>Vous devez être connecté pour accéder à vos listes d'armée.</p>
            </div>
        );
    }

    const [armyLists, setArmyLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const MODES = [
        { key: '40k', label: 'Warhammer 40,000' },
        { key: 'aos', label: 'Age of Sigmar' },
        { key: 'warcry', label: 'Warcry' },
        { key: 'killteam', label: 'Kill Team' },
    ];
    const FACTIONS = {
        '40k': ['Space Marines', 'Astra Militarum', 'Orks', 'Tyranids'],
        'aos': ['Stormcast', 'Nighthaunt', 'Orruks', 'Sylvaneth'],
        'warcry': ['Iron Golems', 'Untamed Beasts', 'Corvus Cabal'],
        'killteam': ['Vet Guard', 'Kommandos', 'Pathfinders'],
    };
    const [formData, setFormData] = useState({
        name: '',
        mode: '',
        points: '',
        faction: '',
        units: [],
        content: ''
    });
    const [codexUnits, setCodexUnits] = useState([]);
    const [userId, setUserId] = useState(null);
    const [users, setUsers] = useState([]);

    // Fetch all users to get the current user's id
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/users');
            if (!res.ok) throw new Error('Erreur chargement utilisateurs');
            const data = await res.json();
            setUsers(data);
            const me = data.find(u => u.username === username);
            if (me) setUserId(me.id);
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        if (userId) fetchArmyLists();
    }, [userId]);

    const fetchArmyLists = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/api/army-lists/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch army lists');
            const data = await response.json();
            setArmyLists(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                universe: formData.universe,
                mode: formData.mode,
                points: formData.points,
                faction: formData.faction,
                units: formData.units,
                content: formData.content,
                user_id: userId
            };
            const response = await fetch('http://localhost:4000/api/army-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to create army list');
            setFormData({
                name: '',
                universe: '',
                mode: '',
                points: '',
                faction: '',
                units: [],
                content: ''
            });
            setShowForm(false);
            await fetchArmyLists();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'units') {
            // Checkbox for units
            setFormData(prev => {
                let units = prev.units || [];
                if (checked) {
                    units = [...units, value];
                } else {
                    units = units.filter(u => u !== value);
                }
                return { ...prev, units };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Fetch codex units when mode or faction changes
    useEffect(() => {
        const fetchCodex = async () => {
            if (formData.faction && formData.mode) {
                try {
                    const res = await fetch(`http://localhost:4000/api/codex?faction=${encodeURIComponent(formData.faction)}&mode=${encodeURIComponent(formData.mode)}`);
                    if (!res.ok) throw new Error('Erreur chargement codex');
                    const data = await res.json();
                    setCodexUnits(data);
                } catch (e) {
                    setCodexUnits([]);
                }
            } else {
                setCodexUnits([]);
            }
        };
        fetchCodex();
    }, [formData.faction, formData.mode]);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Listes d'Armées</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                {showForm ? 'Annuler' : 'Nouvelle Liste'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
                    {/* Mode de jeu */}
                    <label style={{ display: 'block', marginBottom: 8 }}>Mode de jeu</label>
                    <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    >
                        <option value="">-- Choisir le mode --</option>
                        {MODES.map(m => (
                            <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                    </select>

                    {/* Points max (sauf kill team/warcry) */}
                    {formData.mode && !['killteam', 'warcry'].includes(formData.mode) && (
                        <>
                        <label style={{ display: 'block', marginBottom: 8 }}>Points max</label>
                        <input
                            type="number"
                            name="points"
                            placeholder="ex: 2000"
                            value={formData.points}
                            onChange={handleInputChange}
                            min={100}
                            max={10000}
                            required
                            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                        </>
                    )}

                    {/* Faction (dépend du mode) */}
                    <label style={{ display: 'block', marginBottom: 8 }}>Faction</label>
                    <select
                        name="faction"
                        value={formData.faction}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        disabled={!formData.mode}
                    >
                        <option value="">-- Choisir la faction --</option>
                        {(FACTIONS[formData.mode] || []).map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    {/* Unités du codex (checkbox) */}
                    {codexUnits.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Unités du codex</label>
                            {codexUnits.map(unit => (
                                <label key={unit.id} style={{ display: 'block', marginBottom: 4 }}>
                                    <input
                                        type="checkbox"
                                        name="units"
                                        value={unit.title}
                                        checked={formData.units.includes(unit.title)}
                                        onChange={handleInputChange}
                                    /> {unit.title}
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Nom de la liste */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom de la liste"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    />
                    {/* Description libre */}
                    <textarea
                        name="content"
                        placeholder="Contenu de la liste..."
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', minHeight: '150px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px' }}>Créer</button>
                </form>
            )}

            <div>
                {armyLists.length === 0 ? (
                    <p>Aucune liste créée.</p>
                ) : (
                    armyLists.map(list => (
                        <div key={list.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                            <h3>{list.name}</h3>
                            <p><strong>Faction:</strong> {list.faction}</p>
                            <p>{list.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ArmyListPage;
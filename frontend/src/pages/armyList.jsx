import React, { useState, useEffect } from 'react';

const ArmyListPage = () => {
    const [armyLists, setArmyLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', faction: '', content: '' });

    useEffect(() => {
        fetchArmyLists();
    }, []);

    const fetchArmyLists = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/army-lists');
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
            const response = await fetch('http://localhost:4000/api/army-lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1, ...formData })
            });
            if (!response.ok) throw new Error('Failed to create army list');
            setFormData({ name: '', faction: '', content: '' });
            setShowForm(false);
            await fetchArmyLists();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom de la liste"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    />
                    <input
                        type="text"
                        name="faction"
                        placeholder="Faction (40k/AoS)"
                        value={formData.faction}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    />
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
                            <p><strong>Auteur:</strong> {list.author}</p>
                            <p>{list.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ArmyListPage;
import React, { useState, useEffect } from 'react';
const UNIVERSES = [
    { key: '40k', label: 'Warhammer 40,000' },
    { key: 'aos', label: 'Age of Sigmar' },
];

const BattleReportPage = ({ username }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        universe: '',
        armyListId: '',
        opponentType: 'account',
        opponentUserId: '',
        opponentInvite: '',
    });
    const [users, setUsers] = useState([]);
    const [armyLists, setArmyLists] = useState([]);
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        fetchReports();
        fetchUsers();
    }, []);

    // Fetch all users for opponent selection
    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/users');
            if (!res.ok) throw new Error('Erreur chargement utilisateurs');
            const data = await res.json();
            setUsers(data);
            // Find my user id
            if (username) {
                const me = data.find(u => u.username === username);
                if (me) setMyUserId(me.id);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/battle-reports');
            if (!response.ok) throw new Error('Failed to fetch battle reports');
            const data = await response.json();
            setReports(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch army lists for the current user and selected universe
    useEffect(() => {
        if (myUserId && formData.universe) {
            fetchArmyListsForUser(myUserId, formData.universe);
        } else {
            setArmyLists([]);
        }
    }, [myUserId, formData.universe]);

    const fetchArmyListsForUser = async (userId, universe) => {
        try {
            const res = await fetch(`http://localhost:4000/api/army-lists/user/${userId}`);
            if (!res.ok) throw new Error('Erreur chargement listes');
            let data = await res.json();
            // Filter by universe if possible (assume faction contains universe info)
            data = data.filter(l => l.faction && l.faction.toLowerCase().includes(universe));
            setArmyLists(data);
        } catch (e) {
            setArmyLists([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                user_id: myUserId,
                title: formData.title,
                content: formData.content,
                universe: formData.universe,
                army_list_id: formData.armyListId,
                opponent_type: formData.opponentType,
                opponent_user_id: formData.opponentType === 'account' ? formData.opponentUserId : null,
                opponent_invite: formData.opponentType === 'invite' ? formData.opponentInvite : null,
            };
            const response = await fetch('http://localhost:4000/api/battle-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to create report');
            setFormData({ title: '', content: '', universe: '', armyListId: '', opponentType: 'account', opponentUserId: '', opponentInvite: '' });
            setShowForm(false);
            await fetchReports();
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
            <h1>Rapports de Batailles</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px', padding: '10px 20px' }}>
                {showForm ? 'Annuler' : 'Nouveau Rapport'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
                    {/* Universe selection */}
                    <label style={{ display: 'block', marginBottom: 8 }}>Univers</label>
                    <select
                        name="universe"
                        value={formData.universe}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    >
                        <option value="">-- Choisir l'univers --</option>
                        {UNIVERSES.map(u => (
                            <option key={u.key} value={u.key}>{u.label}</option>
                        ))}
                    </select>

                    {/* Army list selection (auto for user/universe) */}
                    <label style={{ display: 'block', marginBottom: 8 }}>Ma liste d'armée</label>
                    <select
                        name="armyListId"
                        value={formData.armyListId}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        disabled={!armyLists.length}
                    >
                        <option value="">-- Choisir une liste --</option>
                        {armyLists.map(l => (
                            <option key={l.id} value={l.id}>{l.name} ({l.faction})</option>
                        ))}
                    </select>

                    {/* Opponent selection logic */}
                    <label style={{ display: 'block', marginBottom: 8 }}>Adversaire</label>
                    <div style={{ marginBottom: 10 }}>
                        <label style={{ marginRight: 16 }}>
                            <input
                                type="radio"
                                name="opponentType"
                                value="account"
                                checked={formData.opponentType === 'account'}
                                onChange={handleInputChange}
                            /> Compte du club
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="opponentType"
                                value="invite"
                                checked={formData.opponentType === 'invite'}
                                onChange={handleInputChange}
                            /> Invité (pas de compte)
                        </label>
                    </div>
                    {formData.opponentType === 'account' ? (
                        <select
                            name="opponentUserId"
                            value={formData.opponentUserId}
                            onChange={handleInputChange}
                            required
                            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        >
                            <option value="">-- Choisir un membre --</option>
                            {users.filter(u => u.id !== myUserId).map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="opponentInvite"
                            placeholder="Nom de l'invité"
                            value={formData.opponentInvite}
                            onChange={handleInputChange}
                            required
                            style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                        />
                    )}

                    {/* Title and content */}
                    <input
                        type="text"
                        name="title"
                        placeholder="Titre du rapport"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                    />
                    <textarea
                        name="content"
                        placeholder="Détails du rapport..."
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', minHeight: '200px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px' }}>Créer</button>
                </form>
            )}

            <div>
                {reports.length === 0 ? (
                    <p>Aucun rapport créé.</p>
                ) : (
                    reports.map(report => (
                        <div key={report.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                            <h3>{report.title}</h3>
                            <p><strong>Auteur:</strong> {report.author}</p>
                            <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
                            <p>{report.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BattleReportPage;
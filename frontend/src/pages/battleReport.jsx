import React, { useState, useEffect } from 'react';

const BattleReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchReports();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/battle-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1, ...formData })
            });
            if (!response.ok) throw new Error('Failed to create report');
            setFormData({ title: '', content: '' });
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
import React, { useState } from 'react';

const RulesPage = () => {
  const [universe, setUniverse] = useState('');
  const [section, setSection] = useState('quick');
  const [bonusQuery, setBonusQuery] = useState('');

  const sections = [
    { key: 'quick', label: 'Règle rapide' },
    { key: 'bonus', label: 'Bonus' },
    { key: 'ranged', label: 'Tir' },
    { key: 'melee', label: 'Mêlée' },
    { key: 'objectives', label: 'Objectifs' },
  ];

  let content;
  if (section === 'quick') {
    content = (
      <div>
        <h2>Règle rapide</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>Phases de tour selon le jeu (mouvement, tir, charge, combat, moral).</li>
          <li>Priorité aux objectifs pour marquer.</li>
          <li>Règles spéciales par faction/équipe.</li>
        </ul>
      </div>
    );
  } else if (section === 'bonus') {
    const bonusCards = [
      {
        title: 'Anti-Infanterie X',
        items: [
          'A la phase de tir ou de mêlée, vos jet de blessure équal ou supérieur à X comptent comme des succès critiques contre les unités d’infanterie.',
        ]
      },
      {
        title: 'Anti-Monstre X',
        items: [
          'A la phase de tir ou de mêlée, vos jet de blessure équal ou supérieur à X comptent comme des succès critiques contre les unités de monstre.',
        ]
      },
      {
        title: 'Anti-Véhicule X',
        items: [
          'A la phase de tir ou de mêlée, vos jet de blessure équal ou supérieur à X comptent comme des succès critiques contre les véhicules.',
        ]
      },
      {
        title: 'Anti-Vol X',
        items: [
          'A la phase de tir ou de mêlée, vos jet de blessure équal ou supérieur à X comptent comme des succès critiques contre les unités volantes.',
        ]
      },

      {
        title: 'Assault',
        items: [
          'Après un mouvement d avance, vous pouvez tirée avec l arme',
        ]
      },

      {
        title: 'Ignore le couvert',
        items: [
          'Les tires effectuée avec ces armes, annule le couvert de la cible'
        ]
      },

      {
        title: 'Jumelé',
        items: [
          'A la phase de tir, vous pouvez relancé les jets de blessures',
        ]
      },
      {
        title: 'Lance',
        items: [
          'A chaque attaque avec cette arme, ajouter 1 au jet de blessure si elle a charger ce tour'
        ]
      },
      {
        title: 'Melta X',
        items: [
          'A votre phase de tir, si vous êtes à la moitié de la portée de l arme, ajouter X au dégat de la dites arme.'
        ]
      },

      {
        title: 'Pistolet',
        items: [
          'Une figurine qui est au corps à corps peut tirer pendant ça phase de tire sur l unité quelle affronte.',
        ]
      },

      {
        title: 'Surchauffe',
        items: [
          'Après votre phase de tir ou de mêlée, lancer un D6, sur un 1 votre figurine se prend 3 dégats.'
        ]
      },

      {
        title: 'Tir rapide X',
        items: [
          'A votre phase de tir, si vous êtes à la moitié de la portée de l arme, ajouter X au dé'
        ]
      },
      {
        title: 'Touches fatales',
        items: [
          'A votre phase de tir ou de mélée, chaque touche critique, blesse automatiquement'
        ]
      },
      {
        title: 'Torrent',
        items: [
          'Les armes avec torrent, touche automatiquement'
        ]
      }
    ];

    const normalizedQuery = bonusQuery.trim().toLowerCase();
    const filteredCards = normalizedQuery
      ? bonusCards.filter(card => {
          const inTitle = card.title.toLowerCase().includes(normalizedQuery);
          const inItems = card.items.some(item => item.toLowerCase().includes(normalizedQuery));
          return inTitle || inItems;
        })
      : bonusCards;

    content = (
      <div>
        <h2>Bonus</h2>
        <input
          type="text"
          placeholder="Rechercher un bonus..."
          value={bonusQuery}
          onChange={(e) => setBonusQuery(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 6, border: '1px solid #444', background: '#18181b', color: '#fff' }}
        />
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredCards.length === 0 ? (
            <div style={{ color: '#a1a1aa' }}>Aucun bonus ne correspond à la recherche.</div>
          ) : (
            filteredCards.map(card => (
            <div key={card.title} style={{ border: '1px solid #3f3f46', borderRadius: 8, padding: 12, background: '#1f1f23' }}>
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <ul style={{ marginLeft: 20, marginBottom: 0 }}>
                {card.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            ))
          )}
        </div>
      </div>
    );
  } else if (section === 'ranged') {
    content = (
      <div>
        <h2>Tir</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>Vérifier portée, visibilité, et couvert.</li>
          <li>Jet pour toucher, blesser, sauvegarde, dégâts.</li>
          <li>Modificateurs d’armes et règles spéciales.</li>
        </ul>
      </div>
    );
  } else if (section === 'melee') {
    content = (
      <div>
        <h2>Mêlée</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>Déclarer charges, engagement, et ordre d’activation.</li>
          <li>Jets pour toucher, blesser, sauvegarde, dégâts.</li>
          <li>Bonus de charge et aptitudes de combat.</li>
        </ul>
      </div>
    );
  } else if (section === 'objectives') {
    content = (
      <div>
        <h2>Objectifs</h2>
        <ul style={{ marginLeft: 20 }}>
          <li>Contrôle des objectifs par présence.</li>
          <li>Points par tour ou en fin de partie.</li>
          <li>Objectifs secondaires spécifiques.</li>
        </ul>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#23232b', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
        <h1 style={{ marginBottom: 12 }}>Règles</h1>
        <p style={{ marginBottom: 0, fontSize: '0.95rem', color: '#d4d4d8' }}>
          Commence par choisir l’univers, puis la catégorie.
        </p>
      </div>

      {!universe ? (
        <div style={{ background: '#23232b', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
          <h2 style={{ marginBottom: 12 }}>Choisis ton univers</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setUniverse('40k')} style={{ padding: '8px 14px' }}>Warhammer 40,000</button>
            <button onClick={() => setUniverse('kt')} style={{ padding: '8px 14px' }}>Kill Team</button>
            <button onClick={() => setUniverse('aos')} style={{ padding: '8px 14px' }}>Age of Sigmar</button>
            <button onClick={() => setUniverse('warcry')} style={{ padding: '8px 14px' }}>Warcry</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setUniverse('')} style={{ padding: '8px 14px' }}>Changer d’univers</button>
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid #3f3f46',
                  background: section === s.key ? '#2563eb' : '#1f1f23',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ background: '#23232b', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
            <div style={{ marginBottom: 12, color: '#a1a1aa' }}>
              Univers sélectionné: <strong>{universe}</strong>
            </div>
            {content}
          </div>
        </>
      )}
    </div>
  );
};

export default RulesPage;

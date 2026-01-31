require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const armyRoutes = require('./routes/armyLists');
const battleRoutes = require('./routes/battleReports');
const codexRoutes = require('./routes/codex');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/army-lists', armyRoutes);
app.use('/api/battle-reports', battleRoutes);
app.use('/api/codex', codexRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

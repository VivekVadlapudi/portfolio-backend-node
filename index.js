const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stockRoutes = require('./routes/stocks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stocks', stockRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

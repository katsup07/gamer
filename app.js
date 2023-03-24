const express = require('express');
const gameRoutes = require('./routes/games');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/games', gameRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

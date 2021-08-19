const express = require('express');

const { SERVER_PORT } = require('./config');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');

start();

async function start() {
    const app = express();
    
    await databaseConfig(app);
    expressConfig(app);
    
    app.get('/', (req, res) => res.send('It works!'));
    
    app.listen(SERVER_PORT, () => {
        console.log(`Application started at http://localhost:${SERVER_PORT}`)
    });
}
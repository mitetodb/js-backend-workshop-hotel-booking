const mongoose = require('mongoose');
const { DB_URI, DB_OPTIONS } = require('./index');

module.exports = (app) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URI, DB_OPTIONS);
    
        const db = mongoose.connection;
    
        db.on('error', (err) => {
            console.error('Database connection error: ', err);
            reject(err);
        });
    
        db.on('open', function () {
            console.log('Database connected.');
            resolve();
        });
    });
};
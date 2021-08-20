const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const authMiddleware = require('../middlewares/auth');
const storageMiddleware = require('../middlewares/storage');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: '.hbs'
    }));
    
    app.set('view engine', 'hbs');

    app.use('/', express.static('static'));
    app.use(express.urlencoded({ extended: true })); // body-parser as middleware
    app.use(cookieParser());
    app.use(authMiddleware());
    app.use(storageMiddleware());

    app.use((req, res, next) => {
        if (!req.url.includes('favicon')) {
            console.log('>>>', req.method, req.url);
        }

        if (req.user) {
            console.log('Known user', req.user.username);
        }

        next();
    });

    // TODO add storage middlewares
};
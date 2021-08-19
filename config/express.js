const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const authMiddleware = require('../middlewares/auth');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: '.hbs'
    }));
    
    app.set('view engine', 'hbs');

    app.use('/', express.static('static'));
    app.use(express.urlencoded({ extended: true })); // body-parser as middleware
    app.use(cookieParser());
    app.use(authMiddleware());

    // TODO add storage middlewares
};
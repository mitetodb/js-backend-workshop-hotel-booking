const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.engine('hbs', hbs({
        extname: '.hbs'
    }));
    
    app.set('view engine', 'hbs');
    
    app.use('/', express.static('static'));
    app.use(express.urlencoded({ extended: true })); // body-parser as middleware
    app.use(cookieParser());
};
const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use('/', express.static('static'));
    app.use(express.urlencoded({ extended: true })); // body-parser as middleware
    app.use(cookieParser());
};
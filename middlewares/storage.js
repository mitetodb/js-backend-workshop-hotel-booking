const hotel = require('../services/hotel');

module.exports = () => (req, res, next) => {
    // import and decorate services.
    req.storage = {
        ...hotel
    };

    next();
};
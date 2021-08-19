module.exports = () => (req, res, next) => {
    // import and decorate services.
    req.storage = {};

    next();
};
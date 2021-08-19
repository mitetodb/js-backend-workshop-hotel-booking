module.exports = {
    SERVER_PORT: 3000,
    DB_URI: 'mongodb://localhost:27017/hotel-booking',
    DB_OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    TOKEN_SECRET: 'my-very-secure-secret',
    COOKIE_NAME: 'SESSION_TOKEN'
};
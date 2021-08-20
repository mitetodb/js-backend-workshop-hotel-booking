const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

router.post(
    '/register', 
    isGuest(), 
    body('email', 'Invalid email').isEmail(),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'), // TODO change according to requirements
    body('repass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                const message = errors.map(e => e.mgs).join('\n')
                throw new Error(message);
            }

            await req.auth.register(req.body.username, req.body.email, req.body.password);

            res.redirect('/'); // TODO change redirect location
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                    email: req.body.email
                }
            };
            res.render('register', ctx);
        }    
    }
);

router.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/'); // TODO change redirect location
    } catch (err) {
        console.log(err.message);
            const ctx = {
                errors: [err.message],
                userData: {
                    username: req.body.username
                }
            };
            res.render('login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/auth/login'); // TODO change redirect location
});

module.exports = router;
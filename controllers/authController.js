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
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').bail()
                    .matches('/[a-zA-Z0-9]/').withMessage('Password may contain only english letters and numbers'),
    body('repass').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);
        let errorMsg;

        if (errors.length > 0) {
            const errorMsg = errors.map(e => e.msg);
            const ctx = {
                errors: errorMsg,
                userData: {
                    username: req.body.username,
                    email: req.body.email
                }
            };
            res.render('register', ctx);
            throw new Error(errorMsg);
        }

        try {
            await req.auth.register(req.body.username, req.body.email, req.body.password);
            res.redirect('/'); // TODO change redirect location
        } catch (err) {
            if (err.errors) {
                errorMsg = Object.values(err.errors).map(e => e.msg);
            } else {
                errorMsg = err.message;
            }
        
            const ctx = {
                errors: errorMsg,
                userData: {
                    username: req.body.username,
                    email: req.body.email
                }
            };
            res.render('register', ctx);
            throw new Error(errorMsg);
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
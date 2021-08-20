const router = require('express').Router();
const userService = require('../services/user');

router.get('/', async (req, res) => {
    const user = await userService.getUserByUsername(req.params.username)

    res.render('user/profile', user);
});

module.exports = router;
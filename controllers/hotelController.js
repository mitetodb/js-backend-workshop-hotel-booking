const router = require('express').Router();

const { isUser } = require('../middlewares/guards');

router.get('/create', isUser(), (req, res) => {
    res.render('hotel/create')
});

router.post('/create', isUser(), async (req, res) => {
    const hotelData = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: req.body.rooms,
        bookedBy: [],
        owner: req.user._id
    };

    try {
        await req.storage.createHotel(hotelData);

        res.redirect('/');
    } catch (err) {
        console.log(err.message);

        let errorMsg;

        if (err.errors) {
            errorMsg = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errorMsg = [err.message];
        }

        const ctx = {
            errors: errorMsg,
            hotelData: {
                name: req.body.name,
                city: req.body.city,
                imageUrl: req.body.imageUrl,
                rooms: req.body.rooms
            }
        };

        res.render('hotel/create', ctx);
    }
});

router.get('/:id/details', isUser(), async (req, res) => {
    const hotel = await req.storage.getHotelById(req.params.id);

    res.render('hotel/details', hotel);
});

router.get('/:id/edit', isUser(), async (req, res) => {
    const hotel = await req.storage.getHotelById(req.params.id);

    res.render('hotel/edit', hotel);
});

router.post('/:id/edit', isUser(), async (req, res) => {
    const hotelData = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: req.body.rooms,
        bookedBy: [],
        owner: req.user._id
    };

    try {
        await req.storage.updateHotel(hotelData, req.params.id);

        res.redirect(`/hotels/${req.params.id}/details`);
    } catch (err) {
        console.log(err.message);

        let errorMsg;

        if (err.errors) {
            errorMsg = Object.values(err.errors).map(e => e.properties.message);
        } else {
            errorMsg = [err.message];
        }

        const ctx = {
            errors: errorMsg,
            name: req.body.name,
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            rooms: req.body.rooms,
            _id: req.params.id
        };

        res.render('hotel/edit', ctx);
    }
});


module.exports = router;
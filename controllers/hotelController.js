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
    try {
        const hotel = await req.storage.getHotelById(req.params.id);
        hotel.hasUser = Boolean(req.user);
        hotel.isAuthor = req.user && req.user._id == hotel.owner;
        hotel.isBooked = req.user && hotel.bookedBy.find(u => u == req.user._id);
        
        res.render('hotel/details', hotel);

    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }

});

router.get('/:id/edit', isUser(), async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (req.user._id != hotel.owner) {
            throw new Error('Cannot edit hotel you haven\'t created!');
        }

        res.render('hotel/edit', hotel);
        
    } catch (err) {
        console.log(err.message);
        res.redirect(`/hotels/${req.params.id}/details`);
    }

});

router.post('/:id/edit', isUser(), async (req, res) => {
    try {
        await req.storage.updateHotel(req.params.id, req.body);

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

router.get('/:id/delete', isUser(), async (req, res) => {
    try {
        const hotel = await req.storage.getHotelById(req.params.id);

        if (req.user._id != hotel.owner) {
            throw new Error('Cannot delete hotel you haven\'t created!');
        }

        await req.storage.deleteHotel(req.params.id);
        res.redirect('/');
        
    } catch (err) {
        console.log(err.message);
        res.redirect(`/hotels/${req.params.id}/details`);
    }

});

router.get('/:id/book', isUser(), async (req, res) => {
    try {
        await req.storage.bookHotel(req.params.id, req.user._id);
        res.redirect(`/hotels/${req.params.id}/details`);
        
    } catch (err) {
        console.log(err.message);
        res.redirect(`/hotels/${req.params.id}/details`);
    }

});


module.exports = router;
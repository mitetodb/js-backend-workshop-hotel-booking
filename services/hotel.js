const Hotel = require('../models/Hotel');

async function createHotel(hotelData) {
    const hotel = new Hotel(hotelData);
    await hotel.save();

    return hotel;
}

async function updateHotel(data, id) {
    const hotel = await Hotel.findById(id);

    if (!hotel) {
        throw new Error('Hotel not found!');
    }

    Object.assign(hotel, data);
    return hotel.save();
}

async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();

    return hotels;
}

async function getHotelById(id) {
    const hotel = await Hotel.findById(id).lean();

    return hotel;
}

module.exports = {
    createHotel,
    updateHotel,
    getAllHotels,
    getHotelById
};
const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: { type: String, required: [true, 'All fields are required.'], minLength: [4, 'Name mus be min. 4 chars is required'] },
    city: { type: String, required: [true, 'All fields are required.'], minLength: 3 },
    imageUrl: { type: String, required: [true, 'All fields are required.'], match: [/^https?/, 'Image must be valid URL'] },
    rooms: { type: Number, required: [true, 'All fields are required.'], min: 1, max: 100 },
    bookedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'All fields are required.'] }
});

module.exports = model('Hotel', schema);
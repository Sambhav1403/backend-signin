const mongoose = require('mongoose');

//User model database
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
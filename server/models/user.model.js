const mongoose = require('mongoose');
const Role = require('../models/role.model');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter a username"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please enter a password"]
        },
        email: {
            type: String,
            required: [true, "Please enter the user's email"]
        },
        phoneNumber: {
            type: String,
            required: [true, "Please enter the user's phone number"],
            validate: {
                validator: function (v) {
                    return /^\d{9}$/.test(v); // Sprawdza, czy zawiera dokładnie 9 cyfr
                },
                message: "Phone number must contain exactly 9 digits"
            }
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        },
        refreshToken: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);
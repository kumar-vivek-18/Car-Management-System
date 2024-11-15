import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    userName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        index: true,
    },
    password: {
        type: String,
    },
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, userName: this.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

export const User = mongoose.model('User', userSchema);
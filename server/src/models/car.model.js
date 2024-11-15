import mongoose, { Schema } from 'mongoose';

const carSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    carName: {
        type: String,
        required: true,
    },
    carDescription: {
        type: String,
    },
    carType: [{
        type: String,
        enum: ["Sedan", "Hatchback", "SUV", "MUV", "Convertible", "Pickup Truck"]
    }],
    carImages: [
        { type: String }
    ],
    carPrice: {
        type: Number,
        default: 0,
        required: true,
    }
}, {
    timestamps: true,
});

export const Car = mongoose.model('Car', carSchema);

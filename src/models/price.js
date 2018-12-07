import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
    },
    points: [
        {
            buyAverage: { type: Number },
            sellAverage: { type: Number },
            buyQuantity: { type: Number },
            sellQuantity: { type: Number },
            timeTaken: { type: Date, default: Date.now },
        },
    ],
});

export default mongoose.model('Price', schema);

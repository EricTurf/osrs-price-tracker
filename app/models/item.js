import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    rsId: { type: Number, required: 'Item must have an rsId' },
    name: { type: String, required: 'Must provide name to item' },
    members: { type: Boolean },
    buyAverage: { type: Number },
    sellAverage: { type: Number },
    buyQuantity: { type: Number },
    sellQuantity: { type: Number },
    category: [{ type: String }],
    created: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Item', schema);

/*

{
    "id": 2,  rsId
    "name": "Cannonball", name
    "members": true, members
    "buy_average": 197, buyAverage
    "buy_quantity": 658515, buyQuantatity
    "sell_average": 195, sellAverage
	"sell_quantity": 1138677, sellQuantity
	category:''

	//virtual field
	cost,
  }

*/

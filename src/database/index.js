import mongoose from 'mongoose';

function connect() {
    mongoose.connect(
        `mongodb://localhost:27017/${process.env.DB_NAME}`,
        { useNewUrlParser: true },
        err => {
            if (err) console.error(err.message);
            console.log('Connected to Mongo');
        }
    );
}

export default connect;

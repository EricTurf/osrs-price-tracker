import app from './app';
import dbConnect from './database';
import getItems from './get-item-prices';
import { load } from 'dotenv';

load();

const INTERVAL_TIME = 600000;

app.listen(`${process.env.PORT || '3001'}`, () => {
    console.log(`Connected to ${process.env.PORT || '3001'}`);
    dbConnect();
    setInterval(() => {
        getItems().subscribe({
            complete() {
                console.log('done');
            },
            error(e) {
                console.log(e.message);
            },
        });
    }, INTERVAL_TIME);
});

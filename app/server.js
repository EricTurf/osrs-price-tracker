import app from './app';
import dbConnect from './database';
import getItems from './index';
import { load } from 'dotenv';

load();

app.listen(`${process.env.PORT || '3001'}`, () => {
    console.log(`Connected to ${process.env.PORT || '3001'}`);
    dbConnect();
    getItems().subscribe({
        error(e) {
            console.log(e.message);
        },
    });
});

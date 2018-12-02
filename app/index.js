import axios from 'axios';
import fs from 'fs';
import { from } from 'rxjs';
import { tap, switchMap, reduce } from 'rxjs/operators';

import Item from './models/item';

const getItemPrices = () => {
    return from(
        axios.get(
            'https://storage.googleapis.com/osbuddy-exchange/summary.json'
        )
    ).pipe(
        switchMap(res => {
            return from(Object.keys(res.data)).pipe(
                reduce((acc, key) => {
                    const {
                        id,
                        name,
                        members,
                        buy_average,
                        buy_quantity,
                        sell_average,
                        sell_quantity,
                    } = res.data[key];

                    acc = [
                        ...acc,
                        {
                            rsId: id,
                            name,
                            members,
                            buyAverage: buy_average,
                            buyQuantity: buy_quantity,
                            sellAverage: sell_average,
                            sellQuantity: sell_quantity,
                        },
                    ];
                    return acc;
                }, []),
                switchMap(items => Item.insertMany(items))
            );
        })
    );
};

export default getItemPrices;

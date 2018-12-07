import axios from 'axios';
import fs from 'fs';
import { from, merge, forkJoin } from 'rxjs';
import {
    tap,
    switchMap,
    reduce,
    switchAll,
    partition,
    catchError,
    concatMap,
    delay,
    take,
} from 'rxjs/operators';

import Item from './models/item';
import Price from './models/price';

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
                switchAll(),
                concatMap(
                    ({
                        buyAverage,
                        buyQuantity,
                        sellAverage,
                        sellQuantity,
                        rsId,
                        name,
                        members,
                    }) => {
                        return from(Item.findOne({ rsId })).pipe(
                            switchMap(item => {
                                if (item === null) {
                                    const itemDoc = new Item({
                                        rsId,
                                        name,
                                        members,
                                    });

                                    return itemDoc.save().then(doc => {
                                        return new Price({
                                            item: doc._id,
                                            points: [
                                                {
                                                    buyAverage,
                                                    buyQuantity,
                                                    sellAverage,
                                                    sellQuantity,
                                                },
                                            ],
                                        }).save();
                                    });
                                } else {
                                    return from(
                                        Price.findOne({ item: item._id })
                                    ).pipe(
                                        switchMap(priceDoc => {
                                            const points = [
                                                ...priceDoc.points,
                                                {
                                                    buyAverage,
                                                    buyQuantity,
                                                    sellAverage,
                                                    sellQuantity,
                                                },
                                            ];

                                            priceDoc.points = points;

                                            return priceDoc.save();
                                        })
                                    );
                                }
                            })
                        );
                    }
                )
            );
        }),
        catchError(e => {
            console.log(e.message);
        })
    );
};

export default getItemPrices;

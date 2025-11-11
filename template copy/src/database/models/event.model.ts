// src/database/models/event.model.ts
import {ObjectId} from "mongodb";

export default class Event {
    public _id?: ObjectId;

    constructor(
        public title: string,
        public description: string,
        public date: Date,
        public capacity: number,
        public price: number

    ) {
    }
}
// src/services/event.service.ts
import Event from "../database/models/event.model";
import mongo from "../database/mongo";
import {ObjectId} from "mongodb";
import {EventDto} from "../types/dto/event.dto";

const eventService = {
    // 1. Změna názvu kolekce
    event_collection: mongo.db.collection("events"),

    async create(eventDto: EventDto) {
        // 2. Použití všech polí z DTO pro vytvoření nového Eventu
        const event = new Event(
            eventDto.title,
            eventDto.description,
            new Date(eventDto.date), // Převedeme string na Date objekt
            eventDto.capacity,
            eventDto.price
        );

        await this.event_collection.insertOne(event);
        return event;
    },

    async findAll() {
        return await this.event_collection.find().toArray();
    },

    async findById(id: string) {
        // Přidáme try-catch pro případ nevalidního ObjectId
        try {
            const event = await this.event_collection.findOne({_id: new ObjectId(id)});
            return event;
        } catch (error) {
            return null; // Nenalezeno nebo neplatné ID
        }
    },

    async update(id: string, eventDto: EventDto) {
        // 3. Update všech polí
        return await this.event_collection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: {
                    title: eventDto.title,
                    description: eventDto.description,
                    date: new Date(eventDto.date),
                    capacity: eventDto.capacity,
                    price: eventDto.price
                }
            },
            {returnDocument: "after"} // Vrátí dokument po updatu
        );
    },

    async delete(id: string) {
        await this.event_collection.findOneAndDelete({
            _id: new ObjectId(id),
        });
    },
};

export default eventService;
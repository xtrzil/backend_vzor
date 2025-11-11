// src/api/controllers/event.controller.ts

/**
 * @openapi
 * /events:
 * post:
 * summary: Create a new event
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * description:
 * type: string
 * date:
 * type: string
 * format: date-time
 * capacity:
 * type: number
 * price:
 * type: number
 * example:
 * title: "Koncert kapely XYZ"
 * description: "Jedinečný rockový večer."
 * date: "2025-12-10T20:00:00Z"
 * capacity: 500
 * price: 790
 * responses:
 * '201':
 * description: Event created
 * '400':
 * description: Invalid input data
 * get:
 * summary: Get all events
 * responses:
 * '200':
 * description: A list of events
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * _id:
 * type: string
 * title:
 * type: string
 * description:
 * type: string
 * date:
 * type: string
 * format: date-time
 * capacity:
 * type: number
 * price:
 * type: number
 * /events/{id}:
 * get:
 * summary: Get an event by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The event ID
 * responses:
 * '200':
 * description: A single event
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * _id:
 * type: string
 * title:
 * type: string
 * description:
 * type: string
 * date:
 * type: string
 * format: date-time
 * capacity:
 * type: number
 * price:
 * type: number
 * '404':
 * description: Event not found
 * '400':
 * description: Invalid ID format
 * put:
 * summary: Update an event by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The event ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * description:
 * type: string
 * date:
 * type: string
 * format: date-time
 * capacity:
 * type: number
 * price:
 * type: number
 * example:
 * title: "Aktualizovaný Koncert"
 * description: "Aktualizovaný popis."
 * date: "2025-12-11T20:00:00Z"
 * capacity: 550
 * price: 850
 * responses:
 * '200':
 * description: Event updated
 * '404':
 * description: Event not found
 * '400':
 * description: Invalid input data or invalid ID format
 * delete:
 * summary: Delete an event by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The event ID
 * responses:
 * '204':
 * description: Event deleted successfully (No Content)
 * '404':
 * description: Event not found
 * '400':
 * description: Invalid ID format
 */

import * as express from "express";
import eventService from "../../services/event.service";
import {EventDto} from "../../types/dto/event.dto";
import {validate} from "class-validator";
import {ObjectId} from "mongodb";

const eventController = {
    async create(req: express.Request, res: express.Response) {
        const eventDto = new EventDto();
        // Nahrajeme data z requestu do našeho DTO
        Object.assign(eventDto, req.body);

        // --- VALIDACE ---
        const errors = await validate(eventDto);
        if (errors.length > 0) {
            return res.status(400).json({message: "Invalid input data", errors});
        }
        // --- KONEC VALIDACE ---

        try {
            const newEvent = await eventService.create(eventDto);
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({message: "Error creating event", error});
        }
    },

    async findAll(req: express.Request, res: express.Response) {
        try {
            const events = await eventService.findAll();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({message: "Error finding events", error});
        }
    },

    async findById(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id;
            // Validace, jestli je ID platné
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({message: "Invalid ID format"});
            }

            const event = await eventService.findById(id);
            if (!event) {
                return res.status(404).json({message: "Event not found"});
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({message: "Error finding event", error});
        }
    },

    async update(req: express.Request, res: express.Response) {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID format"});
        }

        const eventDto = new EventDto();
        Object.assign(eventDto, req.body);

        // --- VALIDACE ---
        const errors = await validate(eventDto);
        if (errors.length > 0) {
            return res.status(400).json({message: "Invalid input data", errors});
        }
        // --- KONEC VALIDACE ---

        try {
            const updatedEvent = await eventService.update(id, eventDto);
            if (!updatedEvent) {
                return res.status(404).json({message: "Event not found"});
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({message: "Error updating event", error});
        }
    },

    async delete(req: express.Request, res: express.Response) {
        try {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({message: "Invalid ID format"});
            }

            // Ověříme, jestli event vůbec existuje
            const event = await eventService.findById(id);
            if (!event) {
                return res.status(404).json({message: "Event not found"});
            }

            await eventService.delete(id);
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({message: "Error deleting event", error});
        }
    },
};

export default eventController;
// test/event.test.ts
import {describe, it, expect} from "vitest";
import request from "./request";
import mongo from "../src/database/mongo";

// Vyčistíme databázi před každým testem
beforeEach(async () => {
    await mongo.db.collection("events").deleteMany({});
});

describe('Event API', () => {
    const eventPayload = {
        title: "Koncert kapely XYZ",
        description: "Jedinečný rockový večer.",
        date: "2025-12-10T20:00:00Z",
        capacity: 500,
        price: 790
    };

    it('POST /events - returns 201 on successful creation', async () => {
        await request
            .post('/events')
            .send(eventPayload)
            .expect(201)
            .then(res => {
                expect(res.body.title).toBe(eventPayload.title);
            });
    });

    it('POST /events - returns 400 on invalid data', async () => {
        const invalidPayload = { title: "Chybí mi pole" };
        await request
            .post('/events')
            .send(invalidPayload)
            .expect(400);
    });

    it('GET /events - returns 200 and a list of events', async () => {
        // Nejdřív jeden vytvoříme
        await request.post('/events').send(eventPayload);

        await request
            .get('/events')
            .expect(200)
            .then(res => {
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body.length).toBe(1);
                expect(res.body[0].title).toBe(eventPayload.title);
            });
    });

    it('GET /events/:id - returns 200 and the specific event', async () => {
        const postRes = await request.post('/events').send(eventPayload);
        const eventId = postRes.body._id;

        await request
            .get(`/events/${eventId}`)
            .expect(200)
            .then(res => {
                expect(res.body.title).toBe(eventPayload.title);
            });
    });

    it('PUT /events/:id - returns 200 and updates the event', async () => {
        const postRes = await request.post('/events').send(eventPayload);
        const eventId = postRes.body._id;

        const updatePayload = { ...eventPayload, title: "Nové Jméno Eventu" };

        await request
            .put(`/events/${eventId}`)
            .send(updatePayload)
            .expect(200)
            .then(res => {
                expect(res.body.title).toBe("Nové Jméno Eventu");
            });
    });

    it('DELETE /events/:id - returns 204 and deletes the event', async () => {
        const postRes = await request.post('/events').send(eventPayload);
        const eventId = postRes.body._id;

        await request
            .delete(`/events/${eventId}`)
            .expect(204);

        // Ověříme, že už neexistuje
        await request
            .get(`/events/${eventId}`)
            .expect(404);
    });
});
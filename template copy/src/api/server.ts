// src/api/server.ts
import _statusController from "./controllers/_status.controller";
import eventController from "./controllers/event.controller"; // Změna

const express = require("express");
import * as swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../utils/swagger";

export const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//server.get("/status", _statusController.getStatus);

// Změna všech "/cats" na "/events" a použití eventController
server.post("/events", eventController.create);
server.get("/events", eventController.findAll);
server.get("/events/:id", eventController.findById);
server.put("/events/:id", eventController.update);
server.delete("/events/:id", eventController.delete);
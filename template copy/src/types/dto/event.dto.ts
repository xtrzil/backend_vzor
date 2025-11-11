// src/types/dto/event.dto.ts
import {IsNotEmpty, IsString, IsDateString, IsNumber, Min} from "class-validator";

export class EventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    date: string; // Přijímáme jako string ve formátu ISO 8601, např. "2025-12-10T20:00:00Z"

    @IsNumber()
    @Min(1) // Kapacita musí být minimálně 1
    capacity: number;

    @IsNumber()
    @Min(0) // Cena může být 0 (zdarma)
    price: number;
}
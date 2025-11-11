// src/utils/swagger.ts
import swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
    },
    // TOTO JE FINÁLNÍ OPRAVA:
    // Řekneme mu, ať čte jen controllery a ignoruje DTO soubory
    apis: ['src/api/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
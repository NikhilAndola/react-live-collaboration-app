require('dotenv').config();

import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import { initializeSocket } from './socket'; // Import the socket module

const app: Application = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

app.use(express.json());
app.use(cors());

server.listen(PORT, () => console.info(`Server is running on PORT: ${PORT}`));

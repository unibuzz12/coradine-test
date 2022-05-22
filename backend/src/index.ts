import cors from 'cors';
import Server from "./server";

const server = Server;
const app = server.app;

// to allow all origins for the dev
app.use(cors());

server.run();


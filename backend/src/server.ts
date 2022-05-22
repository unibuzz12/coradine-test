import * as express from "express";
import * as http from "http";
import { Environment } from "./config/environment";
import { ApolloServer } from 'apollo-server-express';
import Schema from './graphql/schema'
import * as jsonwebtoken from 'jsonwebtoken';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

class Server {
  public app: express.Application;
  // public server: http.Server;
  public port = process.env.PORT || 5000;

  public apolloServer = new ApolloServer({
    ...Schema,
    context: async ({ req }) => {
      // Get user token from the headers
      const token = req && req.headers.authorization && req.headers.authorization.split(' ')[1];

      let user = null;
      // Try to retrive a user with the given token
      if(token)
        user = jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
      // Add user to the context
      return { user }
    }
  });

  constructor() {
    this.app = express.default();
  }
  
  /**
   * Run the server backend
   */
  public async run(): Promise<void> {
  
    await this.apolloServer.start();

    const app = this.app;
    
    this.apolloServer.applyMiddleware({
        app,
        path: '/api/v1'
    });

    await connectDB();

    const server = this.app.listen(this.port);
    server.on("error", (err: Error) => this.onError(server, err));
    server.on("listening", () => this.onListening);
    console.debug(
      "Server was started on environment %s",
      Environment.getName()
    );
    console.log(`Listening on ${this.bind(server.address())}`);
  }

  /**
   * Event listener
   * @param server
   */
  private onListening = (server: http.Server): void => {
    console.log(`Listening on ${this.bind(server.address())}`);
  };

  /**
   * Error
   * @param server
   * @param error
   */
  private onError(server: http.Server, error: NodeJS.ErrnoException): void {
    if (error["syscall"] !== "listen") {
      throw error;
    }
    const addr = server.address();
    // handle specific listen errors with friendly messages

    switch (error["code"]) {
      case "EACCES":
        console.error(`${this.bind(addr)} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${this.bind(addr)} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private bind(addr: string | AddressInfo | null): string {
    return typeof addr === "string" ? `pipe ${addr}` : `port ${this.port}`;
  }
}

export default new Server();

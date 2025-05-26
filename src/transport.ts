// src/transport.ts
import express, { Request, Response } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';

export class HttpTransport {
  private app: express.Application;
  private server?: HttpServer;
  private messageHandler?: (message: any) => Promise<any>;

  constructor(private port: number = 3000) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', message: 'Succinct Network MCP Server is running' });
    });
  }

  async start() {
    // Tools endpoints
    this.app.post('/tools/list', async (req: Request, res: Response) => {
      try {
        if (!this.messageHandler) {
          res.status(500).json({ error: 'Server not ready' });
          return 
        }
        
        const response = await this.messageHandler({
          method: 'tools/list',
          params: {}
        });
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    this.app.post('/tools/call', async (req: Request, res: Response) => {
      try {
        if (!this.messageHandler) {
          res.status(500).json({ error: 'Server not ready' });
          return 
        }
        
        const response = await this.messageHandler({
          method: 'tools/call',
          params: {
            name: req.body.name,
            arguments: req.body.arguments || {}
          }
        });
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Prompts endpoints  
    this.app.post('/prompts/list', async (req: Request, res: Response) => {
      try {
        if (!this.messageHandler) {
          res.status(500).json({ error: 'Server not ready' });
          return 
        }
        
        const response = await this.messageHandler({
          method: 'prompts/list',
          params: {}
        });
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    this.app.post('/prompts/get', async (req: Request, res: Response) => {
      try {
        if (!this.messageHandler) {
          res.status(500).json({ error: 'Server not ready' });
          return
        }
        
        const response = await this.messageHandler({
          method: 'prompts/get',
          params: {
            name: req.body.name
          }
        });
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    return new Promise<void>((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Succinct Network MCP Server running on http://localhost:${this.port}`);
        console.log(`📖 Try: http://localhost:${this.port}/health`);
        resolve();
      });
    });
  }

  async send(message: any) {
    // Not used in HTTP transport
  }

  async receive() {
    // Not used in HTTP transport
    return new Promise(resolve => {});
  }

  async close() {
    if (this.server) {
      return new Promise<void>((resolve, reject) => {
        this.server!.close(err => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }

  onMessage(handler: (message: any) => Promise<any>) {
    this.messageHandler = handler;
  }
}
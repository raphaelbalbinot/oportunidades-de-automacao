import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function start() {
  try {
    // 1. CORS
    await app.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });

    // 2. API Routes
    await registerRoutes(app);

    // 3. Servir arquivos estáticos do Frontend (Produção)
    // Tenta encontrar a pasta de build do cliente em caminhos comuns
    const possibleStaticPaths = [
      path.resolve(__dirname, '../../dist/client'),
      path.resolve(__dirname, '../client'),
      path.resolve(process.cwd(), 'dist/client'),
      path.resolve(process.cwd(), 'src/client/dist'),
    ];

    const staticPath = possibleStaticPaths.find((p) => fs.existsSync(p));

    if (staticPath) {
      app.log.info(`Servindo arquivos estáticos de: ${staticPath}`);
      await app.register(fastifyStatic, {
        root: staticPath,
        prefix: '/',
      });

      // Fallback para SPA React no modo produção
      app.setNotFoundHandler((req, reply) => {
        if (req.raw.url && req.raw.url.startsWith('/api')) {
          return reply.status(404).send({ error: 'Endpoint da API não encontrado.' });
        }
        return reply.sendFile('index.html');
      });
    }

    const port = Number(process.env.PORT) || 8080;
    const host = '0.0.0.0';

    await app.listen({ port, host });
    app.log.info(`🚀 Servidor rodando com sucesso em http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

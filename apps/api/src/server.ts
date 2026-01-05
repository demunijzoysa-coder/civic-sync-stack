import Fastify from "fastify";
import { healthRoutes } from "./routes/health";
import { syncRoutes } from "./routes/sync";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { translateTime: "SYS:standard", ignore: "pid,hostname" }
    }
  }
});

await app.register(healthRoutes);
await app.register(syncRoutes);

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
  app.log.info(`API listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

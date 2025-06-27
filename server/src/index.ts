
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { updateCounterInputSchema, setCounterValueInputSchema } from './schema';
import { getCounter } from './handlers/get_counter';
import { updateCounter } from './handlers/update_counter';
import { setCounterValue } from './handlers/set_counter_value';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  getCounter: publicProcedure
    .query(() => getCounter()),
  updateCounter: publicProcedure
    .input(updateCounterInputSchema)
    .mutation(({ input }) => updateCounter(input)),
  setCounterValue: publicProcedure
    .input(setCounterValueInputSchema)
    .mutation(({ input }) => setCounterValue(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();

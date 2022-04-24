/* eslint-disable no-fallthrough */

const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const Router = require('koa-router');

const router = new Router();

const ChatController = require('./src/ChatController');

const ctrl = new ChatController();

const app = new Koa();
app.use(cors());
const PORT = process.env.PORT || 7070;

app.use(koaBody({
  text: true,
  urlencoded: true,
  json: true,
  multipart: true,
  uploadDir: '.'
}));

// eslint-disable-next-line consistent-return
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    // eslint-disable-next-line no-return-await
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set(
        'Access-Control-Allow-Headers',
        ctx.request.get('Access-Control-Allow-Request-Headers'),
      );
    }
    ctx.response.status = 204; // No content
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/chat', async (ctx) => {
  //console.log(ctx.query)
  const result = ctrl.getAllNotes();
  ctx.response.body = result;
  //console.log(ctx.response.body);
});

router.post('/chat', async (ctx) => {
  const object = ctx.request.body;
  const result = ctrl.createNote(object);
  ctx.response.body = result;
  //console.log(ctx.request.body);
});

router.delete('/chat/:id', async (ctx) => {
  const result = ctrl.deleteNote(ctx.params.id);
  ctx.response.body = result;
});

app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));

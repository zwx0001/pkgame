const Koa = require("koa");
const app = new Koa();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);
const path = require("path");
const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const koaRouter = require("koa-router");
const router = new koaRouter();
const getControllers = require("./router/configrouter");
const socket = require("./socket");
const upload = require("./router/upload");
const port = 8888;

app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.state.key = "zwx";
  await next();
});

upload(router)

app.use(getControllers(router, "controller"));

socket(app, io);

server.listen(port, () => {
  console.log(`port=${port}`);
});

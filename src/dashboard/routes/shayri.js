const router = require("express").Router();
const { add, read, update, remove } = require("../controller/shayri");

const routes = [
  { method: "get", route: "getAll", cb: add },
  { method: "get", route: "getAll", cb: read },
  { method: "get", route: "getAll", cb: update },
  { method: "get", route: "getAll", cb: remove },
];

for (let handler = 0; handler < routes.length; handler++) {
  router[routes[handler].method](
    `/${routes[handler].route}`,
    routes[handler].cb
  );
}

module.exports = router;

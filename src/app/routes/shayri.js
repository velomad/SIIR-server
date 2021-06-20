const router = require("express").Router();
const { getAll, setLike, pin, unPin } = require("../controller/shayri");

const routes = [
  { method: "get", route: "getAll", cb: getAll },
  { method: "post", route: "setLike", cb: setLike },
  { method: "post", route: "pin", cb: pin },
  { method: "post", route: "unPin", cb: unPin },
];

for (let handler = 0; handler < routes.length; handler++) {
  router[routes[handler].method](
    `/${routes[handler].route}`,
    routes[handler].cb
  );
}

module.exports = router;

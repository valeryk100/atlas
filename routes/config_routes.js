const indexR = require("./index");
const usersR = require("./users");
const vodR = require("./vod");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/vod",vodR);
}
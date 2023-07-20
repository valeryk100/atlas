const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

const {routesInit} = require("./routes/config_routes")
// require("./db/mongoconnect");

const app = express();

// נותן גישה לכל הדומיינים לגשת לשרת שלנו
app.use(cors());
// כדי שנוכל לקבל באדי ויתרגם אותו לפורמט ג'ייסון
app.use(express.json());
// הגדרת תקיית הפאבליק כתקייה ראשית
app.use(express.static(path.join(__dirname,"public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3002
server.listen(port);
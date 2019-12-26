let create_error = require("http-errors");
let express = require("express");
let logger = require("morgan");

let index_router = require("./routes/index");

let app = express();

app.use(logger("dev"));
app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use("/", index_router);

app.use(function(req, res, next) {
    next(create_error(404));
});

app.use(function(err, req, res, next) {
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err: {}

   res.status(err.status || 500);
   res.render("error");
});

module.exports = app;
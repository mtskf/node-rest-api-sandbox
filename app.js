'use strict'

const express = require("express");
const routes = require("./routes");
const jsonParser = require("body-parser").json;
const mongoose = require("mongoose");
const logger = require("morgan");
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();


// enable json request (post)
app.use(jsonParser());


// access logging
app.use(logger("dev"));  // show log on console
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));


// connect to mongo db
mongoose.connect("mongodb://localhost:27017/apisandbox");
const db = mongoose.connection;
db.on("error", err => console.error("connection error:", err));
db.once("open", () => console.log("db connection successful"));


// set cross domain access headers
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});


// router
app.use("/", routes);


// error handler
app.use((req, res, next) => {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
      status:  err.status,
			message: err.message
		}
	});
});


// run node server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Express server is listening on port", port));

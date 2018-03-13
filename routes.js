'use strict';
const express = require("express");
const router = express.Router();
const Animal = require("./models").Animal;


// GET /animals
// Route for animals collection
router.get("/animals", (req, res, next) => {
  if(req.query.name) return next();
	Animal.find({})
				.sort({createdAt: -1})
				.exec((err, animals) => {
					if(err) return next(err);
					res.json(animals);
				});
});


// POST /animals
// Route for creating animal document
router.post("/animals", (req, res, next) => {
	let animal = new Animal(req.body);
  animal.feeding = animal.feeding.toLowerCase();

  if(animal.feeding.search(/^(omnivorous|herbivorous|carnivorous)$/) === -1) {
		let err = new Error("Bad Request: feeding must be omnivorous, herbivorous or carnivorous");
		err.status = 400;
		return next(err);
	}

	animal.save((err, animal) => {
		if(err) return next(err);
		res.status(201);
		res.json(animal);
	});
});


// GET /animals/:name
// Route for specific animals
router.get("/animals/:name", (req, res, next) => {
  Animal.findOne({name: req.params.name})
        .exec((err, doc) => {
					if(err) return next(err);
          else if(!doc) {
      			err = new Error("Not Found");
      			err.status = 404;
      			return next(err);
          }
					res.json(doc);
  			});
});


// GET /animals?name=:name
// Route for specific animals
router.get("/animals", (req, res, next) => {
  if(!req.query.name) return next();
  Animal.findOne({name: req.query.name})
        .exec((err, doc) => {
					if(err) return next(err);
          else if(!doc) {
      			err = new Error("Not Found");
      			err.status = 404;
      			return next(err);
          }
					res.json(doc);
  			});
});


module.exports = router;

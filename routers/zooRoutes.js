const express = require("express");
const knex = require("knex");
const router = express.Router();

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};
const db = knex(knexConfig);

router
  .route("/")
  .get((req, res) => {
    db("zoos")
      .then(zoos => res.status(200).json(zoos))
      .catch(err =>
        res.status(404).json({ error: "We couldn't find the zoos" })
      );
  })
  .post((req, res) => {
    db("zoos")
      .insert(req.body)
      .then(zooId => {
        const id = zooId[0];
        db("zoos")
          .where({ id })
          .first()
          .then(zoo => res.status(200).json(zoo));
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "Sorry we couldn't create a new zoo right now" })
      );
  });

router
  .route("/:id")
  .get((req, res) => {
    db("zoos")
      .where({ id: req.params.id })
      .first()
      .then(zoo => {
        if (!zoo) {
          return res
            .status(404)
            .json({ error: "Sorry, we couldn't find a zoo at that id" });
        }
        res.status(200).json(zoo);
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "We couldn't find the zoo you were looking for" })
      );
  })
  .delete((req, res) => {
    db("zoos")
      .where({ id: req.params.id })
      .del()
      .then(deleted => {
        if (deleted === 0) {
          return res
            .status(404)
            .json({ error: "There is no zoo entry at that id" });
        }
        db("zoos").then(zoos => res.status(200).json(zoos));
      })
      .catch(err =>
        res.status(500).json({ error: "Sorry we couldn't delete that entry" })
      );
  });
module.exports = router;

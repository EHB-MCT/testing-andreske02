const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const Helpers = require("./utils/helpers.js");
const { log } = require("console");

const port = 3000;

const pg = require("knex")({
  client: "pg",
  version: "9.6",
  searchPath: ["knex", "public"],
  connection: process.env.PG_CONNECTION_STRING
    ? process.env.PG_CONNECTION_STRING
    : "postgres://andres:example@localhost:5432/andres",
});

const app = express();
http.Server(app);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

/*--------- SHOW ALL RECORDS --------*/
app.get("/", async (req, res) => {
  const result = await pg.select(["uuid", "title", "created_at"]).from("story");
  res.json({
    res: result,
  });
});
app.get("/test", (req, res) => {
  res.status(200).send();
});
app.get("/storyblock/", async (req, res) => {
  const result = await pg.select(["uuid", "content","story_id", "created_at"]).from("storyblock");
  res.json({
    res: result,
  });
});

/*--------- RECORDS BY ID --------*/
app.get("/story/:id", async (req, res) => {
  const result = await pg
    .select(["uuid", "title", "created_at"])
    .from("story")
    .where({ uuid: req.params.uuid });
  res.json({
    res: result,
  });
});
app.get("/storyblock/:id", async (req, res) => {
  const result = await pg
    .select(["uuid", "content", "created_at"])
    .from("storyblock")
    .where({ id: req.params.id }).then(async (data) => {
      if (data.length >= 1) {
        log("STORYBLOCK WITH ID:", req.params.id , "Exist")
        res.json({
          res: data,
        });
      }else{
        log(`STORYBLOCK WITH ID: ${req.params.id}  Don't exist`)
        res.status(404).send();
      }
    });  

});

/*--------- CREATE RECORDS --------*/
app.post("/newstoryblock/", async (req, res) => {
  let checkContentLength = Helpers.checkContentLength(req.body.content, 100);
  let checkContentType = Helpers.checkIfString(req.body.content);
  if(!checkContentLength || !checkContentType) {
    res.status(404).send() 
  }else {
    const uuid = Helpers.generateUUID();
    const getStory = await pg
      .select(["uuid", "title", "created_at"])
      .from("story")
      .where({ id: req.body.story_id })
      .then(async (data) => {

          if (data.length >= 1) {
            const result = await pg
              .table("storyblock")
              .insert({
                uuid: uuid,
                content: req.body.content,
                story_id: req.body.story_id,
              })
              .then(async function () {
                log("NEW STORYBLOCK: ", "created new storyblock");
                res.status(200).send();
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            log("STORY DON'T EXIST! with id:", req.body.story_id);
            res.status(404).send();
          }
      
      
      })
      .catch((e) => {
        console.log(e);
      });
  }
   
});

/*--------- DELETE RECORDS --------*/
app.delete("/storyblock/", async (req, res) => {
  if(req.body.hasOwnProperty('uuid')){
    const result = await pg.from("storyblock").where({ uuid: req.body.uuid }).del().then((data) => {
        log(`DELETED STORYBLOCK: with uuid ${req.body.uuid}`);
        res.json(data)
    }).catch(() =>  res.status(200).send())
  }else{
    log("NO UUID FOUND")
    res.status(200).send()
  }

});

/*--------- INITIALIZE TABLES --------*/
async function initialiseTables() {
  await pg.schema.hasTable("storyblock").then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable("storyblock", (table) => {
          table.increments();
          table.uuid("uuid");
          table.string("content");
          table.string("story_id");
          table.integer("order");
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log("created table storyblock");
        });
    }
  });
  await pg.schema.hasTable("story").then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable("story", (table) => {
          table.increments();
          table.uuid("uuid");
          table.string("title");
          table.string("summary");
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log("created table story");
          for (let i = 0; i < 10; i++) {
            const uuid = Helpers.generateUUID();
            await pg
              .table("story")
              .insert({ uuid, title: `random element number ${i}` });
          }
        });
    }
  });
}
initialiseTables();

module.exports = app;

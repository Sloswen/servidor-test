console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

//require('dotenv').config()
const port = process.env.PORT || 81; // port to listen on

const app = express();
app.use(require("cors")()); // allow Cross-domain requests
//app.use(require("body-parser").json()); // automatically parses request data to JSON. Aparentemente no es necesario ya usar express.json()
app.use(express.json());

// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

// make sure in the free tier of MongoDB atlas when connecting, to
// select version 2.2.* as the node.js driver instead of the default 3.0
// put your URI HERE ⬇
const uri = "mongodb://developerUser2:developerUser21234576@cluster0-shard-00-00.3jvha.mongodb.net:27017,cluster0-shard-00-01.3jvha.mongodb.net:27017,cluster0-shard-00-02.3jvha.mongodb.net:27017/GeoGebraApplets?ssl=true&replicaSet=atlas-w73y6w-shard-0&authSource=admin&retryWrites=true&w=majority"

//const uri = "mongodb+srv://developerUser2:developerUser21234576@cluster0.3jvha.mongodb.net/clicks?  retryWrites=true&w=majority"; // put your URI HERE

MongoClient.connect(uri, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;

  // start the express web server listening on 8080
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
//new route
app.get('/hola',(req, res)=>{
  res.send('Estas en la direccion /hola');
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});

app.post('/applet01', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  const appletData = {  click,
                        data: req.body};
  console.log('req: '+ JSON.stringify(req.body));
  console.log('appletData: ' + appletData);
  //console.log(db);

  db.collection('RedCienciaJuventud').save(appletData, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    //res.sendStatus(201);
    const respuesta = JSON.stringify({result : 'click added to db'});
    console.log(respuesta)
    res.send(respuesta);
  });
});

// get the click data from the database
app.get('/clicks', (req, res) => {

  db.collection('clicks').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});


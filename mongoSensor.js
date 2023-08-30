//                                              PART 1

// keep part 2 commented out

/*
const mongoose = require('mongoose');
const client = require('mongodb').MongoClient;
const urii = "mongodb+srv:......"




mongoose.connect("mongodb+srv://......", {useNewUrlParser: true});
const Sensor = new mongoose.Schema({
    id_: Number,
    name: String,
    address: String,
    record:[{time: Date, temperature:String}],
});

const Sens = mongoose.model("sensorsburwoods" , Sensor);
mongoose.connection.startSession();

*/

//                                              PART 2

//import { MongoClient } from "mongodb";
const MongoClientt = require('mongodb').MongoClient;

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://.....";

const client = new MongoClientt(uri);

//ard
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM4', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', data =>{
    //console.log(data);
    data1 = String(data)
    console.log(data1);
    Push().catch(console.dir);
    });

//                                          ** update record **
async function Update() {
  try {
    const database = client.db("sit314");
    const fruitCollection = database.collection("sensorsburwoods");

    // create a filter for a fruit to update
    const filter = { name: "temperaturesensor" };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    // create a document that sets the variable to a new value
    const updateDoc = {
      $set: {
        name: `Updated again3...: ${Math.random()}`
      },
    };

    const result = await fruitCollection.updateOne(filter, updateDoc, options);

    // Push some values to an array
    const query = {name: "temperaturesensor"};
    const Updatedoc = {
    $push: {"record.$[].temperature": "test"}
    };
    const result2 = await fruitCollection.updateOne(query,Updatedoc,options);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    console.log("----\n");
    console.log(`${result2.matchedCount} document(s) matched the filter, updated ${result2.modifiedCount} document(s)`,);

  } finally {
    await client.close();
  }
}
//Update().catch(console.dir);



//                                          ** push records into array **
async function Push() {
  try {
    const client = new MongoClientt(uri);
    const database = client.db("sit314");
    const fruitCollection = database.collection("sensorsburwoods");
    
    // create a filter for a fruit to update
    const filter = { name: "temperaturesensor" };
  
    // this option instructs the method to create a document (if set to true) if no documents match the filter
    const options = { upsert: false };
    
    // Push some values to an array for the record specified in line 60
    // need to make sure the data string was populated first
    if (data1 !== "") {
    result2=fruitCollection.updateOne(
// find by chosen field & value
      //{_id: "ObjectId('64e9966ad693630ff4f1f5f8')"},
      //{quantity: 22},
      {name: "temperaturesensor"},
// push to array (make sure its set to an array of objects in Mongo collection view)
    {$push: {
        record:
          {time:Date(),temperature:data1}  
    }
    },
// a helper filter if many records fetched; we can set as many as we need
    filter
    )}
    console.log("----\n");
    console.log(`${result2.matchedCount} document(s) matched the filter, updated ${result2.modifiedCount} document(s)`,);

  } finally {
    await client.close();
  }
}
// doesnt work on its own as we need to make sure data is populated from serial readings first:
//Push().catch(console.dir);

// so Push() is called either from:
// * callfunction() at line 121   or
// * directly after recording values at line 19 (better option, records are taken & sent to mongo every second)


// call a function x times -> we get records in mongo
function callfunction(){
    const database = client.db("sit314");
var callCount = 1;
var repeater = setInterval(function () {
  if (callCount < 10) {
    Push().catch(console.dir); // a function we want to call
    callCount += 1;
  } else {
    clearInterval(repeater);
  }
}, 5000); // every 5 seconds
}
//callfunction()



//                                          ** create a collection - array creation does not work **
function createColl() {
  try{
    const database = client.db("sit314");
    database.createCollection("sensorsburwoods",{
      id_: Number,
      name: String,
      address: String,
      record:[{time: Date(), temperature:Number}],
    })

  }finally{
    client.close();
  }

}
//createColl();


// show data to terminal 
async function getData () {
    // from arduino
    // Read the port data
    port.on("open", () => {
        console.log('serial port open');
        });
        parser.on('data', data =>{
        //console.log(data);
        data1 = String(data)
        console.log(data1);
        return data1;
        });
}
//getData();

//                                          ** insert a new record **
async function Insert() {
  try {
    const database = client.db("sit314");
    const fruitCollection = database.collection("sensorsburwoods");
    var dat = getData();


    // create a document that sets the variable to a new value
    const InsertDoc = {
        id: 0,
        name: "temperaturesensor",
        address: "221 Burwood Hwy, Burwood VIC 3125",
        record:[{time: Date(), temperature:dat}],
      };

    const result = await fruitCollection.insertOne( InsertDoc,upsert=true);

    console.log(
      `A document was inserted with the _id: ${result.insertedId}`,
    );

  } finally {
    await client.close();
  }
}
//Insert().catch(console.dir);



//                                          ** show collection det in terminal **
async function Show() {
  try {
    const database = client.db("sit314");
    const fruitCollection = database.collection("sensorsburwoods");

    console.log(fruitCollection)

  } finally {
    await client.close();
  }
}
//Show().catch(console.dir);

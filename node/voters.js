// voter microservice
const express = require('express');
const app = express();

const { MongoClient } = require ("mongodb");
const uri="mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3002;

app.use(express.json());

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get('/', async (request, response) => {
    // load voter data - READ
    try {
        await client.connect();
        await client.db('voting').collection('voters')
        .find()
        .toArray()
        .then ( results => {
            response.send( results);
        })
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

app.post('/', async (request, response)=> {
    const submittedVoterName = request.body.name;
    // create an object to match our voter object in mongo
    const voterData = { "name": submittedVoterName, "ballot": null };
    // write to mongo
    try {
        await client.connect();
        await client.db('voting').collection('voters')
        .insertOne(voterData)
        .then( results => response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }

});

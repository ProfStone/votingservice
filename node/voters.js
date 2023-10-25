// voter microservice
const express = require('express');
const app = express();

const { MongoClient } = require ("mongodb");
const uri="mongodb://localhost:27017";
const client = new MongoClient(uri);

let port = 3002;

app.use(express.json());

app.listen(port, ()=> console.log(`listening on port ${port}`));
// CREATE
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
// READ
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


// UPDATE, PUT
app.put('/', async ( request, response) => {
    
    // expecting JSON variables to help us record a vote
    // key for the voter: name
    // key for the ballot
    const submission = request.body.candidate; // ??
    const voterFilter = { "name":request.body.voter }; // person voting
    const updateDocument = { $set: { "ballot": { "name":submission} } };
    console.log(voterFilter);
    console.log(updateDocument);
    try {
        await client.connect();
        await client.db('voting').collection('voters')
        .updateOne(voterFilter, updateDocument)
        .then( results=> response.send(results))
        .catch( error=> console.error(error));
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
})

// DELETE, DELETE

app.delete('/', async (request,response) => {
    const voterFilter = { "name": request.body.name };
    try {
        await client.connect();
        await client.db('voting').collection('voters')
        .deleteOne(voterFilter)
        .then( results=> response.send(results))
        .catch( error=>console.error(error));
    } catch(error) {
        console.error(error);
    } finally {
        client.close();
    }

})

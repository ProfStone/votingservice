// candidate microservice
const http = require ('http');
const url = require('url')

const { MongoClient } = require ('mongodb');

const mongoURI = "mongodb://localhost:27017";

const client = new MongoClient(mongoURI);

const hostname = "127.0.0.1";
const port = 3001;
const server = http.createServer();



server.on('request', async ( request, response) => {
    // check the path, and invoke one function or another
    let q = url.parse(request.url,true);
    let returnCandidates = []; // for holding candidates to return
    console.log(q.pathname);
   switch (q.pathname) {
        case "/candidates":
            returnCandidates = await getCandidates();
            break;
        case "/candidates/ballots":
            returnCandidates = await getCandidatesWithBallots();
            break;
    }
    // gotten our data to return, we'll send a response
    response.writeHead(200, { 'Content-type':'text/JSON'});
    response.end( JSON.stringify( returnCandidates));
})
server.on('error', error=>console.error(error.stack));

server.listen(port, hostname, () => console.log(`server running at http://${hostname}:${port}`));

async function getCandidates() {
    let values = [];
    console.log('getCandidates');   
 const database = client.db('voting'); 
    const candidates = database.collection('candidates');
    const cursor = candidates.find({}).sort({ name: 1}); 
    while ( await cursor.hasNext()) {
        values.push( await cursor.next());
    }
    return values;
}
async function getCandidatesWithBallots() {

    let values = []; //STUB: write me

    const database = client.db('voting');
    const candidates = database.collection('candidates');
    const ballots = database.collection('voters');
    const cursor = candidates.find({}).sort( { name: 1});
    while ( await cursor.hasNext()) {
        let thisCandidate = await cursor.next();
        const query = { "ballot.candidate":thisCandidate.name };
        const matchingVotes = await ballots.countDocuments( query );
         values.push( { "candidate": thisCandidate.name, "ballots": matchingVotes});
    }
    const query2 ={ "ballot": null};
    const matchingVotes = await ballots.countDocuments(query2);
    values.push( { "candidate":"not voted", "ballots": matchingVotes });
    return values;
}


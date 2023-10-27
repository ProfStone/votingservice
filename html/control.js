// front end JS for voter app
const endpoint = {};
endpoint['candidates']='http://localhost:8080/api/candidates';
endpoint['candidatesWithBallots']='http://localhost:8080/api/candidates/ballots';
endpoint['voters']='http://localhost:8080/api/voters';

let voterPackage = {}; // global container for holding ballot information

const viewType = {
    home: 'home',
    ballot: 'ballot',
    results: 'results'
}
function deleteVoter(name) {
    // STUB: write a function to invoke the voter delete
    //alert('delete voter');
    const voterPackage = { "name":name};
    let deleteVoter = fetch(endpoint['voters'],
    { method: 'DELETE',
    headers: {
        'content-type':'application/json'
    },
    body: JSON.stringify(voterPackage)
    })
    .then (results=>results.json())
    .then ( (result)=> {
        statusMessage(result);
        loadContent(viewType['home']);
    })

}

function initPage() {
    // set up the page
    // set the title
    document.getElementById('heading').innerHTML="Candidates"; // to change later
    loadContent(viewType['home']);
    //loadVoters();
    // modal window functions
    var modal=document.getElementById("myModal");
    var btn=document.getElementById("addBtn");
    var closeSpan=document.getElementsByClassName("close")[0];
    btn.onclick=function() {
        modal.style.display="block";
    }
    var resultBtn=document.getElementById('showResults');
    resultBtn.onclick=function() {
        loadContent(viewType['results']);
    }

    closeSpan.onclick = function() {
        modal.style.display="none";
    }
    window.onclick=function(event) {
        if (event.target==modal) {
            modal.style.display="none";
        }
    }
}
function fetchAndDrawBallot() {
    // show the ballot so the current user can vote
    // STUB: alter the display to make it look like a ballot
    let candidateNames = fetch(endpoint['candidates'])
    .then( res=>res.json()) 
    .then (result=> {
        makeAList("candidateList", result, "name", recordVoterAndVote);
    })
}
function fetchAndListCandidates(showVotes) {
    let target = 'candidates';
    if (showVotes) {
        target='candidatesWithBallots';
    }
     // display a list of candidates
     let candidateNames = fetch( endpoint[target]);
     candidateNames.then( (result)=>result.json())
     .then( (result)=>  {
         //console.log(result);
         makeAList('candidateList',result,"name");
         
     })
     .catch(error=> {
         console.error(error);
         
         console.error(error);
         document.getElementById('potentialBallots').append(error);
     })
     // write a list of candidates to the page

}

function fetchAndListVoters() {
    let voterNames = fetch(endpoint['voters']);
    voterNames.then( res=>res.json() ) 
    .then ( result=> {
        const potentialBallots =[];
        const completedBallots = [];
        for ( item of result ) {
            if ( item.ballot === null ) {
                potentialBallots.push(item);
            } else {
                completedBallots.push(item);
            }
        }
        makeAList('potentialBallots',potentialBallots, "name", showBallot, true);
        makeAList('completedBallots',completedBallots, "name", false, true);
    })

}

function loadContent(view) {

    // reset the view
    const contentAreas=document.getElementsByClassName('displayArea');
    for ( area of contentAreas) {
        area.innerHTML=""; // empty the containers for redrawing
    }
    switch (view) {

        case viewType['home']: {
            fetchAndListCandidates(false); // STUB: include argument to show results
            fetchAndListVoters();
            break;
        }
        case viewType['ballot']: {
            fetchAndDrawBallot();
            break;
        }
        case viewType['results']: {
            fetchAndListCandidates(true);
        }
    }
}


function makeAList( target, data, idField, ocfunction, deleteLink ) {
    const element=document.getElementById(target);
    element.innerHTML=""; // clear out content
        let list=document.createElement('ul');
        for (let i=0;i<data.length;i++) {
            let li=document.createElement('li');
            let span=document.createElement('span');
            let keyValue=data[i][idField];
            if (ocfunction) {
                span.onclick=ocfunction;
            }
            span.innerHTML=data[i].name;
            span.id=keyValue;
            li.append(span);
            if (deleteLink) {
                let link=document.createElement('a');
                link.innerHTML=" [ x ]";
                link.onclick=function() { deleteVoter(keyValue); }
                li.append(link);
            }
            
            list.appendChild(li);
        }
        element.append(list);
}
function recordNewVoter() {
    let newName = document.getElementById('userName').value;
    recordVoter(newName); // post to the API
    closeSpan.onclick();
    // I've added a voter, need to reload the voter list
    fetchAndListVoters();
    return false;
}
function recordVoterAndVote() {
     // when a user clicks on a candidate, record a vote
     // for that user and that candidate
     voterPackage.candidate=this.id; 
     let addBallot= fetch(endpoint['voters'],
     { 
        method: 'PUT',
        headers: { 'Content-type':'application/json'},
     
     body: JSON.stringify(voterPackage) }
     )
     .then( res=>res.json()) 
     .then( (result)=> {
        statusMessage(result);
        // clear out the voterPackage
        voterPackage={};
        // redraw the page
        loadContent(viewType['home']);
     })
     .catch(error=>{
        console.error(error);
        statusMessage(error);
     });
}
async function  recordVoter(voter) {
    const dataToSend = { "name":voter };
    let addVoter = await fetch( endpoint['voters'],
    {
        method:'POST',
        headers: {
            'Accept':'application/JSON',
            'Content-type':'application/json'
        },
        body: JSON.stringify( dataToSend )
    })
    .then( response=>response.json())
    .then( (result)=> {
        statusMessage(result);
        fetchAndListVoters(); // update the list of voters
    })
    .catch(error=>console.log("error saving voter"));

    // STUB: maybe write the error on the page somewhere
}
function showBallot() {
    voterPackage.voter=this.id; 
    loadContent(viewType['ballot']); // display the ballot view
}
function statusMessage(message) {
    document.getElementById("messages").innerHTML=message;
}




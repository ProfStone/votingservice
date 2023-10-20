// front end JS for voter app
const endpoint = {};
endpoint['candidates']='http://localhost:8080/api/candidates';
endpoint['candidatesWithBallots']='http://localhost:8080/api/candidates/ballots';
endpoint['voters']='http://localhost:8080/api/voters';

function initPage() {
    // set up the page
    // set the title
    document.getElementById('heading').innerHTML="Candidates"; // to change later
    loadContent();
    loadVoters();
}
function loadContent() {
    // display a list of candidates
    let candidateNames = fetch( endpoint['candidates']);
    candidateNames.then( (result)=>result.json())
    .then( (result)=>  {
        //console.log(result);
        makeAList('potentialBallots',result);
        
    })
    .catch(error=> {
        console.error(error);
        let errorMessage="error accessing candidate service";
        console.error(errorMessage);
        document.getElementById('potentialBallots').append(errorMessage);
    })
    // write a list of candidates to the page
   
}

function loadVoters() {
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
        makeAList('potentialBallots',potentialBallots);
        makeAList('completedBallots',completedBallots);
    })

}

function makeAList( target, data ) {
    const element=document.getElementById(target);
    element.innerHTML=""; // clear out content
        let list=document.createElement('ul');
        for (let i=0;i<data.length;i++) {
            let li=document.createElement('li');
            li.setAttribute('id','li'+i);
            li.innerHTML=" "+data[i].name;
            list.appendChild(li);
        }
        element.append(list);
}
async function  saveVoter(voter) {
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
    })
    .catch(error=>console.log("error saving voter"));

    // STUB: maybe write the error on the page somewhere
}
function statusMessage(message) {
    document.getElementById("messages").innerHTML=message;
}
function submitAddUser() {
    let newName = document.getElementById('userName').value;
    saveVoter(newName); // post to the API
    closeSpan.onclick();
    // I've added a voter, need to reload the voter list
    loadVoters();
    return false;
}


// modal window functions
var modal=document.getElementById("myModal");
var btn=document.getElementById("addBtn");
var closeSpan=document.getElementsByClassName("close")[0];
btn.onclick=function() {
    modal.style.display="block";
}

closeSpan.onclick = function() {
    modal.style.display="none";
}
window.onclick=function(event) {
    if (event.target==modal) {
        modal.style.display="none";
    }
}
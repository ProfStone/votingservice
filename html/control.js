// front end JS for voter app
const endpoint = {};
endpoint['candidates']='http://localhost:8080/api/candidates';
endpoint['candidatesWithBallots']='http://localhost:8080/api/candidates/ballots';
endpoint['voter']='http://localhost:8080/api/voter';

function initPage() {
    // set up the page
    // set the title
    document.getElementById('heading').innerHTML="Candidates"; // to change later
    loadContent();
}
function loadContent() {
    // display a list of candidates
    let candidateNames = fetch( endpoint['candidates']);
    candidateNames.then( (result)=>result.json())
    .then( (result)=>  {
        //console.log(result);
        const target=document.getElementById('main');
        let list=document.createElement('ul');
        for (let i=0;i<result.length;i++) {
            let li=document.createElement('li');
            li.setAttribute('id','li'+i);
            li.innerHTML=" "+result[i].name;
            list.appendChild(li);
        }
        target.append(list);
    });
    // write a list of candidates to the page
   
}
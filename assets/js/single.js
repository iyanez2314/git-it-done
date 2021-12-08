var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


var getRepoName = function(){
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName){
        // display repo name on the page 
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else{
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
     
    fetch(apiUrl).then(function(response){
        //request was successful
        if(response.ok){
            response.json().then(function(data){
                // pass response data to dom function 
                displayIssues(data);

            // check if api has paginates issues
            if (response.headers.get("Link")){
                displayWarning(repo)
            }
            

            });
        }
        else {
            // if not succesful, redirect to homepage
            document.location.replace('./index.html');
        }
    });
    console.log(repo)
};

var displayIssues = function(issues){
    if(issues.length === 0 ){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
        //loop over repos
    for (var i = 0; i < issues.length; i++){
        // format repo name 
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a link for each repo
        var repoEl = document.createElement("a");
        repoEl.classList= "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);


        // create span to hold issue title 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request 
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
    }
    var displayWarning = function(repo){
        var linkEl = document.createElement("a");
        linkEl.textContent ="See more Issues On GitHub.com";
        linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
        linkEl.setAttribute("target", "_blank");

        // append to warning container
        limitWarningEl.appendChild(linkEl);
    
};




getRepoIssues("facebook/react");
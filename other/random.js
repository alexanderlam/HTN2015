var Github = require('github-api');

var github = new Github({
    token:process.env.DOCKER_GITHUB_CODE,
    auth:'oauth'
});

var username = "";

var user = github.getUser();
user.show(username, function(err, repos) {
    if(err){
        console.log(err);
    }
    else{
        console.log(repos);
    }
});
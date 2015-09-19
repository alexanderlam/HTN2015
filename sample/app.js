var Github = require('github-api');
var github = new Github({
    token:process.env.DOCKER_GITHUB_CODE,
    auth:'oauth'
});

var issues = github.getIssues('l3ubbleman', 'WebScraper');
issues.list({},function(err, data){
    console.log(data[0].labels[1]);
});

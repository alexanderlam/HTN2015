var Github = require('github-api');
var Firebase = require('firebase');
var mainRef = new Firebase("https://crackling-inferno-3664.firebaseio.com/");
var request = require('request');

var github = new Github({
    token:process.env.DOCKER_GITHUB_CODE,
    auth:'oauth'
});

var developer = require('./users/dev');
var project = require('./users/proj');

var devCreate = function(data, callback){
    github.getUser().show(data, function(err, user){
        if(err){
            console.log(err);
        }
        
        else{
            var list = {};
            var usersRef = mainRef.child("developers");

            usersRef.once("value", function(snapshot) {
                list = snapshot.val();

                var bool = false;
                for (var key in list) {
                    if (list.hasOwnProperty(key)) {
                        if(list[key].gitHandle === user.login){
                            bool = true;
                        }
                    }
                }

                if(!bool){
                    developer.name = user.name;
                    developer.gitHandle = user.login;
                    developer.picUrl = user.avatar_url;
                    developer.gitUrl = user.url;
                    developer.description = user.bio;
                    developer.lookup = data.lookup ? data.lookup:null;

                    usersRef.push().set(developer);
                    callback(null, developer);
                }
                else{
                    callback('dev already exists', null);
                }

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            });
        }
    });
};

var devLogin = function(data, callback){
    github.getUser().show(data.user, function(err, user){
        if(err){
            console.log(err);
        }
        else{
            var list = {};
            var ourUser = {};
            var usersRef = mainRef.child("developers");

            usersRef.once("value", function(snapshot) {
                list = snapshot.val();

                var bool = false;
                for (var key in list) {
                    if (list.hasOwnProperty(key)) {
                        if(list[key].gitHandle === user.login){
                            ourUser = list[key];
                            bool = true;
                        }
                    }
                }

                if(bool){
                    callback(null, ourUser);
                }
                else{
                    callback('dev does not exist', null);
                }

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            });
        }
    });
};

var devMatch = function(query, callback){
    var usersRef = mainRef.child("developers");
    usersRef.orderByChild("lookup").equalTo(query).once("value", function(snapshot) {
        callback(null, snapshot.val());
    });
};

var projCreate = function(user1, repo1, callback){
    var repo = github.getRepo(user1, repo1);
    repo.show(function(err, repo){
        if(err){
            console.log(err);
        }
        else{
            var list = {};
            var reposRef = mainRef.child("projects");

            reposRef.once("value", function(snapshot) {
                list = snapshot.val();

                var bool = false;
                for (var key in list) {
                    if (list.hasOwnProperty(key)) {
                        if(list[key].name === repo.full_name){
                            bool = true;
                        }
                    }
                }

                if(!bool){
                    project.name = repo.full_name;
                    project.owner = repo.owner.login;
                    project.gitUrl = repo.url;
                    project.description = repo.description;
                    project.lookup = user1.lookup ? user1.lookup:null;
                    project.picUrl = repo.owner.avatar_url;

                    reposRef.push().set(project);
                    callback(null, project);
                }
                else{
                    callback('project already exists', null);
                }

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            });
        }
    });
};

var projLogin = function(data, callback){
    var repo = github.getRepo(data.user, data.repo);
    repo.show(function(err, repo){
        if(err){
            console.log(err);
        }
        else{
            var ourProj = {};
            var list = {};
            var reposRef = mainRef.child("projects");

            reposRef.once("value", function(snapshot) {
                list = snapshot.val();

                var bool = false;
                for (var key in list) {
                    if (list.hasOwnProperty(key)) {
                        if(list[key].name === repo.full_name){
                            ourProj = list[key];
                            bool = true;
                        }
                    }
                }

                if(bool){
                    callback(null, ourProj);
                }
                else{
                    callback('project does not exist', null);
                }

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                callback(errorObject, null);
            });
        }
    });
};

var projMatch = function(query, callback){
    var usersRef = mainRef.child("projects");
    usersRef.orderByChild("lookup").equalTo(query).once("value", function(snapshot) {
        callback(null, snapshot.val());
    });
};

var express = require("express");
var app = express();
//var multer = require('multer');

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));
//app.use(multer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/developer/signup', function (req, res) {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    devCreate(req.body, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post('/developer/login', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    devLogin(req.body, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post('/developer/match', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    devMatch(req.body.query, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post('/project/signup', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    projCreate(req.body, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post('/project/login', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    projLogin(req.body, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post('/project/match', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    projMatch(req.body.query, function(err, data){
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(data);
        }
    });
});

var username = 'alexanderlam';
var reponame = 'HTN2015';
app.get('/issues', function(req, res){
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var issues = github.getIssues(username, reponame);
    issues.list({}, function(err, issues) {
        if(err){
            res.status(404).send({message:err});
        }
        else{
            res.status(200).send(issues);
        }
    });
});

app.get('/_ah/health', function(req, res) {
  res.status(200).send('ok');
  });

var usernames = ["sindresorhus",
        "jashkenas",
        "substack",
        "tj",
        "kennethreitz",
        "mbostock",
        "vhf",
        "hakimel",
        "tpope",
        "JakeWharton",
        "addyosmani",
        "defunkt",
        "mitsuhiko",
        "blueimp",
        "nicklockwood",
        "bartaz",
        "necolas",
        "mrdoob",
        "sstephenson",
        "robbyrussell",
        "daneden",
        "rstacruz",
        "mattt",
        "bevacqua",
        "torvalds",
        "bbatsov",
        "ryanb",
        "madrobby",
        "progrium",
        "jakubroztocil",
        "antirez",
        "mitchellh",
        "creationix",
        "caolan",
        "mathiasbynens",
        "scottjehl",
        "desandro",
        "maxogden",
        "nvie",
        "tiimgreen",
        "maccman",
        "felixge",
        "typicode",
        "ariya",
        "dypsilon",
        "davatron5000",
        "sahat",
        "remy",
        "wycats",
        "igrigorik",
        "rwaldron",
        "nnnick",
        "chrisbanes",
        "vinta",
        "getify",
        "Prinzhorn",
        "vim-scripts",
        "kripken",
        "dimsemenov",
        "mojombo",
        "nthanmarz",
        "IanLunn",
        "peachananr",
        "jakiestfu",
        "sferik",
        "astaxie",
        "mdo",
        "chriskempson",
        "jrburke",
        "soffes",
        "crooloose",
        "prakhar1989",
        "rs",
        "octocat",
        "chjj",
        "kenwheeler",
        "LeaVerou",
        "csswizardry",
        "jaredhanson",
        "paulirish",
        "mperham",
        "daimajia",
        "ankane",
        "romaonthego",
        "bayandin",
        "douglascrockford",
        "altercation",
        "steipete",
        "mattn",
        "cantino",
        "alex",
        "ccampbell",
        "imathis",
        "alvarotrigo",
        "technomancy",
        "mrmrs",
        "aFarkas",
        "justjavac"]
    ;

var repos = [
    'twbs',
    'vhf',
    'angular',
    'mbostock',
    'jquery',
    'FortAwesome',
    'rails',
    'meteor',
    'github',
    'robbyrussell',
    'Homebrew',
    'adobe',
    'jashkenas',
    'nwjs',
    'moment',
    'torvalds',
    'daneden',
    'zurb',
    'hakimel',
    'docker',
    'blueimp',
    'jekyll',
    'mrdoob',
    'strongloop',
    'sindresorhus',
    'harvesthq',
    'facebook',
    'jkbrzt',
    'AFNetworking',
    'necolas',
    'Automattic',
    'resume',
    'tiimgreen',
    'Semantic-Org',
    'gitlabhq',
    'laravel',
    'Modernizr',
    'kennethreitz',
    'TryGhost',
    'google',
    'driftyco',
    'jashkenas',
    'discourse',
    'nnnick'
];

var users = [
    'bootstrap',
    'free-programming-books',
    'angular.js',
    'd3',
    'jquery',
    'Font-Awesome',
    'rails',
    'meteor',
    'gitignore',
    'oh-my-zsh',
    'homebrew',
    'brackets',
    'backbone',
    'nw.js',
    'moment',
    'linux',
    'animate.css',
    'foundation',
    'reveal.js',
    'docker',
    'jQuery-File-Upload',
    'jekyll',
    'three.js',
    'express',
    'awesome',
    'chosen',
    'react',
    'httpie',
    'AFNetworking',
    'normalize.css',
    'socket.io',
    'resume.github.com',
    'github-cheat-sheet',
    'Semantic-UI',
    'gitlabhq',
    'laravel',
    'Modernizr',
    'requests',
    'Ghost',
    'material-design-icons',
    'ionic',
    'underscore',
    'discourse',
    'Chart.js'
]

var recurse = function(count){
    if(count > 45){
        return;
    }
    else {
        projCreate(repos[count], users[count], function(err, user){
            console.log(user);
            recurse(count+1);
        });
    }
};
recurse(0);
//var requestAzure = {
//    "Inputs": {
//        "input1": {
//            "ColumnNames": [
//                "public_repos",
//                "followers",
//                "stars"
//            ],
//            "Values": [
//                [
//                    "0",
//                    "0",
//                    "0" ],
//                [
//                    "0",
//                    "0",
//                    "0" ]
//            ] }
//    },
//    "GlobalParameters": {}
//};
//
//app.post('/azure/user', function(req, res){
//    res.set({
//        "Content-Type": "application/json",
//        "Access-Control-Allow-Origin": "*"
//    });
//
//    var options = {
//        method:'POST',
//        url:'https://ussouthcentral.services.azureml.net/workspaces/febfd10c13dd4a9db4716fe08b2f72a6/services/6814f2d8218c453aa5232e8516043596/execute?api‐version=2.0&details=true',
//        headers:{
//            "Content‐Type":"application/json",
//            "Authorization":"Bearer mr52m/5/Owybpag413K6qB5nU3/Bb/Mo2Xgwf3WOmuEXiPEl3I5InXm6Pa7ezpnlVJQAlPX8eICnI2R4Mtnh7g=="
//        },
//        body:JSON.stringify(requestAzure)
//    }
//
//    request(options, function(err, data){
//        if(err){
//            console.log(err);
//        }
//        else{
//            console.log(data.body);
//        }
//    })
//});
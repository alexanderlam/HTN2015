var Github = require('github-api');
var Firebase = require('firebase');
var mainRef = new Firebase("https://crackling-inferno-3664.firebaseio.com/");

var github = new Github({
    token:process.env.DOCKER_GITHUB_CODE,
    auth:'oauth'
});

var developer = require('./users/dev');

var devCreate = function(data, callback){
    github.getUser().show(data.user, function(err, user){
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
                    developer.lookup = null;

                    usersRef.push().set(developer);
                    callback(null, developer);
                }
                else{
                    callback('already exists', null);
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
                    callback('user does not exist', null);
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

var createProj = function(callback){};

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


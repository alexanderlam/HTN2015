# HTN2015
Hack the North - Team Winners
Firebase DB URL: https://crackling-inferno-3664.firebaseio.com

schema:
User : db url: https://crackling-inferno-3664.firebaseio.com/users
 
-uid
-first_name
-last_name
-email
-points {
    'sprint-xxx': 10,
    'sprint-xxy': 100
}

Sprint
-id
-description
-tasks {
    '1': true,
    ..... 'task_id': true }

Task
-id
-sprint_id
-points_rewarded
-name
-description

developer endpoints:
```
POST /developer/signup 
 body: {"user":githubHandle,"lookup":interests}
POST /developer/login
 body: {"user":githubHandle}
POST /developer/match
 body: {"query":lookupField}
```

project endpoints:
```
POST /project/signup 
 body: {"user":githubHandle that owns repository, "repo":repository, "lookup":interests}
POST /project/login
 body: {"user":githubHandle that owns repository, "repo":repository}
POST /project/match
 body: {"query":lookupField}
```

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

## Intro

For simplicity everything is in one script - app.js.<br>
As we've discussed there are no queues, no rate limit checkups<br><br>
There is a cron block and API block.<br>
Thoughts for optimization: <br>
Because of rate limit and our thought that data will be huge we need to reduce number of API calls.<br>
Here is not the full list of ideas that should be further groomed:<br>
1. We can request sorted response and for heavy users (with more than 100 repos) don't make additional requests
with page=2,3,etc... if the response didn't change. In order to do so we need to hash response and store its hash in DB and compare hashes<br>
https://api.github.com/users/user_name/repos?page=1&per_page=100&sort=updated
2. 

## To start API run
```bash
npm run
```
or
```bash
node app.js
```


## API methods

### Create user

POST /api/users
{"username":"github_user_name"}

RESPONSE: json, 202 ok

### LIST users

GET /api/users

RESPONSE: json, code 200 ok

### GET info for single user 

GET /api/users/user_id

RESPONSE: json, code 200 ok

### GET repos for single user 

GET /api/users/user_id/repos

RESPONSE: json, code 200 ok

### Update repos for single user

GET /api/users/user_id/update_repos

RESPONSE: json, code 200 ok

### SQL

Initial sql query to make it run

```postgresql
CREATE DATABASE codespread;

create table if not exists users
(
 id serial not null
  constraint users_pk
   primary key,
 username text not null,
 user_data json,
 update timestamp default now()
);

alter table users owner to pavel;

create unique index if not exists users_id_uindex
 on users (id);

create unique index if not exists users_username_uindex
 on users (username);

create table user_repos
(
	user_id int not null
		constraint user_repos_user_id_pk
			primary key,
	repos json,
	update timestamp default now()
);

INSERT INTO public.users (id, username, user_data, update) VALUES (1, 'pavelkalin', '{"login":"pavelkalin","id":10513118,"node_id":"MDQ6VXNlcjEwNTEzMTE4","avatar_url":"https://avatars.githubusercontent.com/u/10513118?v=4","gravatar_id":"","url":"https://api.github.com/users/pavelkalin","html_url":"https://github.com/pavelkalin","followers_url":"https://api.github.com/users/pavelkalin/followers","following_url":"https://api.github.com/users/pavelkalin/following{/other_user}","gists_url":"https://api.github.com/users/pavelkalin/gists{/gist_id}","starred_url":"https://api.github.com/users/pavelkalin/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/pavelkalin/subscriptions","organizations_url":"https://api.github.com/users/pavelkalin/orgs","repos_url":"https://api.github.com/users/pavelkalin/repos","events_url":"https://api.github.com/users/pavelkalin/events{/privacy}","received_events_url":"https://api.github.com/users/pavelkalin/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":25,"public_gists":0,"followers":1,"following":0,"created_at":"2015-01-13T09:30:17Z","updated_at":"2021-07-21T12:32:06Z"}', '2021-07-21 19:11:47.044789');
INSERT INTO public.users (id, username, user_data, update) VALUES (2, 'MichaelTsafrir', '{"login":"MichaelTsafrir","id":17161589,"node_id":"MDQ6VXNlcjE3MTYxNTg5","avatar_url":"https://avatars.githubusercontent.com/u/17161589?v=4","gravatar_id":"","url":"https://api.github.com/users/MichaelTsafrir","html_url":"https://github.com/MichaelTsafrir","followers_url":"https://api.github.com/users/MichaelTsafrir/followers","following_url":"https://api.github.com/users/MichaelTsafrir/following{/other_user}","gists_url":"https://api.github.com/users/MichaelTsafrir/gists{/gist_id}","starred_url":"https://api.github.com/users/MichaelTsafrir/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/MichaelTsafrir/subscriptions","organizations_url":"https://api.github.com/users/MichaelTsafrir/orgs","repos_url":"https://api.github.com/users/MichaelTsafrir/repos","events_url":"https://api.github.com/users/MichaelTsafrir/events{/privacy}","received_events_url":"https://api.github.com/users/MichaelTsafrir/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":6,"public_gists":0,"followers":0,"following":0,"created_at":"2016-02-10T14:13:05Z","updated_at":"2021-07-21T09:14:57Z"}', '2021-07-21 11:00:21.305769');
INSERT INTO public.users (id, username, user_data, update) VALUES (3, 'abra', '{"login":"abra","id":55690,"node_id":"MDQ6VXNlcjU1Njkw","avatar_url":"https://avatars.githubusercontent.com/u/55690?v=4","gravatar_id":"","url":"https://api.github.com/users/abra","html_url":"https://github.com/abra","followers_url":"https://api.github.com/users/abra/followers","following_url":"https://api.github.com/users/abra/following{/other_user}","gists_url":"https://api.github.com/users/abra/gists{/gist_id}","starred_url":"https://api.github.com/users/abra/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/abra/subscriptions","organizations_url":"https://api.github.com/users/abra/orgs","repos_url":"https://api.github.com/users/abra/repos","events_url":"https://api.github.com/users/abra/events{/privacy}","received_events_url":"https://api.github.com/users/abra/received_events","type":"User","site_admin":false,"name":"Aydar Khabibullin","company":null,"blog":"","location":"Russia","email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":7,"public_gists":4,"followers":27,"following":74,"created_at":"2009-02-18T20:27:54Z","updated_at":"2021-07-15T11:54:22Z"}', '2021-07-21 10:58:12.639001');
INSERT INTO public.users (id, username, user_data, update) VALUES (4, 'pavel', '{"login":"pavel","id":5321105,"node_id":"MDQ6VXNlcjUzMjExMDU=","avatar_url":"https://avatars.githubusercontent.com/u/5321105?v=4","gravatar_id":"","url":"https://api.github.com/users/pavel","html_url":"https://github.com/pavel","followers_url":"https://api.github.com/users/pavel/followers","following_url":"https://api.github.com/users/pavel/following{/other_user}","gists_url":"https://api.github.com/users/pavel/gists{/gist_id}","starred_url":"https://api.github.com/users/pavel/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/pavel/subscriptions","organizations_url":"https://api.github.com/users/pavel/orgs","repos_url":"https://api.github.com/users/pavel/repos","events_url":"https://api.github.com/users/pavel/events{/privacy}","received_events_url":"https://api.github.com/users/pavel/received_events","type":"User","site_admin":false,"name":null,"company":null,"blog":"","location":null,"email":null,"hireable":null,"bio":null,"twitter_username":null,"public_repos":20,"public_gists":1,"followers":3,"following":0,"created_at":"2013-08-27T12:44:53Z","updated_at":"2021-07-18T05:05:00Z"}', '2021-07-21 17:59:31.145765');
INSERT INTO public.users (id, username, user_data, update) VALUES (5, 'fabpot', '{"login":"fabpot","id":47313,"node_id":"MDQ6VXNlcjQ3MzEz","avatar_url":"https://avatars.githubusercontent.com/u/47313?v=4","gravatar_id":"","url":"https://api.github.com/users/fabpot","html_url":"https://github.com/fabpot","followers_url":"https://api.github.com/users/fabpot/followers","following_url":"https://api.github.com/users/fabpot/following{/other_user}","gists_url":"https://api.github.com/users/fabpot/gists{/gist_id}","starred_url":"https://api.github.com/users/fabpot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/fabpot/subscriptions","organizations_url":"https://api.github.com/users/fabpot/orgs","repos_url":"https://api.github.com/users/fabpot/repos","events_url":"https://api.github.com/users/fabpot/events{/privacy}","received_events_url":"https://api.github.com/users/fabpot/received_events","type":"User","site_admin":false,"name":"Fabien Potencier","company":"Symfony/Blackfire","blog":"http://fabien.potencier.org/","location":"Lille, France","email":null,"hireable":null,"bio":null,"twitter_username":"fabpot","public_repos":55,"public_gists":12,"followers":11624,"following":0,"created_at":"2009-01-17T13:42:51Z","updated_at":"2021-07-20T12:33:59Z"}', '2021-07-21 18:40:07.113613');
INSERT INTO public.users (id, username, user_data, update) VALUES (6, 'andrew', '{"login":"andrew","id":1060,"node_id":"MDQ6VXNlcjEwNjA=","avatar_url":"https://avatars.githubusercontent.com/u/1060?v=4","gravatar_id":"","url":"https://api.github.com/users/andrew","html_url":"https://github.com/andrew","followers_url":"https://api.github.com/users/andrew/followers","following_url":"https://api.github.com/users/andrew/following{/other_user}","gists_url":"https://api.github.com/users/andrew/gists{/gist_id}","starred_url":"https://api.github.com/users/andrew/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/andrew/subscriptions","organizations_url":"https://api.github.com/users/andrew/orgs","repos_url":"https://api.github.com/users/andrew/repos","events_url":"https://api.github.com/users/andrew/events{/privacy}","received_events_url":"https://api.github.com/users/andrew/received_events","type":"User","site_admin":false,"name":"Andrew Nesbitt","company":null,"blog":"https://nesbitt.io","location":"UK","email":null,"hireable":null,"bio":"Software engineer and researcher","twitter_username":"teabass","public_repos":298,"public_gists":192,"followers":2697,"following":3152,"created_at":"2008-02-27T11:39:22Z","updated_at":"2021-05-17T14:04:22Z"}', '2021-07-21 19:05:44.790739');


```


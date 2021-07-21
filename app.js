'use strict';
process.on('uncaughtException', err=>{ console.error('uncaughtException:', err); });
process.on('unhandledRejection', (reason, promise)=>{
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const request = require('request');
const dotenv  = require('dotenv');
const cron    = require('node-cron');
global.axios = require('axios');
dotenv.config();
if (process.env.GITHUB_TOKEN) axios.defaults.headers.common['Authorization'] = 'token ' + process.env.GITHUB_TOKEN;

const {Sequelize} = require('sequelize');

global.DB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER, {
	// gimme postgres, please!
	dialect:'postgres'
});

const app = express();

const tasks   = require('./cron');
const users   = require('./routes/Users');

//region Cron block

cron.schedule('0 */4 * * *', ()=>{
	console.log('Running a task every 4 hours');
	tasks.update_repos().then().catch(e=>console.error(e));
});

cron.schedule('*/5 * * * *', ()=>{
	console.log('Running a task every 5 minutes to not wait 4 hours');
	tasks.update_repos().then().catch(e=>console.error(e));
});

cron.schedule('* * * * *', ()=>{
	// console.log('Running a task every minute to not wait 4 hours');
	// tasks.update_repos().then().catch(e=>console.error(e));
});

//endregion

app.use(express.json());

function simple_logger(req){
	let data;
	if(req.method==='POST' || req.method==='PUT') data = JSON.stringify(req.body);
	console.log(`${new Date().toUTCString()} ${req.method} ${req.url} ${data ? data : ''}  ${req.headers['user-agent']}`);
}

app.use(function(req, res, next){
	simple_logger(req);
	next();
});

app.listen(3333, ()=>{
	console.log("Server running on port 3333");
	console.log("Get users: http://localhost:3333/api/users");
	console.log("Get info for single user: http://localhost:3333/api/users/1");
	console.log("Get repos for single user: http://localhost:3333/api/users/1/repos");
	console.log("Update repos for single user: http://localhost:3333/api/users/1/update_repos");
});

app.get('/api/users', users.get_all);
app.get('/api/users/:id', users.get_user);
app.post('/api/users', users.create_user);
app.get('/api/users/:id/update_repos', users.update_user_repos);
app.get('/api/users/:id/repos', users.get_repos);
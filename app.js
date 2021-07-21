'use strict';
process.on('uncaughtException', err=>{ console.error('uncaughtException:', err); });

const express = require('express');
const request = require('request');
const users   = require('./routes/Users');
const dotenv  = require('dotenv');
global.axios = require('axios');

dotenv.config();

const { Sequelize } = require('sequelize');
global.DB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER, {
  // gimme postgres, please!
  dialect: 'postgres'
})
const app          = express();
app.use(express.json());

function simple_logger(req){
	let data;
	if(req.method==='POST') data = JSON.stringify(req.body);
	console.log(`${new Date().toUTCString()} ${req.method} ${req.url} ${data ? data : ''}  ${req.headers['user-agent']}`);
}

app.use(function(req, res, next){
	simple_logger(req);
	next();
});

app.listen(3333, ()=>{
	console.log("Server running on port 3333");
	console.log("Get links: http://localhost:3333/api/users");
});

app.get('/api/users', users.get_all);
app.get('/api/users/:id', users.get_user);
app.post('/api/users', users.create_user);
// app.put('/api/users/:id', users.update_user);
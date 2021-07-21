const {get_user_profile, get_user_repos}   = require('../libs/GithubAPI');

// Get all users from DB
const get_all = async (req, res)=>{
	try{
		const users = await DB.query("SELECT id, username, user_data FROM users");
		return await res.status(200).json(users[0]);
	}catch(error){
		console.error('Error', error);
	}
};

// Get profile of user from DB
const get_user = async (req, res)=>{
	const {id} = req.params;
	if(!id) return;
	const user = await DB.query(`SELECT user_data FROM users WHERE id=${~~id}`);
	if(!user || !user[0] || user[0].length===0) return await res.status(404).json({error:`specified user (${id}) does not exist in the DB`});
	return await res.status(200).json(user[0][0].user_data);
};

//Create a user and fetch his repos
const create_user = async (req, res)=>{
	const {user_name} = req.body;
	if(!user_name) return await res.status(404).json({error:`No user_name provided or Headers of request don't have Content-Type: application/json`});
	const info = await get_user_profile(user_name);
	if(!info) return await res.status(404).json({error:`Error during github fetching`});
	try{
		const user = await DB.query(`
INSERT INTO users (username, user_data) VALUES ('${user_name}','${JSON.stringify(info)}') 
ON CONFLICT (username) DO UPDATE SET user_data='${JSON.stringify(info)}', update='NOW()' RETURNING *`);
		get_user_repos(user_name).then(repos=>{
			const repos_json = JSON.stringify(repos).replace(/[']/g, "''"); //some repos can have single quote in names, for json it should be replaced with two single quotes
			DB.query(`
	INSERT INTO user_repos (user_id, repos) VALUES (${user[0][0].id},'${repos_json}') 
	ON CONFLICT (user_id) DO UPDATE SET repos='${repos_json}', update='NOW()'`).then().catch(error=>{console.error('Error', error);});
		}).catch(error=>{console.error('Error', error);});
		return await res.status(202).json(user[0][0]);
	}catch(error){
		return await res.status(404).json({error:`Database error occured`});
	}
};

//Update user's repos in DB
const update_user_repos = async (req, res)=>{
	const {id:user_id} = req.params;
	if(!user_id) return await res.status(404).json({error:`No user_id provided or Headers of request don't have Content-Type: application/json`});
	const user = await DB.query(`SELECT username, user_data FROM users WHERE id=${~~user_id}`);
	if(!user || !user[0] || user[0].length===0) return await res.status(404).json({error:`specified user (${user_id}) does not exist in the DB`});
	const user_name = user[0][0].username;
	const repos = await get_user_repos(user_name);
	if(!repos) return await res.status(404).json({error:`Error during github fetching`});
	try{
		const repos_json = JSON.stringify(repos).replace(/[']/g, "''"); //some repos can have single quote in names, for json it should be replaced with two single quotes
		await DB.query(`
INSERT INTO user_repos (user_id, repos) VALUES (${user_id},'${repos_json}') 
ON CONFLICT (user_id) DO UPDATE SET repos='${repos_json}', update='NOW()'`);
	}catch(error){
		return await res.status(404).json({error:`Database error occured`});
	}
	return await res.status(200).json(repos);
};


//Get repos from DB
const get_repos = async (req, res)=>{
	const {id:user_id} = req.params;
	if(!user_id) return await res.status(404).json({error:`No user_id provided or Headers of request don't have Content-Type: application/json`});
	const repos = await DB.query(`SELECT repos FROM user_repos WHERE user_id=${~~user_id}`);
	if(!repos || !repos[0] || repos[0].length===0) return await res.status(404).json({error:`specified user (${user_id}) does not exist in the DB or doesn't have repos`});
	return await res.status(200).json(repos[0][0].repos);
};


module.exports = {get_all, get_user, create_user, update_user_repos, get_repos};

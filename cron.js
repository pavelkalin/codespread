const {get_user_repos} = require('./libs/GithubAPI');

const update_repos = async ()=>{
	const users = await DB.query("SELECT username, id FROM users");
	if(!users || !users[0] || users[0].length===0){console.log('No users in DB'); return;}
	users[0].forEach(user=>{
		get_user_repos(user.username).then(repos=>{
			if(!repos) return;
			const repos_json = JSON.stringify(repos).replace(/[']/g, "''");
			DB.query(`
INSERT INTO user_repos (user_id, repos) VALUES (${user.id},'${repos_json}')
ON CONFLICT (user_id) DO UPDATE SET repos='${repos_json}', update='NOW()'`).then().catch(e=>console.error(e));
		}).catch(e=>console.error(e));
	});
};

module.exports = {update_repos};
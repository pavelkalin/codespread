const get_all = async (req, res)=>{
	try{
		const users = await DB.query("SELECT id, username, user_data FROM users");
		return await res.status(200).json(users[0]);
	}catch(error){
		console.error('Error', error);
	}
};

const get_user = async (req, res)=>{
	const {id} = req.params;
	if (!id) return;
	const user = await DB.query(`SELECT user_data FROM users WHERE id=${~~id}`);
	if (!user || !user[0] || user[0].length===0) return await res.status(404).json({error:`specified user (${id}) does not exist in the DB`});
	return await res.status(200).json(user[0][0].user_data);
};

const create_user = async (req, res)=>{
	const {user_name} = req.body;
	if (!user_name) return await res.status(404).json({error:`Error`});
	const info = await fetch_github(user_name);
	if (!info) return await res.status(404).json({error:`Error`});
	const user = await DB.query(`INSERT INTO users (username, user_data) VALUES ('${user_name}','${JSON.stringify(info)}')`);
	return await res.status(200).json(info);
};

const fetch_github = async (user_name) => {
	let response=false;
	try{
		response = await axios.get(`https://api.github.com/users/${user_name}`);
	}catch(error){
		console.error('Error', error);
		return false;
	}
	return response.data;
}


module.exports = {get_all, get_user, create_user};

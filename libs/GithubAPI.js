const get_user_profile = async (user_name)=>{
	let response = false;
	try{
		response = await axios.get(`https://api.github.com/users/${user_name}`);
	}catch(error){
		console.warn('Error', error);
		console.warn('Error', error.response.data);
		return false;
	}
	return response.data;
};

const get_user_repos = async (user_name)=>{
	let response = false;
	try{
		response = await axios.get(`https://api.github.com/users/${user_name}/repos?page=1&per_page=100&sort=updated`);
		let next = true, i=2;
		while (next) {
			let resp = await axios.get(`https://api.github.com/users/${user_name}/repos?page=${i}&per_page=100&sort=updated`);
			if (resp.data && resp.data.length>0) {
				response.data = [...response.data, ...resp.data];
				i++;
			}else{
				next = false;
			}
		}
	}catch(error){
		console.warn('Error', error.response.data);
		return false;
	}
	return response.data;
};


module.exports = {get_user_profile, get_user_repos};
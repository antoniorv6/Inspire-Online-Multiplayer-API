//DEFINICION DE CLASES Y METODOS DE VARIABLES
class RequestInterface
{
	constructor(){
		this.baseURL = '';
	}

	geturl(url)
	{
		return this.baseURL + url;
	}

	setBaseURL(newURL)
	{
		this.baseURL = newURL;
	}
}

class UserManagement
{
	setLogin(user)
	{
		sessionStorage.setItem('user', user);
	}

	setAuthToken(auth)
	{
		sessionStorage.setItem('authToken', auth);
	}

	getUser()
	{
		return sessionStorage.getItem('user');
	}

	getAuthToken()
	{
		return sessionStorage.getItem('authToken');
	}

	logout()
	{
		sessionStorage.removeItem('user');
		sessionStorage.removeItem('authToken');
	}
}
//DEFINICION DE METODOS COMPLEJOS

RequestInterface.prototype.getRequestFETCH = function(url, authTokenRequired, callbacksuccess)
{
	let data = {'method':'GET'};

	if(authTokenRequired)
	{
		data["headers"] = {'x-auth': userManager.getAuthToken()};
	}

	fetch(this.geturl(url), data).
		then(
				function(result)
				{
					callbacksuccess(result);
				},
				function(error)
				{
					console.log('error');
				}		
		);
}

RequestInterface.prototype.postRequestFETCH = function (url, form, authtokenRequired, callbacksuccess)
{
	let formData = new FormData(form);
	let jsonHeader = {'Content-Type': "application/json"}
	let jsonForm = {};

	if(authtokenRequired)
	{
		jsonHeader["x-auth"] = userManager.getAuthToken();
	}

	for (const [key, value]  of formData.entries()) {
    	jsonForm[key] = value;
	}
	
	let data = {'method':'POST', 'body': JSON.stringify(jsonForm)};
	data["headers"] = jsonHeader;

	fetch(this.geturl(url), data).then(
		function(result)
		{
			callbacksuccess(result);
		},
		function(error)
		{

		});

}

RequestInterface.prototype.deleteRequestFETCH = function(url, authtokenRequired, callbacksuccess)
{
	let data = {'method' : 'DELETE'};

	if(authtokenRequired)
	{
		data["headers"] = {'x-auth': userManager.getAuthToken()};
	}

	fetch(this.geturl(url), data).then(
		function(result)
		{
			callbacksuccess(result);
		},
		function(error)
		{

		}
	);
}

const reqInterface = new RequestInterface(),
	  	 userManager = new UserManagement();

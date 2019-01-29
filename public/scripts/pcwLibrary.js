//DEFINICION DE CLASES Y METODOS DE VARIABLES
function RequestInterface()
{
	var baseURL = '';

	this.geturl = function(url)
	{
		console.log(baseURL + url);
		return baseURL + url;
	}

	this.setBaseURL = function(newURL)
	{
		baseURL = newURL;
	}

}

function UserManagement()
{
	this.setLogin = function(user)
	{
		sessionStorage.setItem('login', user);
	}

	this.setKey = function(auth)
	{
		sessionStorage.setItem('key', auth);
	}

	this.getLogin = function()
	{
		return sessionStorage.getItem('login');
	}

	this.getKey = function()
	{
		return sessionStorage.getItem('key');
	}

	this.logout = function()
	{
		sessionStorage.removeItem('login');
		sessionSotrage.removeItem('key');
	}

	this.isUserLoggedIn = function()
	{
		if(sessionStorage.getItem('login') == null)
			return false;

		return true;
	}
}

function FileManager()
{
	var lastImagesrc = undefined;

	this.getLastSrc = function()
	{
		return lastImageSrc;
	}

	this.setNewSrc = function(src)
	{
		lastImagesrc = src;
	}
}

function CanvasSettings(identificator)
{
	var width = undefined,
		height = undefined,
		id = identificator;

	this.getID = function()
	{
		return id;
	}

	this.setWidth = function(newWidth)
	{
		width = newWidth;
	}
	this.setHeight = function(newHeight)
	{
		height = newHeight;
	}
	this.setSize = function(newWidth, newHeight)
	{
		this.setWidth(newWidth);
		this.setHeight(newHeight);
		let cv = document.getElementById(this.getID());
		cv.width = newWidth;
		cv.height = newHeight;
	}
	this.getSize = function()
	{
		return [width, height];
	}
	this.reset = function()
	{
		document.getElementById(id).width = width;
		console.log('reseted');
	}
}

function CanvasManager()
{
	let canvasArray = {};

	this.getCanvasArray = function()
	{
		return canvasArray;
	}

	this.resetCanvas = function(identificator)
	{
		canvasArray[identificator].reset();
	}
}

//DEFINICION DE METODOS COMPLEJOS

RequestInterface.prototype.getRequestFETCH = function(url, callbacksuccess)
{
	fetch(this.geturl(url)).
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

RequestInterface.prototype.postRequestFETCH = function (url, form, callbacksuccess)
{
	let formData = new FormData(form);
	let jsonHeader = {'Content-Type': "application/json"}
	let jsonForm = {};

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

RequestInterface.prototype.deleteRequestFETCH = function(url, callbacksuccess)
{
	let data = {'method' : 'DELETE'};
	let jsonHeader = {'x-auth': sessionStorage.getItem('Token')};
	data["headers"] = jsonHeader;

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


FileManager.prototype.chargePhoto = function(file, callbacksuccess)
{
	if(file.files[0]!=null && this.checkExtension(file.files[0]))
	{
		let fr = new FileReader();

			fr.onload = function()
				{
					let img = new Image();
					img.onload = function()
					{
						// Devuelve toda la etiqueta img preparada para lo que queramos suuuuh
						fileManager.setNewSrc(img.src);
						callbacksuccess(img);
					};
					img.src = fr.result;
				}

		fr.readAsDataURL(file.files[0]);
	}
}

FileManager.prototype.checkExtension = function(file)
{
	if(file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/svg')
		return true;
	return false;
}

CanvasManager.prototype.addNewCanvas = function(identificator, width, height)
{
	document.querySelector('body').innerHTML += `<canvas id=${identificator}></canvas>`;
	let canvasArray = this.getCanvasArray();
	canvasArray[identificator] = new CanvasSettings(identificator);
	canvasArray[identificator].setSize(width,height);
}

CanvasManager.prototype.drawImageOnCanvas = function(file, canvasID)
{
	let cv = document.getElementById(canvasID),
		ctx = cv.getContext('2d');

	fileManager.chargePhoto(file, load_ok);

	this.resetCanvas(canvasID);

	function load_ok(img)
	{
		ctx.drawImage(img, 0 ,0, cv.width, cv.height);
		console.log('todook');
	}
}

let reqInterface = new RequestInterface(),
	userManager = new UserManagement();
	fileManager = new FileManager();
	cvManager = new CanvasManager();

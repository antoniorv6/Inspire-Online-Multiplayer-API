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

function ModalManagement()
{
	var isModalSet = false;

	this.changeStatus = function(status)
	{
		isModalSet = status;
	}

	this.getModalStatus = function()
	{
		return isModalSet;
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

RequestInterface.prototype.getRequestAJAX = function(url, callbacksuccess)
{
	xhr = new XMLHttpRequest();

	xhr.open('GET', this.geturl(url), true);

	xhr.onload = function()
	{
		callbacksuccess(xhr.responseText);
	}

	xhr.send();
}

RequestInterface.prototype.postRequestAJAX = function (url, form, callbacksuccess, isHeaderRequired, isUserRequired)
{
	let formData = new FormData(form),
		xhr = new XMLHttpRequest();

	xhr.open('POST', this.geturl(url), true);
	xhr.onload = function()
	{
		callbacksuccess(xhr.responseText);
	}

	if(isHeaderRequired)
	{
		xhr.setRequestHeader('Authorization', userManager.getKey());
	}

	if(isUserRequired)
	{
		formData.append('l', userManager.getLogin())
	}

	xhr.send(formData);
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

ModalManagement.prototype.setModalZone = function()
{
	if(!this.getModalStatus())
	{
		let body = document.querySelector('body'),
			modal = document.createElement("div"),
			modalCont = document.createElement("div");

		//Esta zona la podeis editar como queráis, yo creo que es la forma mas facil de hacer un modal tranquilamente, pero ya como querais
		modal.id = "mensajemodal";
		modal.classList.add('modal');
		modalCont.classList.add('modal-content');
		modal.appendChild(modalCont);	
		body.insertBefore(modal, body.firstChild);
		this.changeStatus(true);
	}
}

ModalManagement.prototype.openModal = function(success, title, message)
{
	//******PODEIS PERSONALIZAR COMO QUERAIS******//

	if(this.getModalStatus())
	{
		document.getElementById('mensajemodal').style.display = 'block';

		if(success)
		{
			document.querySelector('.modal-content').innerHTML += `<h3 class="success">${title}</h3>
			${message}
			<button onclick="modalManager.closeModal()">Volver</button>`;
		}
		else
		{
			document.querySelector('.modal-content').innerHTML += `<h3 class="fail">${title}</h3>
			${message}
			<button onclick="modalManager.closeModal()">Volver</button>`;
		}
	}
}

ModalManagement.prototype.closeModal = function()
{
	//******PODEIS PERSONALIZAR COMO QUERAIS******//
	if(this.getModalStatus())
	{
		document.getElementById('mensajemodal').style.display = 'none';
		document.querySelector('.modal-content').innerHTML = null;
	}
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
	modalManager = new ModalManagement();
	fileManager = new FileManager();
	cvManager = new CanvasManager();

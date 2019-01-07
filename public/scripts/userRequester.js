function RegisterUser()
{
    let registerForm = document.querySelector('#registerUserForm');
    
    reqInterface.postRequestFETCH('/users/register', registerForm, checkResponse);
    function checkResponse(response)
    {
        response.json().then(function(responsejs)
		{
            console.log(responsejs);
            let messageSite = document.querySelector('#Messages');

            messageSite.innerHTML = `<div class="alert alert-success alertmodal alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>
            </button>
                <strong>Congrats!</strong> You have been registered as ${responsejs.user}
            </div>`;
		});
    }

    return false;
}
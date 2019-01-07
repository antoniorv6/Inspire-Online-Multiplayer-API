function RegisterUser()
{
    let registerForm = document.querySelector('#registerUserForm');
    
    reqInterface.postRequestFETCH('/users/register', registerForm, checkResponse);
    function checkResponse()
    {
        console.log('OK');
    }

    return false;
}
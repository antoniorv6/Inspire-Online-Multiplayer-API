function checkIfLoggedIn()
{
    if(sessionStorage.getItem('Token')!=null)
    {
        document.getElementById('userforms').innerHTML = `<ul class="nav navbar-nav navbar-right">
            <li class="dropdown dropdown-hover">
            <a href="#!" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                {{user}}<span class="label">welcome</span>
            </a>
            </li>
            <li>
            <button type="button" class="btn button-navbar btn-primary" onclick="Logout();">Logout</button>
            </li>
            </ul>
            </div>
            </div>
            </nav>`
    }
    else
    {
        document.getElementById('userforms').innerHTML = `<ul class="nav navbar-nav navbar-right">
        <li>
            <button type="button" class="btn button-navbar btn-primary" data-toggle="modal" data-target="#login">Login</button>
            <button type="button" class="btn button-navbar btn-primary" data-toggle="modal" data-target="#register">Register</button>
        </li>
        </ul>
        </div>
        </div>
        </nav>`
    }
}
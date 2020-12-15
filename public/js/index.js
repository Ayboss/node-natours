// import 'regenerator-runtime/runtime'
import {login, logout} from './login';
import {updateUser} from './updateSettings';
import {displayMap} from './mapbox';

const locations = document.getElementById('map');
if(locations){
    displayMap(JSON.parse(locations.dataset.locations));
}

console.log('bundle it is ');

const loginSubmit = document.querySelector('#submit');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateSubmit = document.querySelector('#updateUser');

if(loginSubmit){ 
    loginSubmit.addEventListener('click',function(e){
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // console.log(email, password);
        login(email,password);
    }); 
}

if(logoutBtn){
    logoutBtn.addEventListener('click',logout);
}

if(updateSubmit){
    updateSubmit.addEventListener('submit',function(e){
        console.log('ada');
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateUser(name,email)
    })
}
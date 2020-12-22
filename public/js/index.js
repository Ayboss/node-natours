// import 'regenerator-runtime/runtime'
import {login, logout} from './login';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';
import {displayMap} from './mapbox';

const locations = document.getElementById('map');
if(locations){
    displayMap(JSON.parse(locations.dataset.locations));
}

console.log('bundle it is ...');

const loginSubmit = document.querySelector('#submit');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateSubmit = document.querySelector('#updateUser');
const updatePassword = document.querySelector('#updatePassword');
const bookingBtn = document.getElementById('book-tour');


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
        e.preventDefault();
        const form = new FormData();
        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);
        updateSettings(form,'data');
    })
}

if(updatePassword){
    updatePassword.addEventListener('submit',async function(e){
        e.preventDefault();
        document.getElementById('savePasswordBtn').textContent = 'UPDATING ...';
        const password = document.getElementById('password').value;
        const newPassword = document.getElementById('newPassword').value;
        const newPasswordConfirm = document.getElementById('newPasswordConfirm').value;
        await updateSettings({password,newPassword,newPasswordConfirm},'password');
        document.getElementById('savePasswordBtn').textContent = 'SAVE PASSWORD';
        document.getElementById('password').value="";
        document.getElementById('newPassword').value="";
        document.getElementById('newPasswordConfirm').value="";

    });
}

if(bookingBtn){
    bookingBtn.addEventListener('click',function(e){
        e.target.textContent = 'Processing';
        bookTour(e.target.dataset.tourId);
        
    })
}






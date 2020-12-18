import axios from 'axios';
import {showAlert} from './alerts';

// function that update user when click
export const updateSettings = async (data,type)=>{
    
    const url = (type === 'password')? 'http://localhost:3000/api/v1/users/updatepassword':'http://localhost:3000/api/v1/users/updateme'; 
    try{
        const response = await axios({
            url,
            method: 'patch',
            data
        });
        if(response.data.status === 'success'){
            //send a success message
            console.log(response.data);
            showAlert('success',`${type.toUpperCase()} update succesfully`);
        }
    }catch(err){
        console.log('bad bad')
        showAlert('error',err.response.data.message)
    }
}
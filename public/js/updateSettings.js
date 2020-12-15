import axios from 'axios';
import {showAlert} from './alerts';

// function that update user when click
export const updateUser = async (name,email)=>{
    try{
        const response = await axios({
            url: 'http://localhost:3000/api/v1/users/updateme',
            method: 'patch',
            data:{name,email}
        });
        if(response.data.status === 'success'){
            //send a success message
            console.log(response.data);
            showAlert('success','update succesfully');
        }
    }catch(err){
        console.log('bad bad')
        showAlert('error',err.response.data.message)
    }
}
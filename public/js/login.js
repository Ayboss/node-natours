import axios from 'axios'; 
import {showAlert} from './alerts';

export const login = async (email,password)=>{
   try{
    const response = await axios({
        url:'/api/v1/users/login',
        method:'post',
        data:{email,password}
        })
        if(response.data.status === 'success'){
            //send a success message
            showAlert('success','Logged in succesfully');
            setTimeout(function(){
                location.assign('/')
            },1500)
        }
        //redirect
    }catch(err){
        showAlert('error',err.response.data.message)
    }    
}

export const logout = async ()=>{
    try{
        const response =  await axios({
            url:'/api/v1/users/logout',
            method: 'get'
        })
        if(response.data.status === 'success'){
            location.assign('/');
        }
    }catch(err){
        showAlert('error','error logging out');
    }
}


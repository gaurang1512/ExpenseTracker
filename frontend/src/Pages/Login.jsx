import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import { handleError, handleSucess } from '../utils';


function Login() {
    const[loginInfo , setLoginInfo] =useState({
        email:'',
        password:''
    })

    const navigate = useNavigate();

    const handleLogin = async (e)=>{
        e.preventDefault();
        const{ email,password} =loginInfo;
        if(!email){
            return handleError('email is required ');
        }
        else if(!password){
            return handleError('password is required ');
        }

        //Calling API  and server side validation
        try {
            const url = "http://localhost:8080/auth/login";  
            const response = await fetch(url,{
                method: "POST",                                 //Sends a signup request (POST) to http://localhost:8080/auth/signup.
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(loginInfo)                // Sends user data (SignupInfo) in JSON format.
            });
            const result = await response.json();               //Receives a response from the backend.
            const {success , message, jwtToken,name , error, _id} = result;
            if(success){                                        //Checks if signup was successful (success is true).
                handleSucess(message);                          //Shows a success message (handleSuccess(message)).
                
                localStorage.setItem('token' , jwtToken);
                localStorage.setItem('loggedInUser',name);
                localStorage.setItem('user_id',_id);
                setTimeout(()=>{
                    navigate('/navigation')                          //Waits 1 second and redirects to the login page (navigate('/login')).
                } ,1000)
            }else if(error){                                    //Server side validation
                const details = error?.details[0].message;      //go to console=>error=>details=>on 0th position error msg will appear from server
                handleError(details);                           //Calling toast function and showing error msg
            }else if(!success){
                handleError(message);
            }
            console.log(result)
        } catch (err) {                                            //If an error occurs, calls handleError(err). */
            handleError(err);
        }
    }

    const handleChange =(e)=>{
        const {name , value} = e.target;
        console.log(name,value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }
    console.log('LoginInfo ->' ,loginInfo)

  return (
    <div className='main-login-container'>
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="email">Email : </label>
                <input
                    onChange={handleChange}
                    type="email"
                    name='email'
                    placeholder='Enetr your Email'
                    value={loginInfo.email}  />
            </div>
            <div>
                <label htmlFor="password">Password : </label>
                <input 
                    onChange={handleChange}
                    type="password"
                    name='password'
                    placeholder='Enetr your Password'
                    value={loginInfo.password}  />
            </div>
            <button type='submit'>Login</button>
            <span>Don't have an account?
                <Link to="/signup">SignUp</Link>
            </span>
        </form>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Login

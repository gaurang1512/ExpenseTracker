import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import {handleError, handleSucess} from '../utils'
function Signup() {
    const[SingupInfo,setSingupInfo] = useState({
        name:'',
        email:'',
        password:''
    })
    const navigate = useNavigate();

    const handleSignup= async (e)=>{
        e.preventDefault();
        const{name,email,password}=SingupInfo;
        if(!name){
            return handleError('Name is required!!!');
        }
        if(!email){
            return handleError('email is required ');
        }
        if(!password){
            return handleError('password is required ');
        }

        //Calling API and server side validation
        try {
            const url="http://localhost:8080/auth/signup";
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(SingupInfo)
            });
            const result = await response.json();
            const {success,message,error} = result;
            if(success){
                handleSucess(message);
                setTimeout(()=>{
                    navigate('/login')
                },1000)
            }else if(error){
                const details = error?.details[0].message;
                handleError(details);
            }else if(!success){
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }
    const handleChange =(e)=>{
        const {name , value} = e.target;
        console.log(name,value);
        const copySignInfo = { ...SingupInfo };
        copySignInfo[name] = value;
        setSingupInfo(copySignInfo);
    }
    console.log('LoginInfo ->' ,SingupInfo)

  return (
    <div className='main-login-container'>
      <div className='container'>
        <h1>SignUp</h1>
        <form onSubmit={handleSignup}>
            <div>
                <label htmlFor="name">Name :</label>
                <input 
                type="text"
                name='name'
                onChange={handleChange}
                autoFocus
                placeholder='Enter username'
                value={SingupInfo.name} />
            </div>
            <div>
                <label htmlFor="name">Email :</label>
                <input 
                type="email"
                name='email'
                onChange={handleChange}
                placeholder='Enter email'
                value={SingupInfo.email} />
            </div>
            <div>
                <label htmlFor="password">Password : </label>
                <input 
                    onChange={handleChange}
                    type="password"
                    name='password'
                    placeholder='Enetr your Password'
                    value={SingupInfo.password}  />
            </div>
            <button type='submit'>Signup</button>
            <span>Already have an account ?
                <Link to='/login'>Login</Link>
            </span>
        </form>
        <ToastContainer/>
      </div>
    </div>
  )
}

export default Signup

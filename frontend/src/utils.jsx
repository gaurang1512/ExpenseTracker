import {toast} from 'react-toastify';

export const handleSucess=(msg)=>{
    toast.success(msg,{
        position : 'top-right'
    })
}

export const handleError=(msg)=>{
    toast.error(msg,{
        position : 'top-right'
    })
}

//export const APIUrl = ProcessingInstruction.env.REACT_APP_URL || 'http://localhost:8080';
import { Route, Router, Routes } from "react-router";
import Register from "./Register";
import Login from "./Login";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";



const Auth = ({type}) => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const {user} = useSelector(state => state.auth)
   

    return (
        <div className="auth-container">
            {type == "register" ? 
            <Register password={password} email={email} setPassword={setPassword} setEmail={setEmail}/> : 
            <Login password={password} email={email} setPassword={setPassword} setEmail={setEmail}/>}
        </div>
    );
};

export default Auth;
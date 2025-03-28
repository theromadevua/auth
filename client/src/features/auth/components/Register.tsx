import { NavLink, useNavigate } from "react-router";
import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../../../store/store";
import useAuthForm from "../hooks/useAuthForm";

const Register = () => {
    const { isAuth } = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const {password, email, setEmail, setPassword, sendFormData, handleEmailInput, handlePasswordInput} = useAuthForm()

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    return (
        <div className="inputs-container">
            <h1>Register</h1>
            <input placeholder="email" 
                value={email} 
                type="email" 
                onChange={handleEmailInput}/>
            <input 
                placeholder="password" 
                value={password} 
                type="password" 
                onChange={handlePasswordInput}/>
            <button className="inputs-container__button" onClick={sendFormData}>
                Send
            </button>
            <p className="inputs-container__link"><NavLink to={"/login"}>
                login
            </NavLink></p>
            <p className="inputs-container__link"><NavLink to={"/reset-password-request"}>
                forgot password?
            </NavLink></p>
        </div>
    );
};

export default Register;
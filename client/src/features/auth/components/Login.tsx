import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "../../../store/store";
import useAuthForm from "../hooks/useAuthForm";

const Register = () => {
    const { isAuth } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const {sendFormData, password, email, handleEmailInput, handlePasswordInput} = useAuthForm()

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    return (
        <div className="inputs-container">
            <h1>Login</h1>
            <input 
                placeholder="email" 
                value={email} 
                type="email" 
                onChange={handleEmailInput} />
            <input 
                placeholder="password" 
                value={password} type="password" 
                onChange={handlePasswordInput}/>
            <button className="inputs-container__button" onClick={sendFormData}>
                Send
            </button>
            <p className="inputs-container__link"><NavLink to={"/register"}>
                register
            </NavLink></p>
            <p className="inputs-container__link"><NavLink to={"/reset-password-request"}>
                forgot password?
            </NavLink></p>
        </div>
    );
};

export default Register;
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../../store/AuthSlice";
import { useEffect } from "react";

const Register = ({ password, email, setEmail, setPassword }) => {
    const dispatch = useDispatch();
    const { isAuth } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    return (
        <div className="inputs-container">
            <h1>Login</h1>
            <input placeholder="email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            <button className="inputs-container_button" onClick={() => dispatch(loginUser({ password, email }))}>Send</button>
            <p className="inputs-container__link"><NavLink to={"/register"}>register</NavLink></p>
        </div>
    );
};

export default Register;
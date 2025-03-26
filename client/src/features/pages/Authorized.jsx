import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/AuthSlice";

const Authorized = () => {
    const dispatch = useDispatch()

    return (
        <div className="auth-container">
            <h1 className="auth-container__title">You are already logged in!</h1>
            <button className="main-container__logout-button" onClick={() => dispatch(logoutUser())}>
                logout
            </button>
        </div>
    );
};

export default Authorized;
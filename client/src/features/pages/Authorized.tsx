import { logoutUser } from "../../store/AuthThunks";
import { useAppDispatch } from "../../store/store";

const Authorized = () => {
    const dispatch = useAppDispatch()

    const logout = () => {
        dispatch(logoutUser())
    }

    return (
        <div className="auth-container">
            <h1 className="auth-container__title">
                You are already logged in!
            </h1>
            <button className="main-container__logout-button" onClick={logout}>
                logout
            </button>
        </div>
    );
};

export default Authorized;
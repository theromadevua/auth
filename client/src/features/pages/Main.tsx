import { NavLink } from "react-router";

const Main = () => {
    return (
        <div className="main-container">
            <div className="main-content">
                <h1>Welcome</h1>
                <div className="main-content__buttons">
                    <NavLink to={"/login"}>
                        <button>Sign in</button>
                    </NavLink>
                    <NavLink to={"/register"}>
                        <button>Sign up</button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Main;
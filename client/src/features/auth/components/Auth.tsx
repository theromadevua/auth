import Register from "./Register";
import Login from "./Login";
import useAuthForm from "../hooks/useAuthForm";
import { useEffect } from "react";
import PassReset from "./PassReset";
import PassResetRequest from "./PassResetRequest";

const Auth = ({ type }: { type: "register" | "login" | "reset" | "reset-request" }) => {
    const {type: reqType} = useAuthForm()

    useEffect(() => {
        reqType.current = type
    }, [])

    return (
        <div className="auth-container">
            {type === "register" && <Register/>}
            {type === "reset" && <PassReset/>}
            {type === "reset-request" && <PassResetRequest/>}
            {type === "login" && <Login/>}
        </div>
    );
};

export default Auth;
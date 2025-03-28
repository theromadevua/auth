import { useState } from "react";
import useAuthForm from "../hooks/useAuthForm";

const PassResetRequest = () => {
    const {resetPasswordRequest} = useAuthForm()
    const [email, setEmail] = useState<string>('')

    return (
        <div className="inputs-container">
            <input type="text" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Enter your email" />
            <button className="inputs-container__button" onClick={() => resetPasswordRequest(email)}>Send Password Reset Link</button>
        </div>
    );
};

export default PassResetRequest;
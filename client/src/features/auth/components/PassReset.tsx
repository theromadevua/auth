import { useState } from "react";
import { useAppDispatch } from "../../../store/store";
import { resetPassword } from "../../../store/AuthThunks";
import { useParams } from "react-router";

const PassReset = () => {
    const {id} = useParams()
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const dispatch = useAppDispatch();
    
    const sendResetPassword = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if(!id?.split('.')[2]) {
            alert("No token provided")
        }

        dispatch(resetPassword({password: newPassword, token: id || ''}))
    }
    
    return (
        <div className="inputs-container">
            <h1>Reset password</h1>
            <input 
                placeholder="new password" 
                value={newPassword} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setNewPassword(e.target.value)}}/>
            <input 
                placeholder="confirm password" 
                value={confirmPassword} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setConfirmPassword(e.target.value)}}/>
            <button className="inputs-container__button" onClick={sendResetPassword}>Send</button>
        </div>
    );
};

export default PassReset;
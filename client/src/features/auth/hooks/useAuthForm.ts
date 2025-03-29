import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../store/store";
import { loginUser, registerUser, resetPasswordRequest as resetPasswordRequestThunk } from "../../../store/AuthThunks";

interface UseAuthFormType {
    type: React.MutableRefObject<string>;
    email: string;
    password: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    sendFormData: () => void;
    handleEmailInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetPasswordRequest: (email: string) => void;
}

const useAuthForm = (): UseAuthFormType => {
    const { isAuth } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>('gogi@gogi.com');
    const [password, setPassword] = useState<string>('123456');
    const type = useRef<string>("login");

    const sendFormData = useCallback(() => {
        {type.current === "login" ? dispatch(loginUser({ password, email })) : dispatch(registerUser({ password, email }))}
    }, [password, email, dispatch, type]);

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const resetPasswordRequest = (email: string) => {
        dispatch(resetPasswordRequestThunk(email))
    }

    const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    return {
        type,
        email,
        password,
        setEmail,
        setPassword,
        sendFormData,
        handleEmailInput,
        handlePasswordInput,
        resetPasswordRequest,
    };
};

export default useAuthForm;

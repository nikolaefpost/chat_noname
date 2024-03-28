import React from "react";
import {auth, googleAuthProvider} from "../firebase.ts";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import {IAuth} from "../types";

import styles from "./component.module.scss";

const cookies = new Cookies();

const Auth: React.FC<IAuth > = ({ setIsAuth }) => {
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            cookies.set("auth-token", result.user.refreshToken);
            console.log(result.user)
            setIsAuth(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.auth}>
            <p> Sign In With Google To Continue </p>
            <button onClick={signInWithGoogle}> Sign In With Google</button>
        </div>
    );
};

export default Auth;
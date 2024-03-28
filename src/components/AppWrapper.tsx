import React from 'react';
import {auth} from "../firebase.ts";
import {signOut} from "firebase/auth";
import Cookies from "universal-cookie";

import styles from "./component.module.scss"
import {IAppWrapper} from "../types";

const cookies = new Cookies();

const AppWrapper: React.FC<IAppWrapper> = ({children, isAuth, setIsAuth, setIsInChat}) => {

    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove("auth-token");
        setIsAuth(false);
        setIsInChat(false);
    };
    console.log(auth.currentUser)
    return (
        <div className={styles.app}>
            <div className={styles.app_header}>
                <h1>Chat App</h1>
                {isAuth && (
                    <div className={styles.sign_out}>
                        <span>{auth.currentUser?.displayName}</span>
                        {auth.currentUser?.photoURL && <img alt="photo" src={auth.currentUser.photoURL}/>}
                        <button onClick={signUserOut}> Sign Out</button>
                    </div>
                )}
            </div>
            <div className={styles.app_container}>{children}</div>
        </div>
    );
};

export default AppWrapper;
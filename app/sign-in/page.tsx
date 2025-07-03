'use client'

import styles from "./page.module.css"

export default function Login() {
        return (
                <div className={styles.login_container}>
                        <a href="/api/auth/sign-in">
                                Sign In
                        </a>
                        <a href="/api/auth/sign-up">
                                Sign Up
                        </a>
                </div>
        )
}


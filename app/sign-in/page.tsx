"use client";

import { Button } from "@heroui/react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Login() {
    return (
        <div className={styles.login_container}>
            <div className={styles.inner_container}>
                <div>
                    <h1>Welcome!</h1>
                    <p>Please sign up to use Prompt Studio.</p>
                </div>
                <Button as={Link} href="/api/auth/sign-in" className={styles.button}>
                    Sign In
                </Button>
                <Button as={Link} href="/api/auth/sign-up" className={styles.button}>
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

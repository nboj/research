"use client"

import configureAmplify from "@/configure-amplify";
import { createContext, useState } from "react";

export const AuthContext = createContext<any>({});

configureAmplify()

type Props = Readonly<{
  children: React.ReactNode
}>
export default function Providers({children}: Props) {
  const [authState, setAuthState] = useState();
  return (
    <AuthContext.Provider value={{authState, setAuthState}}>
      {children}
    </AuthContext.Provider>
  )
}

import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase.config'
import axios from 'axios'

const AuthContext = createContext(null)
const API = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const registerWithEmail = async (name, email, password, photoURL) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name, photoURL })
    await axios.post(
      `${API}/api/auth/register`,
      { name, email, photoURL },
      { withCredentials: true }
    )
    return cred
  }

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await axios.post(
      `${API}/api/auth/login`,
      { email },
      { withCredentials: true }
    )
    return cred
  }

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    const { displayName: name, email, photoURL } = cred.user
    await axios.post(
      `${API}/api/auth/google`,
      { name, email, photoURL },
      { withCredentials: true }
    )
    return cred
  }

  const logout = async () => {
    await signOut(auth)
    await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true })
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const value = {
    user,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

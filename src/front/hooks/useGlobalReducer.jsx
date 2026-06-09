// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.
import { useNavigate } from "react-router-dom";

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())

    useEffect(() => {
        checkCurrentUser()
    }, [])

    useEffect(() => {
        getProfile()
    }, [store?.token])


    const checkCurrentUser = () => {
        if (localStorage.getItem('token')) {
            dispatch({ type: "set_token", payload: (localStorage.getItem('token')) })
            dispatch({ type: "set_user", payload: JSON.parse(localStorage.getItem('user')) })
            dispatch({ type: "set_profile", payload: JSON.parse(localStorage.getItem('profile')) })
        }

    }

    const getProfile = async () => {
        const token = store.token
        if (!token) return
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (resp.status === 401 || resp.status === 422) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                localStorage.removeItem('profile')
                dispatch({ type: "set_token", payload: null })
                dispatch({ type: "set_user", payload: null })
                dispatch({ type: "set_profile", payload: null })
            }
        } catch (err) {
            console.error('No se pudo verificar la sesión:', err)
        }
    }


    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}
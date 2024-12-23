import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    SET_MESSAGE, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAIL,
} from "./types";
import AuthService from "../services/auth.service";

export const register = (username, email, password) => (dispatch) => {
    return AuthService.register(username, email, password).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS
            })

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message
            })
            return Promise.resolve();
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

            dispatch({type: REGISTER_FAIL})

            dispatch({type: SET_MESSAGE, payload: message})
            return Promise.reject();
        }
    )
}

export const login = (email, password) => (dispatch) => {
    return AuthService.login(email, password).then(
        (response) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {user: response}
            })
            return Promise.resolve(response);// Trả về response để có thể dùng trong component
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            dispatch({type: LOGIN_FAIL})
            dispatch({type: SET_MESSAGE, payload: message})
            return Promise.reject(error); // Trả về error để có thể dùng trong component
        }
    )
}

export const loginWithGoogle = (idToken) => (dispatch) => {
    return AuthService.loginWithGoogle(idToken).then(
        (response) => {
            dispatch({
                type: LOGIN_GOOGLE_SUCCESS,
                payload: {user: response}
            })
            return Promise.resolve(response);
        },
        (error) => {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            dispatch({type: LOGIN_GOOGLE_FAIL})
            dispatch({type: SET_MESSAGE, payload: message})
            return Promise.reject(error);
        }
    )
}

export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
        type: LOGOUT
    });
}
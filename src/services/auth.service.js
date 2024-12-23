import axios from "axios";
import apiUrl from "../config";
const register = (username, email, password) => {
    return axios.post(apiUrl + "/api/auth/signup", {
        username,
        email,
        password,
    });
};

const login = async (email, password) => {
    try {
        const response = await axios.post(apiUrl + "/api/auth/signin", {email, password});
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.accessToken);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};


const loginWithGoogle = (idToken) => {
    return axios.post(apiUrl + "/api/auth/google/signin", {idToken}).then((response) => {
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.accessToken);
        }
        return response.data;
    })
}

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

export default {
    register,
    login,
    logout,
    loginWithGoogle
};
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(API_URL + "signin", {email, password})
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.accessToken);
            }
            return response.data;
        });
};

const loginWithGoogle = (idToken) => {
    return axios.post(API_URL + "google/signin", {idToken}).then((response) => {
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.accessToken);
        }
        console.log(response.data)
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
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getPublicContent = () => {
    return axios.get(API_URL + "all");
}

const getUserBoard = () => {
    return axios.get(API_URL + "user", {headers: authHeader()})
}

const getAdminBoard = () => {
    return axios.get(API_URL + "admin", {headers: authHeader()})
}

// const addStoryGenre = (storyGenreName, description) => {
//     return axios.post(API_URL + "admin/addStoryGenre", {headers: authHeader()}, {
//         storyGenreName,
//         description,
//     });
// };

export default {
    getPublicContent, getAdminBoard, getUserBoard
}
import {combineReducers} from "redux";
import auth from "./auth"
import message from "./message";
import genreReducer from "./genreReducer";

export default combineReducers({
    auth,
    message,
    genre: genreReducer,
})
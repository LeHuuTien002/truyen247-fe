import UserService from "../services/user.service";
import {ADD_STORY_GENRE_FAIL, ADD_STORY_GENRE_SUCCESS} from "./types";

export const addStoryGenre = (storyGenreName, description) => (dispatch) => {
    return UserService.addStoryGenre(storyGenreName, description).then(
        (response) => {
            dispatch({
                type: ADD_STORY_GENRE_SUCCESS,
                payload: { storyGenre: response.data },
            });
            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: ADD_STORY_GENRE_FAIL,
            });
            return Promise.reject();
        }
    );
};
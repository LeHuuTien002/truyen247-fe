import {ADD_STORY_GENRE_SUCCESS, ADD_STORY_GENRE_FAIL} from "../actions/types";

const initialState = {
    genres: [],
    error: null,
};

const genreReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case ADD_STORY_GENRE_SUCCESS:
            return {
                ...state,
                genres: [...state.genres, payload.storyGenre], // Thêm thể loại truyện mới vào mảng
                error: null,
            };

        case ADD_STORY_GENRE_FAIL:
            return {
                ...state,
                error: "Thêm thể loại truyện thất bại!",
            };

        default:
            return state;
    }
};

export default genreReducer;

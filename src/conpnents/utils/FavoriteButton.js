import React, { useState } from "react";
import { addFavorite, removeFavorite } from "./api"; // Import API functions

const FavoriteButton = ({ userId, comicId, initialIsFavorite }) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                await removeFavorite(userId, comicId); // Gửi yêu cầu xóa yêu thích
            } else {
                await addFavorite(userId, comicId); // Gửi yêu cầu thêm yêu thích
            }
            setIsFavorite(!isFavorite); // Đảo trạng thái yêu thích
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleFavoriteClick}
            className={`btn ${isFavorite ? "btn-outline-warning" : "btn-warning"} d-block mt-3`}
        >
            <i className="bi bi-heart"></i> {isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
        </button>
    );
};

export default FavoriteButton;

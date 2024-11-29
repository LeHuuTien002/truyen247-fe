import {useEffect} from 'react';
import {checkHistoryExists, createHistory, updateHistory} from "../../services/historyService";

const useHistoryHandler = ({userId, comicId, chapterId, token}) => {
    useEffect(() => {
        const handleHistory = async () => {
            try {
                const historyExists = await checkHistoryExists(userId, comicId, token);
                const historyData = {userId, comicId, chapterId};

                if (historyExists) {
                    // Nếu lịch sử đã tồn tại, cập nhật
                    await updateHistory(historyData, token);
                    console.log('Lịch sử đã được cập nhật.');
                } else {
                    // Nếu chưa tồn tại, tạo mới
                    await createHistory(historyData, token);
                    console.log('Lịch sử mới đã được tạo.');
                }
            } catch (error) {
                console.error('Lỗi khi xử lý lịch sử:', error.message);
            }
        };

        if (userId && comicId && chapterId) {
            handleHistory();
        }
    }, [userId, comicId, chapterId]);
};

export default useHistoryHandler;

import {useEffect} from 'react';
import {checkHistoryExists, createHistory, updateHistory} from "../../services/historyService";

const useHistoryHandler = ({userId, comicId, chapterId, token}) => {
    useEffect(() => {
        const handleHistory = async () => {
            try {
                const historyExists = await checkHistoryExists(userId, comicId, token);
                const historyData = {userId, comicId, chapterId};

                if (historyExists) {
                    await updateHistory(historyData, token);
                    console.log('Lịch sử đã được cập nhật.');
                } else {
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

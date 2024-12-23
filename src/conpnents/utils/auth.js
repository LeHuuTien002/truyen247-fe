export const getUserId = () => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
            const userObject = JSON.parse(userString);
            return userObject.id;
        }
        return null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
};

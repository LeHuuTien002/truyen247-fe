import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const AdminRoute = () => {
    // Lấy thông tin người dùng hiện tại từ Redux store
    const {user: currentUser} = useSelector((state) => state.auth);

    // Kiểm tra nếu người dùng đã đăng nhập và có vai trò ADMIN
    if (currentUser && currentUser.roles.includes('ROLE_ADMIN')) {

        return <Outlet/>; // Cho phép truy cập vào các route con của AdminRoute
    } else {
        // Nếu không có vai trò ADMIN, chuyển hướng về trang chủ
        return <Navigate to="/"/>;
    }
}

export default AdminRoute;
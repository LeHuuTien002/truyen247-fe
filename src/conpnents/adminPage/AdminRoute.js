import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const AdminRoute = () => {
    const {user: currentUser} = useSelector((state) => state.auth);

    if (currentUser && currentUser.roles.includes('ROLE_ADMIN')) {

        return <Outlet/>;
    } else {
        return <Navigate to="/"/>;
    }
}

export default AdminRoute;
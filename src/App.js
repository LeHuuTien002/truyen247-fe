import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./conpnents/layout/Layout";
import Home from "./conpnents/userPage/Home";
import RegisterForm from "./conpnents/RegisterForm";
import LoginForm from "./conpnents/LoginForm";
import History from "./conpnents/userPage/History";
import ComicDetail from "./conpnents/userPage/ComicDetail";
import ForgotPassword from "./conpnents/ForgotPassword";
import AdminRoute from "./conpnents/adminPage/AdminRoute";
import LayoutAdmin from "./conpnents/layout/LayoutAdmin";
import Comics from "./conpnents/adminPage/Comics";
import Genres from "./conpnents/adminPage/Genres";
import Chapters from "./conpnents/adminPage/Chapters";
import Pages from "./conpnents/adminPage/Pages";
import ReadPages from "./conpnents/userPage/ReadPages";
import Favorites from "./conpnents/userPage/Favorites";
import UserGenres from "./conpnents/userPage/UserGenres";
import SearchResults from "./conpnents/userPage/SearchResults";
import Profile from "./conpnents/userPage/Profile";
import Users from "./conpnents/adminPage/Users";
import Premium from "./conpnents/userPage/Premium";
import Payment from "./conpnents/adminPage/Payment";
import ChangePassword from "./conpnents/userPage/ChangePassword";
import ResetPassword from "./conpnents/ResetPassword";
import QRPayment from "./conpnents/adminPage/QRPayment";

function App() {
    return (
        <div className="bg-secondary">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="register" element={<RegisterForm/>}/>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="history" element={<History/>}/>
                    <Route path="comics/:comicId" element={<ComicDetail/>}/>
                    <Route path='favorites' element={<Favorites/>}/>
                    <Route path="forgot-password" element={<ForgotPassword/>}/>
                    <Route path="reset-password" element={<ResetPassword/>}/>
                    <Route path="genres" element={<UserGenres/>}/>
                    <Route path="search/:searchTerm" element={<SearchResults/>}/>
                    <Route path="genre/:genreName" element={<UserGenres/>}/>
                    <Route path='profile' element={<Profile/>}/>
                    <Route path='change-password' element={<ChangePassword/>}/>
                    <Route path='premium' element={<Premium/>}/>
                </Route>

                <Route path="/comics/:comicId/chapters/:chapterId/pages" element={<ReadPages/>}/>

                <Route path="/admin/" element={<LayoutAdmin/>}>
                    <Route element={<AdminRoute/>}>
                        <Route path="genres" element={<Genres/>}/>
                        <Route index path="comics" element={<Comics/>}/>
                        <Route path="comics/:comicId/chapters" element={<Chapters/>}/>
                        <Route path="comics/:comicId/chapters/:chapterId/pages" element={<Pages/>}/>
                        <Route path="users" element={<Users/>}/>
                        <Route path="payments" element={<Payment/>}/>
                        <Route path="QRpayment" element={<QRPayment/>}/>
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;

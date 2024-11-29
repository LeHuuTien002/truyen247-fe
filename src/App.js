import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./conpnents/layout/Layout";
import Home from "./conpnents/userPage/Home";
import RegisterForm from "./conpnents/RegisterForm";
import LoginForm from "./conpnents/LoginForm";
import History from "./conpnents/userPage/History";
import ComicDetail from "./conpnents/userPage/ComicDetail";
import RePassword from "./conpnents/RePassword";
import AdminRoute from "./conpnents/adminPage/AdminRoute";
import LayoutAdmin from "./conpnents/layout/LayoutAdmin";
import Comics from "./conpnents/adminPage/Comics";
import Genres from "./conpnents/adminPage/Genres";
import Chapters from "./conpnents/adminPage/Chapters";
import Pages from "./conpnents/adminPage/Pages";
import ReadPages from "./conpnents/userPage/ReadPages";
import Favorites from "./conpnents/userPage/Favorites";
import Demo from "./demo/Demo";
import UserGenres from "./conpnents/userPage/UserGenres";
import SearchResults from "./conpnents/userPage/SearchResults";
import Profile from "./conpnents/userPage/Profile";
import Users from "./conpnents/adminPage/Users";
import Premium from "./conpnents/userPage/Premium";
import Payment from "./conpnents/adminPage/Payment";

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
                    <Route path="repassword" element={<RePassword/>}/>
                    <Route path="genres" element={<UserGenres/>}/>
                    <Route path="search/:searchTerm" element={<SearchResults/>}/>
                    <Route path="genre/:genreName" element={<UserGenres/>}/>
                    <Route path='profile' element={<Profile/>}/>
                    <Route path='premium' element={<Premium/>}/>
                    <Route path="demo" element={<Demo/>}/>
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
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;

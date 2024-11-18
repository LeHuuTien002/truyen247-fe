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
import Demo from "./conpnents/userPage/ChapterSelector";
import Favorites from "./conpnents/userPage/Favorites";

function App() {
    return (
        <div className="bg-secondary">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="register" element={<RegisterForm/>}/>
                    <Route path="login" element={<LoginForm/>}/>
                    <Route path="history" element={<History/>}/>
                    <Route path=":comicId/comicDetail" element={<ComicDetail/>}/>
                    <Route path='favorites' element={<Favorites/>}/>
                    <Route path='demo' element={<Demo/>}/>
                    <Route path="repassword" element={<RePassword/>}/>
                </Route>
                <Route path=":comicId/comicDetail/chapter/:chapterId/pages" element={<ReadPages/>}/>
                <Route path="/" element={<LayoutAdmin/>}>
                    <Route element={<AdminRoute/>}>
                        <Route path="admin" element={<Genres/>}/>
                        <Route path="comic-list" element={<Comics/>}/>
                        <Route path="comics/:id/chapters" element={<Chapters/>}/>
                        <Route path="comics/:id/chapters/:id/pages" element={<Pages/>}/>
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;

import './styles/App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./conpnents/layout/Layout";
import HomePage from "./pages/userPage/HomePage";
import RegisterPage from "./pages/userPage/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/userPage/HistoryPage";
import ComicDetailPage from "./pages/userPage/ComicDetailPage";
import ForgotPassword from "./conpnents/ForgotPassword";
import AdminRoute from "./utils/AdminRoute";
import LayoutAdmin from "./conpnents/layout/LayoutAdmin";
import ComicPage from "./pages/adminPage/ComicPage";
import GenreAdminPage from "./pages/adminPage/GenreAdminPage";
import ChapterPage from "./pages/adminPage/ChapterPage";
import PagePage from "./pages/adminPage/PagePage";
import ReadPage from "./pages/userPage/ReadPage";
import FavoritePage from "./pages/userPage/FavoritePage";
import GenrePage from "./pages/userPage/GenrePage";
import SearchResultPage from "./pages/userPage/SearchResultPage";
import ProfilePage from "./pages/userPage/ProfilePage";
import UserPage from "./pages/adminPage/UserPage";
import PremiumPage from "./pages/userPage/PremiumPage";
import PaymentPage from "./pages/adminPage/PaymentPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ResetPage from "./pages/ResetPage";
import QRPaymentPage from "./pages/adminPage/QRPaymentPage";

function App() {
    return (
        <div className="bg-secondary">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="register" element={<RegisterPage/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="history" element={<HistoryPage/>}/>
                    <Route path="comics/:comicId" element={<ComicDetailPage/>}/>
                    <Route path='favorites' element={<FavoritePage/>}/>
                    <Route path="forgot-password" element={<ForgotPassword/>}/>
                    <Route path="reset-password" element={<ResetPage/>}/>
                    <Route path="genres" element={<GenrePage/>}/>
                    <Route path="search/:searchTerm" element={<SearchResultPage/>}/>
                    <Route path="genre/:genreName" element={<GenrePage/>}/>
                    <Route path='profile' element={<ProfilePage/>}/>
                    <Route path='change-password' element={<ChangePasswordPage/>}/>
                    <Route path='premium' element={<PremiumPage/>}/>
                </Route>

                <Route path="/comics/:comicId/chapters/:chapterId/pages" element={<ReadPage/>}/>

                <Route path="/admin/" element={<LayoutAdmin/>}>
                    <Route element={<AdminRoute/>}>
                        <Route path="genres" element={<GenreAdminPage/>}/>
                        <Route index path="comics" element={<ComicPage/>}/>
                        <Route path="comics/:comicId/chapters" element={<ChapterPage/>}/>
                        <Route path="comics/:comicId/chapters/:chapterId/pages" element={<PagePage/>}/>
                        <Route path="users" element={<UserPage/>}/>
                        <Route path="payments" element={<PaymentPage/>}/>
                        <Route path="QRpayment" element={<QRPaymentPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;

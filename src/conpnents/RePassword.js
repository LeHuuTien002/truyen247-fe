import {Link} from "react-router-dom";

const RePassword = () => {
    return (
        <div className="container bg-dark p-5">
            <span> <Link to="/" className="text-decoration-none">Trang chủ </Link>
                <i className="bi bi-chevron-double-right"></i>
                <span className="text-warning"> Quên mật khẩu</span>
            </span>
            <form className="container p-4">
                <h2 className="text-warning text-center">Quên mật khẩu</h2>
                <div className="mt-3">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"/>
                </div>
                <div className="row mt-3">
                    <div className="col col-sm col-md col-lg">
                        <input type="email" readOnly className="form-control text-center" id="email"
                               value="Z637"
                               name="email"/>
                    </div>
                    <div className="col-1 col-sm-1 col-md-1 col-lg-1">
                        <button type="button" className="btn btn-outline-warning"><i
                            className="bi bi-arrow-clockwise"></i></button>
                    </div>
                    <div className="col col-sm col-md col-lg">
                        <input type="email" className="form-control" id="email" placeholder="Nhập Capcha" name="email"/>
                    </div>
                </div>
                <button type="submit" className="btn btn-outline-warning form-control mt-3">Gửi</button>
            </form>
        </div>
    )
}

export default RePassword;
import React from 'react';

const HoverMenu = () => {
    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <ul className="navbar-nav">
                    {/* Thể loại 1 */}
                    <li className="nav-item dropdown">
                        <a
                            href="#"
                            className="nav-link dropdown-toggle"
                            id="category1"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Thể loại 1
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="category1">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 1.1
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 1.2
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 1.3
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Thể loại 2 */}
                    <li className="nav-item dropdown">
                        <a
                            href="#"
                            className="nav-link dropdown-toggle"
                            id="category2"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Thể loại 2
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="category2">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 2.1
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 2.2
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Thể loại 3 */}
                    <li className="nav-item dropdown">
                        <a
                            href="#"
                            className="nav-link dropdown-toggle"
                            id="category3"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Thể loại 3
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="category3">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 3.1
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 3.2
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Thể loại con 3.3
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default HoverMenu;

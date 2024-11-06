import React from "react";
import Home from "./Home";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Register from "./Register";
import Create from "./Create";
import BookRead from "./BookRead";
import BookCollection from "./BookCollection";
import Login from "./Login";

function Header(){
    return (
        <BrowserRouter>

            {/* <Home /> */}

            <Routes>
                <Route path="/" element={<Home />} ></Route>
                <Route path="/login" element={<Login />} ></Route>
                <Route path="/register" element={<Register />} ></Route>
                <Route path="/create" element={<Create />} ></Route>
                <Route path="/read" element={<BookRead />} ></Route>
                <Route path="/collection" element={<BookCollection />} ></Route>
            </Routes>
        </BrowserRouter>
        
    )
}

export default Header;
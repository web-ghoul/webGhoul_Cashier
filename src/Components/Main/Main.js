//Libraries
import React from 'react';
import { Outlet } from "react-router-dom";

//Components
import Header from "../Header/Header"

//Styles Files
import './Main.css';

const Main = () => {
    return (
        <main>
            <div className="main-container">
                <Header />
                <Outlet />
            </div>
        </main>
    );
}
export default Main;

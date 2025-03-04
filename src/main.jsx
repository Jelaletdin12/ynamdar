import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.module.scss";


ReactDOM.createRoot(document.getElementById("root")).render(
 
    <BrowserRouter>
        <App />
    </BrowserRouter>

);

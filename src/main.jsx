import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./router/index.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AppRouter />
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

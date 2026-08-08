import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { AdminThemeProvider } from "./context/AdminThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <StoreProvider>
              <HashRouter>
                <AdminThemeProvider>
                  <App />
                </AdminThemeProvider>
              </HashRouter>
            </StoreProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>
);

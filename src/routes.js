import { lazy } from "react";

/**
 * تنها منبع تعریف صفحات lazy — هم App.jsx و هم prefetch.js از همین استفاده می‌کنند.
 */
export const routeLoaders = {
  "/": () => import("./pages/HomePage.jsx"),
  "/products": () => import("./pages/ProductsPage.jsx"),
  "/category/:slug/:subslug": () => import("./pages/CategoryPage.jsx"),
  "/category/:slug": () => import("./pages/CategoryPage.jsx"),
  "/category": () => import("./pages/CategoryPage.jsx"),
  "/product/:slug": () => import("./pages/ProductDetailsPage.jsx"),
  "/brands/:slug": () => import("./pages/BrandPage.jsx"),
  "/brands": () => import("./pages/BrandsPage.jsx"),
  "/about": () => import("./pages/AboutPage.jsx"),
  "/contact": () => import("./pages/ContactPage.jsx"),
  "/login": () => import("./pages/AuthPage.jsx"),
  "/register": () => import("./pages/AuthPage.jsx"),
  "/cart": () => import("./pages/CartPage.jsx"),
  "/admin": () => import("./pages/admin/AdminLayout.jsx"),
  "/admin/dashboard": () => import("./pages/admin/AdminDashboard.jsx"),
  "/admin/products": () => import("./pages/admin/AdminProductList.jsx"),
  "/admin/products/:id": () => import("./pages/admin/AdminProductForm.jsx"),
  "/admin/products/new": () => import("./pages/admin/AdminProductForm.jsx"),
  "/admin/sliders": () => import("./pages/admin/AdminSliders.jsx"),
  "/admin/brands": () => import("./pages/admin/AdminBrands.jsx"),
  "/admin/brands/:slug": () => import("./pages/admin/AdminBrandForm.jsx"),
  "/admin/brands/new": () => import("./pages/admin/AdminBrandForm.jsx"),
};

export const HomePage = lazy(routeLoaders["/"]);
export const ProductsPage = lazy(routeLoaders["/products"]);
export const CategoryPage = lazy(routeLoaders["/category/:slug"]);
export const ProductDetailsPage = lazy(routeLoaders["/product/:slug"]);
export const BrandsPage = lazy(routeLoaders["/brands"]);
export const BrandPage = lazy(routeLoaders["/brands/:slug"]);
export const AboutPage = lazy(routeLoaders["/about"]);
export const ContactPage = lazy(routeLoaders["/contact"]);
export const AuthPage = lazy(routeLoaders["/login"]);
export const CartPage = lazy(routeLoaders["/cart"]);
export const AdminLayout = lazy(routeLoaders["/admin"]);
export const AdminDashboard = lazy(routeLoaders["/admin/dashboard"]);
export const AdminProductList = lazy(routeLoaders["/admin/products"]);
export const AdminProductForm = lazy(routeLoaders["/admin/products/:id"]);
export const AdminSliders = lazy(routeLoaders["/admin/sliders"]);
export const AdminBrands = lazy(routeLoaders["/admin/brands"]);
export const AdminBrandForm = lazy(routeLoaders["/admin/brands/:slug"]);
export const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

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
  "/cart": () => import("./pages/CartPage.jsx"),
  "/admin/products/new": () => import("./pages/AdminNewProductPage.jsx"),
};

export const HomePage = lazy(routeLoaders["/"]);
export const ProductsPage = lazy(routeLoaders["/products"]);
export const CategoryPage = lazy(routeLoaders["/category/:slug"]);
export const ProductDetailsPage = lazy(routeLoaders["/product/:slug"]);
export const BrandsPage = lazy(routeLoaders["/brands"]);
export const BrandPage = lazy(routeLoaders["/brands/:slug"]);
export const AboutPage = lazy(routeLoaders["/about"]);
export const ContactPage = lazy(routeLoaders["/contact"]);
export const CartPage = lazy(routeLoaders["/cart"]);
export const AdminNewProductPage = lazy(routeLoaders["/admin/products/new"]);
export const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

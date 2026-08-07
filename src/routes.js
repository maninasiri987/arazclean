import { lazy } from "react";

/**
 * تنها منبع تعریف صفحات lazy — هم App.jsx و هم prefetch.js از همین استفاده می‌کنند.
 */
export const routeLoaders = {
  "/": () => import("./pages/HomePage.jsx"),
  "/products": () => import("./pages/ProductsPage.jsx"),
  "/category": () => import("./pages/CategoryPage.jsx"),
  "/product": () => import("./pages/ProductDetailsPage.jsx"),
  "/brands": () => import("./pages/BrandsPage.jsx"),
  "/blog": () => import("./pages/BlogPage.jsx"),
  "/about": () => import("./pages/AboutPage.jsx"),
  "/contact": () => import("./pages/ContactPage.jsx"),
  "/cart": () => import("./pages/CartPage.jsx"),
};

export const HomePage = lazy(routeLoaders["/"]);
export const ProductsPage = lazy(routeLoaders["/products"]);
export const CategoryPage = lazy(routeLoaders["/category"]);
export const ProductDetailsPage = lazy(routeLoaders["/product"]);
export const BrandsPage = lazy(routeLoaders["/brands"]);
export const BlogPage = lazy(routeLoaders["/blog"]);
export const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage.jsx"));
export const AboutPage = lazy(routeLoaders["/about"]);
export const ContactPage = lazy(routeLoaders["/contact"]);
export const CartPage = lazy(routeLoaders["/cart"]);
export const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

import React, { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

// Layout
import MainLayout from "./components/Layout/index.jsx";

import Loader from "./components/Loader/index.jsx"

// Pages
const Home = lazy(() => import("./pages/home/index.jsx"));
const BrandsPage = lazy(() => import("./pages/Brands/index.jsx"));
const CartPage = lazy(() => import("./pages/Cart/index.jsx"));
const WishList = lazy(() => import("./pages/LikedProducts/index.jsx"));
const Category = lazy(() => import("./pages/Category/index.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/index.jsx"));
const ProfileMenu = lazy(() => import("./components/Profile/index.jsx"));
const Orders = lazy(() => import("./pages/Orders/index.jsx"));
const OrderDetail = lazy(() => import("./pages/OrderDetail/index.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs/index.jsx"));
const DeliveryTerms = lazy(() => import("./pages/DeliveryTerms/index.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs/index.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/index.jsx"));

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Suspense fallback={<Loader/>}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/brands", element: <BrandsPage /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/wishlist", element: <WishList /> },
        { path: "/category/:categoryId", element: <Category /> },
        { path: "/search", element: <Category /> },
        { path: "/collections/:collectionId", element: <Category /> },
        { path: "/product/:productId", element: <ProductDetail /> },
        { path: "/profile", element: <ProfileMenu /> },
        { path: "/orders", element: <Orders /> },
        { path: "/orderdetail", element: <OrderDetail /> },
        { path: "/contactus", element: <ContactUs /> },
        { path: "/delivery-and-payment", element: <DeliveryTerms /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
      ],
    },
  ]);

  return routes;
}

import React, { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

// Layout
import MainLayout from "./components/Layout/index.jsx";

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


export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/brands", element: <BrandsPage /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/wishlist", element: <WishList /> },
        { path: "/category", element: <Category /> },
        { path: "/product", element: <ProductDetail /> },
        { path: "/profile", element: <ProfileMenu /> },
        { path: "/orders", element: <Orders /> },
        { path: "/orderdetail", element: <OrderDetail /> },
      
      ],
    },
  ]);

  return routes;
}

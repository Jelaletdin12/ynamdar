import { useState, useEffect } from "react";
import { BackTop } from "antd";
import Router from "./routes";
import { Provider } from "react-redux";
import store from "./app/store";
import "./i18n/i18n";
import PageLoader from "./components/Loader/pageLoader.jsx";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        {isLoading ? (
          <div className="loading-container">
            <PageLoader />
          </div>
        ) : (
          <>
            <Router />
            <ScrollToTop />
            {isVisible && (
              <BackTop visibilityHeight={500} duration={800}>
                <div
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "#fff",
                    color: "#fff",
                    textAlign: "center",
                    lineHeight: "40px",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    right: "0",
                  }}
                >
                  <svg
                    style={{ color: "#888888" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m12 7l5 5h-3v4h-4v-4H7l5-5m0 15A10 10 0 0 1 2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10m0-2a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8Z"
                    ></path>
                  </svg>
                </div>
              </BackTop>
            )}
          </>
        )}
      </AuthProvider>
    </Provider>
  );
}

export default App;

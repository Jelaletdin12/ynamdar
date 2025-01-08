import { useState, useEffect } from "react";
import { BackTop } from "antd";
import Router from "./routes";
// import Loading from "./pages/Loading";
import "./App.css";

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
    const scrollPosition = window.scrollY; // Y eksenindeki kaydırma pozisyonu
    if (scrollPosition > 200) {
      setIsVisible(true); // Scroll pozisyonu 200 pikselden büyükse göster
    } else {
      setIsVisible(false); // Scroll pozisyonu 200 pikselden küçükse gizle
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <p>Loading...</p>
          {/* <Loading /> */}
        </div>
      ) : (
        <>
          <Router />
          {isVisible && (
            <BackTop visibilityHeight={500} duration={800}>
              <div
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "#1088e9",
                  color: "#fff",
                  textAlign: "center",
                  lineHeight: "40px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                ↑
              </div>
            </BackTop>
          )}
        </>
      )}
    </>
  );
}

export default App;

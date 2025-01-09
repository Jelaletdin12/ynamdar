import { useState, useEffect } from "react";
import { BackTop } from "antd";
import Router from "./routes";
// import Loading from "./pages/Loading";
import "./App.css";
import { FaArrowAltCircleUp } from "react-icons/fa";

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
                  backgroundColor: "#fff",
                  color: "#fff",
                  textAlign: "center",
                  lineHeight: "40px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  right: "0"
                }}
              >
              <svg style={{color: "#ec6323"}} data-v-ced589b9="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 7l5 5h-3v4h-4v-4H7l5-5m0 15A10 10 0 0 1 2 12A10 10 0 0 1 12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10m0-2a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8Z"></path></svg>
              </div>
            </BackTop>
          )}
        </>
      )}
    </>
  );
}

export default App;

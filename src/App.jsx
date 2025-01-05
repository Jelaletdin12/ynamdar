import Router from "./routes";
// import Loading from "./pages/Loading";

import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    // return <Loading />;
    return <p>Loading...</p>;
  }

  return (
    <>
      <Router />
    </>
  );
}

export default App;

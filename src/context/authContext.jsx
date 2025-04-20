import React, { createContext, useState, useContext, useEffect } from "react";
import { useGetGuestTokenMutation } from "../app/api/authApi";
import { useTranslation } from "react-i18next";
export const AuthContext = createContext({
  isAuthenticated: false,
  authToken: null,
  guestToken: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [guestToken, setGuestToken] = useState(null);
  
  const { t, i18n } = useTranslation();
  
  

  const [getGuestToken] = useGetGuestTokenMutation();

  const getTokensFromStorage = () => {
    const storedAuthToken = localStorage.getItem("authToken");
    const storedGuestToken = localStorage.getItem("guestToken");

    if (!storedAuthToken) {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));

      if (authCookie) {
        return {
          authToken: authCookie.split("=")[1],
          guestToken: storedGuestToken,
        };
      }
    }

    if (!storedGuestToken && !storedAuthToken) {
      const guestCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("guestToken="));

      if (guestCookie) {
        return {
          authToken: storedAuthToken,
          guestToken: guestCookie.split("=")[1],
        };
      }
    }

    return { authToken: storedAuthToken, guestToken: storedGuestToken };
  };

  useEffect(() => {

    const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }

    const initialize = async () => {
      const { authToken: storedAuthToken, guestToken: storedGuestToken } =
        getTokensFromStorage();

      if (storedAuthToken) {
        setAuthToken(storedAuthToken);
        setIsAuthenticated(true);
        // console.log("Auth token bulundu ve aktif edildi");
      } else if (storedGuestToken) {
        setGuestToken(storedGuestToken);
        // console.log("Guest token bulundu ve aktif edildi");
      } else {
        try {
          // console.log("Token bulunamadı, guest token alınıyor...");
          const response = await getGuestToken().unwrap();

          const newGuestToken =
            response.token ||
            (typeof response.data === "string"
              ? response.data
              : response.data?.token);

          if (newGuestToken) {
            setGuestToken(newGuestToken);
            localStorage.setItem("guestToken", newGuestToken);
            document.cookie = `guestToken=${newGuestToken}; path=/; secure; SameSite=Strict`;
            console.log("Guest token obtained and stored successfully");
          } else {
            console.error("Guest token response format unexpected:", response);
          }
        } catch (error) {
          console.error("Failed to obtain guest token:", error);
        }
      }
    };

    initialize();
  }, [getGuestToken]);

  const login = (token) => {
    if (!token) return;
     
    // Store the token
    document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
    localStorage.setItem("authToken", token);
    setAuthToken(token);
  
    // Clear guest token
    localStorage.removeItem("guestToken");
    document.cookie = "guestToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setGuestToken(null);
  
    // Set authenticated state immediately
    setIsAuthenticated(true);
  };

  const logout = async () => {
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    
    try {
      const response = await getGuestToken().unwrap();
      const newGuestToken = response.token || response.data?.token;

      if (newGuestToken) {
        setGuestToken(newGuestToken);
        localStorage.setItem("guestToken", newGuestToken);
        document.cookie = `guestToken=${newGuestToken}; path=/; secure; SameSite=Strict`;
      }
    } catch (error) {
      console.error("Failed to get guest token after logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        guestToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
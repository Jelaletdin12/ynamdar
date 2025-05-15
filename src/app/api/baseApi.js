import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import i18n from "../../i18n/i18n"; // Import your i18n configuration

const getToken = () => {
  // Önce cookie'lerden token kontrol et
  const authTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));
  
  const guestTokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("guestToken="));
    
  // Sonra localStorage'dan kontrol et
  const authTokenLocal = localStorage.getItem("authToken");
  const guestTokenLocal = localStorage.getItem("guestToken");
  
  // Auth token varsa onu döndür (önce cookie sonra localStorage)
  if (authTokenCookie) return authTokenCookie.split("=")[1];
  if (authTokenLocal) return authTokenLocal;
  
  // Guest token varsa onu döndür
  if (guestTokenCookie) return guestTokenCookie.split("=")[1];
  if (guestTokenLocal) return guestTokenLocal;
  
  return null;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const token = getToken();
  const currentLanguage = i18n.language || "tm";

  // Add language parameter to the URL
  const urlWithLang =
    typeof args === "string"
      ? `${args}${args.includes("?") ? "&" : "?"}lang=${currentLanguage}`
      : {
          ...args,
          url: `${args.url}${
            args.url.includes("?") ? "&" : "?"
          }lang=${currentLanguage}`,
        };

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "https://mm.com.tm/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Api-Token", import.meta.env.VITE_API_TOKEN || "hello-mf-s");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  });

  try {
    const result = await baseQuery(urlWithLang, api, extraOptions);
    
    // Token geçersiz (401) ise yeni token al ve yeniden dene
    if (result.error && result.error.status === 401) {
      console.log("Token geçersiz, yeni guest token alınıyor...");
      try {
        // Guest token almak için özel bir istek yap
        const guestTokenResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "https://mm.com.tm/api/v1/"}/auth/guest-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Token": import.meta.env.VITE_API_TOKEN || "hello-mf-s",
            },
          }
        );
        
        const data = await guestTokenResponse.json();
        const newGuestToken = data.token || data.data;
        
        if (newGuestToken) {
          localStorage.setItem("guestToken", newGuestToken);
          document.cookie = `guestToken=${newGuestToken}; path=/; secure; SameSite=Strict`;
          
          // Token yenilendi, isteği tekrar dene
          const retryResult = await baseQuery(urlWithLang, api, extraOptions);
          return retryResult;
        }
      } catch (error) {
        console.error("Failed to get new guest token:", error);
      }
    }
    
    if (
      result.error &&
      typeof result.error.data === "string" &&
      result.error.data.includes("<!DOCTYPE html>")
    ) {
      return {
        error: {
          status: result.error.status,
          data: {
            message: "Server returned an HTML error page instead of JSON",
          },
        },
      };
    }

    return result;
  } catch (axiosError) {
    console.error("Query failed:", axiosError);
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: axiosError.message || "Unknown error occurred",
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});
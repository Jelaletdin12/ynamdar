import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import i18n from '../../i18n/i18n'; // Import your i18n configuration

const getToken = () => {
  let token = localStorage.getItem("authToken");
  let tokenType = token ? "auth" : "guest";
  if (!token) {
    const authTokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      token = authTokenCookie.split("=")[1];
      tokenType = "auth";
    }
  }

  if (!token) {
    token = localStorage.getItem("guestToken");
    tokenType = "guest";
    if (!token) {
      const guestTokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("guestToken="));

      if (guestTokenCookie) {
        token = guestTokenCookie.split("=")[1];
        tokenType = "guest";
      }
    }
  }

  return token || null;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const token = getToken();
  const currentLanguage = i18n.language || 'tm'; // Get current language, fallback to 'tm'

  // Add language parameter to the URL
  const urlWithLang = typeof args === 'string' 
    ? `${args}${args.includes('?') ? '&' : '?'}lang=${currentLanguage}`
    : {
        ...args,
        url: `${args.url}${args.url.includes('?') ? '&' : '?'}lang=${currentLanguage}`
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
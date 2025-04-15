import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => {
  // console.log("getToken çağrıldı");

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
    // console.log("Guest token", token);
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

  // if (token) {
  //   console.log(`${tokenType.toUpperCase()} token kullanılıyor`);
  // } else {
  //   console.warn("Token bulunamadı! API istekleri başarısız olabilir.");
  // }

  return token || null;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const token = getToken();

  // if (token) {
  //   console.log("Using token:", token);
  // } else {
  //   console.warn("No token available for request");
  // }

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
    const result = await baseQuery(args, api, extraOptions);
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

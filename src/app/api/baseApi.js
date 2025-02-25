import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getGuestToken = async () => {
  let guestToken = localStorage.getItem("guestToken");
  
  if (!guestToken) {
    try {
      const response = await fetch(
        "http://216.250.14.144/api/v1/auth/guest-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Token": import.meta.env.VITE_API_TOKEN || "hello-mf-s",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        
        guestToken = data.data;
        localStorage.setItem("guestToken", guestToken);
        
        console.log("Guest Token Saved:", guestToken);
      }
    } catch (error) {
      console.error("Error getting guest token:", error);
    }
  }
  
  return guestToken;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const guestToken = await getGuestToken();
  
  console.log("Guest Token in Headers:", guestToken);
  
  // Enhanced error handling
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://216.250.14.144/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Api-Token", import.meta.env.VITE_API_TOKEN || "hello-mf-s");
      
      if (guestToken) {
        headers.set("Authorization", `Bearer ${guestToken}`);
      } else {
        console.warn("Guest Token not found!");
      }
      
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      
      return headers;
    },
  });
  
  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle HTML responses that should be JSON
    if (result.error && typeof result.error.data === 'string' && result.error.data.includes('<!DOCTYPE html>')) {
      return {
        error: {
          status: result.error.status,
          data: { message: "Server returned an HTML error page instead of JSON" }
        },
      };
    }
    
    return result;
  } catch (axiosError) {
    console.error("Query failed:", axiosError);
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: axiosError.message || "Unknown error occurred"
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});
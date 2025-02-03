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

        console.log("Guest Token Kaydedildi:", guestToken);
      }
    } catch (error) {
      console.error("Guest token alınırken hata oluştu:", error);
    }
  }

  return guestToken;
};

const customBaseQuery = async (args, api, extraOptions) => {
  const guestToken = await getGuestToken();

  console.log("Header'a Eklenen Guest Token:", guestToken);

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://216.250.14.144/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Api-Token", import.meta.env.VITE_API_TOKEN || "hello-mf-s");

      if (guestToken) {
        headers.set("Authorization", `Bearer ${guestToken}`);
      } else {
        console.warn("Guest Token bulunamadı!");
      }

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});

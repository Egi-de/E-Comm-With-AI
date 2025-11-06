import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.2.2:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          const response = await api.post("/token/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access;
          await setAuthToken(newAccessToken);
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await clearAllTokens();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/login/", {
      email,
      password,
    });
    if (response.data.tokens) {
      await setAuthToken(response.data.tokens.access);
      await setRefreshToken(response.data.tokens.refresh);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Login API error:", error.response?.data);
    throw error;
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await api.post("/signup/", {
      username,
      email,
      password,
    });
    if (response.data.tokens) {
      await setAuthToken(response.data.tokens.access);
      await setRefreshToken(response.data.tokens.refresh);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Signup API error:", error.response?.data);
    throw error;
  }
};

export const getRecommendedProducts = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "product_image.jpg",
    });

    const response = await api.post("/recommend/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting recommendations:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put("/users/profile/", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem("access_token", token);
    console.log("Token set successfully");
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};

const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("refresh_token");
    return token;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

const setRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem("refresh_token", token);
    console.log("Refresh token set successfully");
  } catch (error) {
    console.error("Error setting refresh token:", error);
  }
};

const clearAllTokens = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("user");
    console.log("All tokens cleared successfully");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

export default api;

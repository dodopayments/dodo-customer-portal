import axios from "axios";
import { tokenHelper } from './token-helper';

let API_URL: string;
let MODE: string;

function initializeApi() {
  const currentHost =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}`
      : "";

  switch (currentHost) {
    case process.env.NEXT_PUBLIC_HOST_URL:
      API_URL = process.env.NEXT_PUBLIC_LIVE_URL!;
      MODE = "live";
      break;

    case process.env.NEXT_PUBLIC_TEST_HOST_URL:
      API_URL = process.env.NEXT_PUBLIC_TEST_URL!;
      MODE = "test";
      break;

    case "http://localhost:3000":
      API_URL = process.env.NEXT_PUBLIC_TEST_URL!;
      MODE = "test";
      break;

    default:
      API_URL = process.env.NEXT_PUBLIC_TEST_URL!;
      break;
  }

  return {
    api: axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    }),
    mode: MODE,
  };
}
export const internalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INTERNAL_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = initializeApi().api;
export const Mode = initializeApi().mode;

// Add this to your API interceptors
api.interceptors.request.use((config) => {
  const tokenData = tokenHelper.get();
  if (tokenData) {
    config.headers.Authorization = `Bearer ${tokenData.token}`;
  }
  return config;
});

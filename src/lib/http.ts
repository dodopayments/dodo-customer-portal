import axios from "axios";
import { tokenHelper } from "./token-helper";
import {
  BUSINESS_ARCHIVED_ROUTE,
  isBusinessArchived,
} from "./business-archived";

// Client-side initialization
let API_URL: string;
let MODE: string;

function initializeApi() {
  const currentHost =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
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
    case "http://localhost:3001":
      API_URL = process.env.NEXT_PUBLIC_LIVE_URL!;
      MODE = "live";
      break;

    default:
      API_URL = process.env.NEXT_PUBLIC_TEST_URL!;
      MODE = "test";
      break;
  }

  return {
    api_url: API_URL,
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
export const api_url = initializeApi().api_url;
// Add this to your API interceptors
api.interceptors.request.use((config) => {
  const tokenData = tokenHelper.get();
  if (tokenData) {
    config.headers.Authorization = `Bearer ${tokenData.token}`;
  }
  return config;
});

// The token extractor guards every portal route, so an archive mid-session can
// surface on any request. It is terminal: drop the session and send the
// customer to the dead-end page rather than toasting a retryable-looking error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const body = error?.response?.data;
    if (isBusinessArchived(status, body) && typeof window !== "undefined") {
      tokenHelper.clear();
      window.location.assign(BUSINESS_ARCHIVED_ROUTE);
    }
    return Promise.reject(error);
  }
);

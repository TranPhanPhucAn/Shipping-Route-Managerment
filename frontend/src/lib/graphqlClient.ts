import axios from "axios";
const GRAPHQL_URL = "http://localhost:5000/graphql";

const axiosInstance = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchGraphQL = async (query: string, variables?: object) => {
  try {
    const response = await axiosInstance.post("", {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    console.error("GraphQL request failed", error);
    throw error;
  }
};

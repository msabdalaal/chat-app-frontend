import axios from "axios";
const BASE_URL = import.meta.env.VITE_URL;
export async function POST(url, payload) {
  try {
    const response = await axios.post(`${BASE_URL + url}`, payload, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
}

export async function GET(url) {
  try {
    const response = await axios.get(`${BASE_URL + url}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error?.response?.data?.message;
  }
}
export async function DELETE(url, data = {}) {
  try {
    const response = await axios.delete(`${BASE_URL + url}`, {
      data: data, // Add optional body data here
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
}

export async function PATCH(url, data = {}) {
  try {
    const response = await axios.patch(
      `${BASE_URL + url}`,
      data, // Send the data as the second argument (this is the request body)
      {
        withCredentials: true, // This should be in the config, not inside the data
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred";
  }
}

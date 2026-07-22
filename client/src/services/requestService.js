import api from "./api";

export const getRequests = async (direction = "all") => {
  const response = await api.get(`/requests?direction=${direction}`);
  return response.data;
};

export const sendRequest = async (requestData) => {
  const response = await api.post("/requests", requestData);
  return response.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await api.put(`/requests/${id}`, { status });
  return response.data;
};
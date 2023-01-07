import API from "../utils/request";

export const getReceiver = async () => {
  const res = await API.get(`receiver/bylogincustomerid`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true
  }
};

export const createReceiver = (body) => {
  return API.post(`receiver/createbyaccountnumber`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
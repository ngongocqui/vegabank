import { getToken } from "utils/utils";
import API from "../utils/request";

export const getReceiver = async () => {
  const res = await API.get(`receiver/bylogincustomerid`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true,
  };
};

export const createReceiver = async (body) => {
  return API.post(`receiver/createbyaccountnumber`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const updateReceiver = async (id, body) => {
  return API.patch(`receiver/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const deleteReceiver = async (id) => {
  return API.delete(`receiver/${id}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

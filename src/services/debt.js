import { getToken } from "utils/utils";
import API from "../utils/request";

export const getDebt = async (params = {}) => {
  const res = await API.get(`debt`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    params,
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true,
  };
};

export const createDebt = async (body) => {
  return API.post(`debt`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const updateDebt = async (id, body) => {
  return API.patch(`debt/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const deleteDebt = async (id) => {
  return API.delete(`debt/${id}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const cancelDebt = async (id, body) => {
  return API.patch(`debt/cancelreminddebt/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const payDebt = async (id, body) => {
  return API.patch(`debt/payDebt/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const updateBalace = async (id, body) => {
  return API.patch(`debt/updateBalance/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

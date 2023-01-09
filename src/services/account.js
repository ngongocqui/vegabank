import { getToken } from "utils/utils";
import API from "../utils/request";

export const getAccount = async () => {
  const res = await API.get(`account`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  return {
    data: res?.data?.data || [],
    total: res?.data?.data?.length,
    success: true,
  };
};

export const getAccountFindOne = async (customerId) => {
  return API.get(`account/${customerId}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const updateBalance = async (customerId, body) => {
  return API.patch(`account/${customerId}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const createAccount = async (body) => {
  return API.post(`account`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const closeAccount = async (customerId) => {
  return API.patch(`account/closeAccount/${customerId}`, null, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

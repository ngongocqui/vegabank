import { getToken } from "utils/utils";
import API from "../utils/request";

export const getTransaction = async (params = {}) => {
  const res = await API.get(`transaction`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    params,
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true,
  };
};

export const getTransactionByCustomer = async (customerId, params = {}) => {
  const res = await API.get(`transaction/byCustomerId/${customerId}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    params,
  });
  return {
    data: res?.data?.data || [],
    total: res?.data?.data?.length,
    success: true,
  };
};

export const createTransactionByCustomer = async (body) => {
  return API.post(`transaction/createbyaccountnumber`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const sendMail = async (id, body) => {
  return API.patch(`transaction/updatebalance/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

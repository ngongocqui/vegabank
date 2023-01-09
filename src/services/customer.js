import { getToken } from "utils/utils";
import API from "../utils/request";

export const getCustomer = async (params = {}) => {
  const res = await API.get(`customer/findAll`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
    params
  });
  return {
    data: res?.data?.data?.customer || [],
    total: res?.data?.data?.customer?.length,
    success: true,
  };
};

export const getCustomerFindOne = async () => {
  return API.get(`customer`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const updateCustomer = async (id, body) => {
  return API.patch(`customer/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const changeStatus = async (id, body) => {
  return API.patch(`customer/closeAccount/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};
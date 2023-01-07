import API from "../utils/request";

export const getTransaction = async () => {
  const res = await API.get(`transaction`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true
  }
};

export const getTransactionByCustomer = async (customerId) => {
  const res = await API.get(`transaction/byCustomerId/${customerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return {
    data: res?.data?.data || [],
    total: res?.data?.data?.length,
    success: true
  }
};

export const createTransactionByCustomer = (body) => {
  return API.post(`transaction/createbyaccountnumber`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const sendMail = (id, body) => {
  return API.patch(`transaction/updatebalance/${id}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
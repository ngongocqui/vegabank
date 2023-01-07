import API from "../utils/request";

export const getAccount = async () => {
  const res = await API.get(`account`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return {
    data: res?.data?.data || [],
    total: res?.data?.data?.length,
    success: true
  }
};

export const getAccountFindOne = (customerId) => {
  return API.get(`account/${customerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateBalance = (customerId, body) => {
  return API.patch(`account/${customerId}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const closeAccount = (customerId) => {
  return API.patch(`account/closeAccount/${customerId}`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
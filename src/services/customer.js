import API from "../utils/request";

export const getCustomer = async (params = {}) => {
  const res = await API.get(`customer/findAll`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params
  });
  return {
    data: res?.data?.data?.customer || [],
    total: res?.data?.data?.customer?.length,
    success: true,
  };
};

export const getCustomerFindOne = () => {
  return API.get(`customer`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCustomer = (id, body) => {
  return API.patch(`customer/${id}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const changeStatus = (id, body) => {
  return API.patch(`customer/closeAccount/${id}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
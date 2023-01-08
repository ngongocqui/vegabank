import API from "../utils/request";

export const getCustomer = async () => {
  const res = await API.get(`customer/findAll`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

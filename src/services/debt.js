import API from "../utils/request";

export const getDebt = async (params = {}) => {
  const res = await API.get(`debt`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params
  });
  return {
    data: res?.data || [],
    total: res?.data?.length,
    success: true,
  };
};

export const createDebt = (body) => {
  return API.post(`debt`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDebt = (id, body) => {
  return API.patch(`debt/${id}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteDebt = (id) => {
  return API.delete(`debt/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
import API from "../utils/request";

export const registerUser = (body) => {
  return API.post(`customer`, body);
};

export const loginUser = (body) => {
  return API.post(`customer/login`, body);
};

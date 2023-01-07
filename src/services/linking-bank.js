import API from "../utils/request";

export const createTransactionLinkingBank = (body) => {
  return API.post(`linking-banks/external/transfer/out`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
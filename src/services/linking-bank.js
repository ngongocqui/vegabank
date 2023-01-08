import API from "../utils/request";

export const createTransactionLinkingBank = (body) => {
  return API.post(`linking-banks/external/transfer/out`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTransactionLinkingBankByAccountNumber = (accountNumber) => {
  return API.get(`linking-banks/external/account/${accountNumber}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export const sendMailLinkingBank = (id, body) => {
  return API.patch(`linking-banks/updatebalance/${id}`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const createReceiverLinkingBank = (body) => {
  return API.post(`linking-banks/createReceiver`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
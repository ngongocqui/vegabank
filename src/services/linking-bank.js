import { getToken } from "utils/utils";
import API from "../utils/request";

export const createTransactionLinkingBank = async (body) => {
  return API.post(`linking-banks/external/transfer/out`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const getTransactionLinkingBankByAccountNumber = async (accountNumber) => {
  return API.get(`linking-banks/external/account/${accountNumber}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const sendMailLinkingBank = async (id, body) => {
  return API.patch(`linking-banks/updatebalance/${id}`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

export const createReceiverLinkingBank = async (body) => {
  return API.post(`linking-banks/createReceiver`, body, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
};

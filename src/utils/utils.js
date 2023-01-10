import to from "await-to-js";
import moment from "moment";
import { getNewTokenByRefreshToken } from "services/auth";

export const saveToken = ({ token, refreshToken, accessTokenExpires }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.getItem("accessTokenExpires", accessTokenExpires);
};

export const getToken = async () => {
  const token = localStorage.getItem("token");
  const accessTokenExpires = localStorage.getItem("accessTokenExpires");

  if (moment().valueOf() - moment(+accessTokenExpires * 1000).valueOf() > -1000) {
    const [err, res] = await to(getNewTokenByRefreshToken());
    if (err) return token;

    saveToken({
      token: res?.data?.data?.token,
      refreshToken: res?.data?.data?.refreshToken,
      accessTokenExpires: res?.data?.data?.tokenExp,
    });
    return res?.data?.data?.token;
  }

  return token;
};
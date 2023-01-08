import React from "react";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

const LocaleProTable = ({ children }) => {
  return <ConfigProvider locale={viVN}>{children}</ConfigProvider>;
};

export default LocaleProTable;

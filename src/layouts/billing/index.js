/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import { Button, Card, Divider, message, Popconfirm, Row, Space, Tag, Typography } from "antd";
import { accountInfo } from "slices/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { ProFormDigit, ProFormText } from "@ant-design/pro-components";
import Form from "antd/es/form/Form";
import LocaleProTable from "components/Locale";
import { useDeepCompareEffect, useReactive } from "ahooks";
import NapTienForm from "./components/NapTienForm";
import to from "await-to-js";
import { getAccountFindOne } from "services/account";
import { updateAccountInfo } from "slices/accountSlice";
import { customerInfo } from "slices/customerSlice";
import SendOTP from "./components/SendOTP";
import ReceiverForm from "./components/ReceiverForm";
import { closeAccount } from "services/account";
import CloseAccount from "./components/PopConfirm";
import NapTienLienNganHangForm from "./components/NapTienLienNganHangForm";
import SendOTPLienNganHang from "./components/SendOTPLienNganHang";

function Billing() {
  const dispatch = useDispatch();
  const customer = useSelector(customerInfo);
  const account = useSelector(accountInfo);
  const state = useReactive({
    napTien: {
      visible: false,
    },
    napTienLienNganHang: {
      visible: false,
    },
    sendOTPLienNganHang: {
      visible: false,
      id: null
    },
    sendOTP: {
      visible: false,
      id: null
    },
    receiverForm: {
      visible: false,
      account: ""
    },
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <LocaleProTable>
        <Space direction="vertical" style={{ width: "100%" }}>
          {account?.data?.map?.((it, i) => {
            return (
              <Card
                key={i}
                title={
                  <Space>
                    <Typography.Text>{`Tài khoản ${i + 1}`}</Typography.Text>
                    <Tag color={it.status === "ACTIVE" ? "success" : "red"}>{it.status}</Tag>
                  </Space>
                }
              >
                <Form initialValues={it}>
                  <ProFormText name="accountNumber" label="Account Number" disabled />
                  <ProFormText name="type" label="Type" disabled />
                  <ProFormDigit name="balance" label="Balance" disabled />
                </Form>
                {it.status === "ACTIVE" && (
                  <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                    <CloseAccount id={it.id} />
                  </div>
                )}
              </Card>
            )
          })}
        </Space>
        <Divider />
        <Space>
          <Button type="primary" onClick={() => state.napTien.visible = true}>Chuyển khoản nội bộ</Button>
          <Button onClick={() => state.napTienLienNganHang.visible = true}>Chuyển khoản liên ngân hàng</Button>
        </Space>
        <NapTienForm
          state={state.napTien}
          reload={async (id, account) => {
            state.sendOTP.visible = true;
            state.sendOTP.id = id;
            state.receiverForm.account = account;
            // console.log(account)
          }}
        />
        <NapTienLienNganHangForm
          state={state.napTienLienNganHang}
          reload={async (id, account) => {
            state.sendOTPLienNganHang.visible = true;
            state.sendOTPLienNganHang.id = id;
          }}
        />
        <SendOTP
          state={state.sendOTP}
          reload={async () => {
            const [, res_2] = await to(getAccountFindOne(customer?.id));
            const accounts = res_2?.data?.data || [];
            dispatch(updateAccountInfo({ data: accounts }));

            state.receiverForm.visible = true;
          }}
        />
        <SendOTPLienNganHang
          state={state.sendOTPLienNganHang}
          reload={async () => {
            const [, res_2] = await to(getAccountFindOne(customer?.id));
            const accounts = res_2?.data?.data || [];
            dispatch(updateAccountInfo({ data: accounts }));
          }}
        />
        <ReceiverForm
          state={state.receiverForm}
          reload={async () => {
            const [, res_2] = await to(getAccountFindOne(customer?.id));
            const accounts = res_2?.data?.data || [];
            dispatch(updateAccountInfo({ data: accounts }));
          }}
        />
      </LocaleProTable>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;

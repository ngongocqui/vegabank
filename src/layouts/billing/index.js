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
import { Button, Card, Divider, message, Popconfirm, Row, Space } from "antd";
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

function Billing() {
  const dispatch = useDispatch();
  const customer = useSelector(customerInfo);
  const account = useSelector(accountInfo);
  const state = useReactive({
    napTien: {
      visible: false,
    },
    sendOTP: {
      visible: false,
      id: null
    },
    receiverForm: {
      visible: false,
      account: ""
    },
    popconfirm: {
      visible: false
    }
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <LocaleProTable>
        <Space direction="vertical" style={{ width: "100%" }}>
          {account?.data?.map?.((it, i) => {
            return (
              <Card key={i}>
                <Form initialValues={it}>
                  <ProFormText name="accountNumber" label="Account Number" disabled />
                  <ProFormText name="type" label="Type" disabled />
                  <ProFormDigit name="balance" label="Balance" disabled />
                </Form>
                <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                  <Popconfirm
                    title="Đóng tài khoản"
                    open={state.popconfirm.visible}
                    onConfirm={async () => {
                      await closeAccount(it.id);
                      state.popconfirm.visible = false;
                      message.success("Bạn đã đóng tài khoản");
                    }}
                    onCancel={() => state.popconfirm.visible = false}
                  >
                    <Button onClick={() => state.popconfirm.visible = true}>
                      Đóng tài khoản
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            )
          })}
        </Space>
        <Divider />
        <Space>
          <Button type="primary" onClick={() => state.napTien.visible = true}>Chuyển khoản nội bộ</Button>
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
        <SendOTP
          state={state.sendOTP}
          reload={async () => {
            const [, res_2] = await to(getAccountFindOne(customer?.id));
            const accounts = res_2?.data?.data || [];
            dispatch(updateAccountInfo({ data: accounts }));

            state.receiverForm.visible = true;
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

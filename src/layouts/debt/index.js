import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Space, Switch, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, RollbackOutlined, CreditCardOutlined } from "@ant-design/icons";
import LocaleProTable from "components/Locale";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getCustomer } from "services/customer";
import CustomerForm from "./components/CustomerForm";
import { useReactive } from "ahooks";
import { useRef } from "react";
import { changeStatus } from "services/customer";
import { getDebt } from "services/debt";
import { deleteDebt } from "services/debt";
import Footer from "examples/Footer";
import CancelDebt from "./components/CancelDebt";
import SendOTP from "layouts/billing/components/SendOTP";
import to from "await-to-js";
import { createTransactionByCustomer } from "services/transaction";

const Debt = () => {
  const actionRef = useRef();
  const state = useReactive({
    customerForm: {
      visible: false,
      type: "CREATE",
      data: null
    },
    cancelDebt: {
      visible: false,
      data: null
    },
    napTien: {
      visible: false,
    },
    sendOTP: {
      visible: false,
      id: null,
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      valueType: "index",
      width: 80,
    },
    {
      title: "Creditor",
      dataIndex: "creditor",
      width: 150,
      ellipse: true,
    },
    {
      title: "Debtor",
      dataIndex: "debtor",
      width: 150,
      ellipse: true,
    },
    {
      title: "Content",
      dataIndex: "contentDebt",
      width: 150,
      ellipse: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      ellipse: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
    },
    {
      title: "Tuỳ chỉnh",
      valueType: "option",
      width: 100,
      render: (_, record) => [
        <Space size={14}>
          <EditOutlined
            onClick={() => {
              state.customerForm.visible = true;
              state.customerForm.type = "UPDATE"
              state.customerForm.data = record
            }}
          />
          <CreditCardOutlined
            onClick={async () => {
              const [err_1, res_1] = await to(
                createTransactionByCustomer({
                  fromAccount: record.creditor,
                  toAccount: record.debtor,
                  amount: record.amount,
                  type: "SENDER",
                  contentTransaction: record.contentDebt,
                })
              );

              if (err_1) {
                message.error(err_1?.response?.data?.message || err_1.message);
                return;
              }

              state.sendOTP.visible = true;
              state.sendOTP.id = res_1?.data?.data?._id;
            }}
          />
          <RollbackOutlined
            onClick={() => {
              state.cancelDebt.visible = true;
              state.cancelDebt.data = record;
            }}
          />
          <DeleteOutlined
            onClick={async () => {
              await deleteDebt(record?._id);
              message.success("Xoá thành công!");

              actionRef.current?.reload();
            }}
          />
        </Space>,
      ],
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <LocaleProTable>
        <ProTable
          search={false}
          actionRef={actionRef}
          columns={columns}
          rowKey={(r, i) => i}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} debt`,
          }}
          request={async () => {
            return await getDebt();
          }}
          headerTitle={`Debt`}
          toolBarRender={() => [
            <Button
              key="create"
              type="primary"
              onClick={() => {
                state.customerForm.visible = true;
                state.customerForm.type = "CREATE"
              }}
            >
              <PlusOutlined /> Tạo mới
            </Button>,
          ]}
        />
        <CustomerForm
          state={state.customerForm}
          reload={() => actionRef.current?.reload()}
        />
        <CancelDebt
          state={state.cancelDebt}
          reload={() => actionRef.current?.reload()}
        />
        <SendOTP
          state={state.sendOTP}
          reload={async () => {
            actionRef.current?.reload()
          }}
        />
      </LocaleProTable>
      <Footer />
    </DashboardLayout>
  );
};

export default Debt;

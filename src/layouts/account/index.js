import { ProTable } from "@ant-design/pro-components";
import { Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LocaleProTable from "components/Locale";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getCustomer } from "services/customer";
import CustomerForm from "./components/CustomerForm";
import { useReactive } from "ahooks";
import { useRef } from "react";
import NapTienForm from "./components/NapTienForm";
import { getAccount } from "services/account";
import moment from "moment";

const Account = () => {
  const actionRef = useRef();
  const state = useReactive({
    customerForm: {
      visible: false,
    },
    napTien: {
      visible: false,
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
      title: "Account Number",
      dataIndex: "accountNumber",
      width: 150,
      ellipse: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 150,
      ellipse: true,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: 150,
      ellipse: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
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
              `${range[0]}-${range[1]} trên ${total} account`,
          }}
          request={async () => {
            return await getAccount();
          }}
          headerTitle={`Account`}
          toolBarRender={() => [
            <Button
              key="nap-tien"
              type="default"
              onClick={() => {
                state.napTien.visible = true;
              }}
            >
              <PlusOutlined /> Nạp tiền
            </Button>,
            <Button
              key="create"
              type="primary"
              onClick={() => {
                state.customerForm.visible = true;
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
        <NapTienForm
          state={state.napTien}
          reload={() => actionRef.current?.reload()}
        />
      </LocaleProTable>
    </DashboardLayout>
  );
};

export default Account;

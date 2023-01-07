import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import LocaleProTable from "components/Locale";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getCustomer } from "services/customer";
import CustomerForm from "./components/CustomerForm";
import { useReactive } from "ahooks";
import { useRef } from "react";
import NapTienForm from "./components/NapTienForm";
import CreateAccountForm from "./components/CreateAccountForm";

const Customer = () => {
  const actionRef = useRef();
  const state = useReactive({
    customerForm: {
      visible: false,
    },
    napTien: {
      visible: false,
    },
    createAccountForm: {
      visible: false,
      data: null
    }
  });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 150,
      ellipse: true
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      ellipse: true
    },
    {
      title: 'Xác thực',
      dataIndex: 'is_confirmed',
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return (
          <Tag color={record?.is_confirmed ? "success" : "error"}>
            {record?.is_confirmed ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
        )
      }
    },
    {
      title: 'Tuỳ chỉnh',
      valueType: 'option',
      width: 50,
      render: (_, record) => [
        <Space>
          <EditOutlined
            onClick={() => {
              state.createAccountForm.visible = true;
              state.createAccountForm.data = record;
            }}
          />
        </Space>
      ]
    }
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
            showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} customer`,
          }}
          request={async () => {
            return await getCustomer();
          }}
          headerTitle={`Customer`}
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
        <CustomerForm state={state.customerForm} reload={() => actionRef.current?.reload()} />
        <NapTienForm state={state.napTien} reload={() => actionRef.current?.reload()} />
        <CreateAccountForm state={state.createAccountForm} reload={() => actionRef.current?.reload()} />
      </LocaleProTable>
    </DashboardLayout>
  )
};

export default Customer;
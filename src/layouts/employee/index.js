import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Space, Switch, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import LocaleProTable from "components/Locale";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getCustomer } from "services/customer";
import CustomerForm from "./components/CustomerForm";
import { useReactive } from "ahooks";
import { useRef } from "react";
import { changeStatus } from "services/customer";
import Footer from "examples/Footer";

const Employee = () => {
  const actionRef = useRef();
  const state = useReactive({
    customerForm: {
      visible: false,
      type: "CREATE",
      data: null
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
      title: "Email",
      dataIndex: "email",
      width: 150,
      ellipse: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      ellipse: true,
    },
    {
      title: "Xác thực",
      dataIndex: "is_confirmed",
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return (
          <Tag color={record?.is_confirmed ? "success" : "error"}>
            {record?.is_confirmed ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (_, record) => {
        return (
          <Switch
            checked={record?.status === "ACTIVE"}
            onClick={async () => {
              await changeStatus(record.id, { status: record?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
              message.success("Thay đổi trạng thái thành công!");

              actionRef.current?.reload();
            }}
          />
        )
      }
    },
    {
      title: "Tuỳ chỉnh",
      valueType: "option",
      width: 50,
      render: (_, record) => [
        <Space>
          <EditOutlined
            onClick={() => {
              state.customerForm.visible = true;
              state.customerForm.type = "UPDATE"
              state.customerForm.data = record
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
              `${range[0]}-${range[1]} trên ${total} employee`,
          }}
          request={async () => {
            return await getCustomer({ type: 'employee' });
          }}
          headerTitle={`Employee`}
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
      </LocaleProTable>
      <Footer />
    </DashboardLayout>
  );
};

export default Employee;

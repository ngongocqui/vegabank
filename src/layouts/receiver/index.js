import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Space, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
import { getReceiver } from "services/receiver";
import { deleteReceiver } from "services/receiver";
import Footer from "layouts/authentication/components/Footer";

const Receiver = () => {
  const actionRef = useRef();
  const state = useReactive({
    customerForm: {
      visible: false,
      type: "CREATE",
      data: null,
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
      title: "Name",
      dataIndex: "remindName",
      width: 150,
      ellipse: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 200,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Tuỳ chỉnh",
      valueType: "option",
      width: 80,
      render: (_, record) => [
        <Space>
          <EditOutlined
            onClick={() => {
              state.customerForm.visible = true;
              state.customerForm.type = "UPDATE";
              state.customerForm.data = record;
            }}
          />
          <DeleteOutlined
            onClick={async () => {
              await deleteReceiver(record._id);
              actionRef.current?.reload();
              message.success("Xoá thành công!");
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
              `${range[0]}-${range[1]} trên ${total} receiver`,
          }}
          request={async () => {
            return await getReceiver();
          }}
          headerTitle={`Receiver`}
          toolBarRender={() => [
            // <Button
            //   key="nap-tien"
            //   type="default"
            //   onClick={() => {
            //     state.napTien.visible = true;
            //   }}
            // >
            //   <PlusOutlined /> Nạp tiền
            // </Button>,
            <Button
              key="create"
              type="primary"
              onClick={() => {
                state.customerForm.visible = true;
                state.customerForm.type = "CREATE";
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
      <Footer />
    </DashboardLayout>
  );
};

export default Receiver;

import { ProTable } from "@ant-design/pro-components";
import LocaleProTable from "components/Locale";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { getTransaction } from "services/transaction";
import moment from 'moment';
import { useSelector } from "react-redux";
import { customerInfo } from "slices/customerSlice";
import { getTransactionByCustomer } from "services/transaction";
import Footer from "examples/Footer";

const Transaction = () => {
  const customer = useSelector(customerInfo);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      width: 50,
      ellipse: true
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 50,
      ellipse: true
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      ellipse: true
    },
    {
      title: 'Content',
      dataIndex: 'contentTransaction',
      width: 100,
      ellipse: true
    },
    {
      title: 'From Name',
      dataIndex: 'fromName',
      width: 100,
      ellipse: true
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      width: 100,
      ellipse: true,
      render: (_, record) => {
        return moment(record?.updatedAt).format("DD/MM/YYYY HH:mm:ss");
      }
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <LocaleProTable>
        <ProTable
          search={false}
          columns={columns}
          rowKey={(r, i) => i}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} transaction`,
          }}
          params={{ customer }}
          request={async () => {
            if (customer.type === 'admin') return await getTransaction();
            return await getTransactionByCustomer(customer.id);
          }}
          headerTitle={`Transaction`}
        />
      </LocaleProTable>
      <Footer />
    </DashboardLayout>
  )
};

export default Transaction;
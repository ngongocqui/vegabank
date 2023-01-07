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
import { Tag } from "antd";
import { useState } from "react";

const Transaction = () => {
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState([moment().startOf("month"), moment().endOf("month")]);
  const customer = useSelector(customerInfo);

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

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
      key: 'bank',
      width: 50,
      ellipse: true,
      render: (_, record) => {
        if (String(record?.bank).toLowerCase() !== "ibank")
          return <Tag color="cyan">{record?.bank}</Tag>;
        return <Tag>{record?.bank}</Tag>;
      },
      valueEnum: {
        iBank: { text: 'iBank' },
        Abine: { text: 'Abine' }
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      width: 50,
      ellipse: true,
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        allowClear: false,
        disabledDate: disabledDate,
        onCalendarChange: (val) => setDates(val),
        value: dates || value,
        onChange: (val) => setValue(val),
        onOpenChange: onOpenChange
      },
      initialValue: [moment().startOf("month"), moment().endOf("month")],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 50,
      ellipse: true,
      search: false
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      ellipse: true,
      search: false
    },
    {
      title: 'Content',
      dataIndex: 'contentTransaction',
      width: 100,
      ellipse: true,
      search: false
    },
    {
      title: 'From Name',
      dataIndex: 'fromName',
      width: 100,
      ellipse: true,
      search: false
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 100,
      key: 'from',
      ellipse: true,
      search: false,
      render: (_, record) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      width: 100,
      ellipse: true,
      search: false,
      key: 'to',
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
          columns={columns}
          rowKey={(r, i) => i}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} transaction`,
          }}
          params={{ customer }}
          request={async (params) => {
            delete params.customer;
            if (params.date) {
              params.from = params.date[0];
              params.to = params.date[1];
              delete params.date;
            }
            if (customer.type === 'admin') return await getTransaction(params);
            return await getTransactionByCustomer(customer.id, params);
          }}
          headerTitle={`Transaction`}
        />
      </LocaleProTable>
      <Footer />
    </DashboardLayout>
  )
};

export default Transaction;
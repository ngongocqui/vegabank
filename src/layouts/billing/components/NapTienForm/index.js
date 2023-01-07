import { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useReactive } from 'ahooks';
import { Modal, Form, Card, message } from 'antd';
import to from 'await-to-js';
import { useSelector } from 'react-redux';
import { getAccount } from 'services/account';
import { getReceiver } from 'services/receiver';
import { createReceiver } from 'services/receiver';
import { createTransactionByCustomer } from 'services/transaction';
import { accountInfo } from 'slices/accountSlice';

const NapTienForm = (props) => {
  const [form] = Form.useForm();
  const account = useSelector(accountInfo);
  const state = useReactive(props.state);

  const onSubmit = async () => {
    const [err] = await to(form.validateFields());
    if (err && Array.isArray(err.errorFields)) {
      err.errorFields.forEach((it) => {
        message.error(it?.errors?.[0] || "");
      });
      return;
    }

    const [err_1] = await to(createTransactionByCustomer({
      fromAccount: account?.data?.[0]?.accountNumber,
      toAccount: form.getFieldValue("account"),
      amount: form.getFieldValue("amount"),
      type: "sender",
      contentTransaction: form.getFieldValue("content")
    }));

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }

    // post receiver
    const [err_2] = await to(createReceiver({
      accountId: form.getFieldValue("account"),
      remindName: form.getFieldValue("account"),
    }));

    if (err_2) {
      message.error(err_2?.response?.data?.message || err_2.message);
      return;
    }

    message.success("Nạp tiền thành công");
    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Chuyển tiền nội bộ"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout='vertical'>
          <ProFormSelect
            name="receiver"
            label="Thông tin người nhận"
            placeholder=""
            showSearch
            request={async () => {
              const res = await getReceiver();
              return res?.data?.map((it) => ({
                label: it.remindName,
                value: it.accountNumber,
              }))
            }}
            fieldProps={{
              onChange: (value) => {
                if (value) form.setFieldValue("account", value);
              }
            }}
          />
          <ProFormText
            name="account"
            label="Account Number"
            placeholder="Nhập account number"
            rules={[
              { required: true, message: "Account number là bắt buộc!" },
            ]}
          />
          <ProFormDigit
            name="amount"
            label="Amount"
            placeholder="Nhập amount"
            rules={[
              { required: true, message: "Amount là bắt buộc!" },
            ]}
          />
          <ProFormTextArea
            name="content"
            label="Content"
            placeholder="Nhập content"
          />
        </Form>
      </Card>
    </Modal>
  )
};

export default NapTienForm;
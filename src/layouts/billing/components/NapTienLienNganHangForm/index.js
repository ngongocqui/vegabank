import {
  ProFormCheckbox,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { useSelector } from "react-redux";
import { getAccountFindOne } from "services/account";
import { getAccount } from "services/account";
import { getTransactionLinkingBankByAccountNumber } from "services/linking-bank";
import { createTransactionLinkingBank } from "services/linking-bank";
import { getReceiver } from "services/receiver";
import { createReceiver } from "services/receiver";
import { createTransactionByCustomer } from "services/transaction";
import { accountInfo } from "slices/accountSlice";
import { customerInfo } from "slices/customerSlice";

const NapTienLienNganHangForm = (props) => {
  const [form] = Form.useForm();
  const customer = useSelector(customerInfo);
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

    const toAccount = form.getFieldValue("account");

    const [err_1, res_1] = await to(
      createTransactionLinkingBank({
        fromAccount: form.getFieldValue("source"),
        toAccount,
        amount: form.getFieldValue("amount"),
        type: form.getFieldValue("type"),
        contentTransaction: form.getFieldValue("content"),
        fee: 0,
      })
    );

    // console.log(res_1)

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }

    onCancel();
    await props.reload?.(res_1?.data?.data?.newTrans?._id, toAccount);
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Chuyển tiền liên ngân hàng"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormSelect
            name="source"
            label="Tài khoản nguồn"
            placeholder="Chọn tài khoản nguồn"
            rules={[
              { required: true, message: "Tài khoản nguồn là bắt buộc!" },
            ]}
            showSearch
            request={async () => {
              const res = await getAccountFindOne(customer.id);
              return res?.data?.data?.map((it) => ({
                label: it.accountNumber,
                value: it.accountNumber,
              }));
            }}
          />
          <ProFormSelect
            name="receiver"
            label="Thông tin người nhận đã lưu"
            placeholder="Chọn người nhận"
            showSearch
            request={async () => {
              const res = await getReceiver();
              return res?.data?.map((it) => ({
                label: it.remindName,
                value: it.accountNumber,
              }))
            }}
            params={{ visible: state.visible }}
            fieldProps={{
              onChange: async (value) => {
                if (value) {
                  const res = await getTransactionLinkingBankByAccountNumber(value);
                  form.setFieldsValue({
                    account: value,
                    name: res.data?.fullname
                  })
                }
              },
            }}
          />
          <ProFormText
            name="account"
            label="Account Number người nhận"
            placeholder="Nhập account number"
            rules={[{ required: true, message: "Account number là bắt buộc!" }]}
            fieldProps={{
              onChange: async (event) => {
                if (event.target.value) {
                  const res = await getTransactionLinkingBankByAccountNumber(
                    event.target.value
                  );
                  form.setFieldsValue({
                    name: res.data?.fullname,
                  });
                }
              },
            }}
          />
          <ProFormDependency name={["name"]}>
            {({ name }) => {
              if (!name) return;
              return (
                <ProFormText
                  label="Tên người nhận"
                  name="name"
                  disabled
                  placeholder="Tên người nhận"
                />
              );
            }}
          </ProFormDependency>
          <ProFormDigit
            name="amount"
            label="Amount"
            placeholder="Nhập amount"
            rules={[{ required: true, message: "Amount là bắt buộc!" }]}
          />
          <ProFormTextArea
            name="content"
            label="Content"
            placeholder="Nhập content"
          />
          <ProFormSelect
            name="type"
            label="Phí chuyển"
            initialValue="SENDER"
            request={() => [
              { label: "Người nhận trả", value: "RECEIVER" },
              { label: "Người chuyển trả", value: "SENDER" },
            ]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default NapTienLienNganHangForm;

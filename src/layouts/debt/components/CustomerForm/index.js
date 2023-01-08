import { ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAccountFindOne } from "services/account";
import { registerUser } from "services/auth";
import { updateCustomer } from "services/customer";
import { updateDebt } from "services/debt";
import { createDebt } from "services/debt";
import { customerInfo } from "slices/customerSlice";

const CustomerForm = (props) => {
  const [form] = Form.useForm();
  const customer = useSelector(customerInfo);
  const state = useReactive(props.state);

  useEffect(() => {
    if (props.type === "CREATE") {
      form.setFieldsValue({
        source: "",
        account: "",
        amount: "",
        content: "",
      });
    } else {
      form.setFieldsValue({
        source: props.state.data?.creditor,
        account: props.state.data?.debtor,
        amount: props.state.data?.amount,
        content: props.state.data?.contentDebt,
      });
    }
  }, [props.state.visible]);

  const onSubmit = async () => {
    const [err] = await to(form.validateFields());
    if (err && Array.isArray(err.errorFields)) {
      err.errorFields.forEach((it) => {
        message.error(it?.errors?.[0] || "");
      });
      return;
    }

    if (state.type === "CREATE") {
      const [err_1] = await to(
        createDebt({
          creditor: form.getFieldValue('source'),
          debtor: form.getFieldValue("account"),
          amount: form.getFieldValue("amount"),
          contentDebt: form.getFieldValue("content"),
        })
      );

      if (err_1) {
        message.error(err_1?.response?.data?.message || err_1.message);
        return;
      }
      message.success("Tạo thành công");
    } else {
      const [err_1] = await to(
        updateDebt(props.state.data._id, {
          creditor: form.getFieldValue('source'),
          debtor: form.getFieldValue("account"),
          amount: form.getFieldValue("amount"),
          contentDebt: form.getFieldValue("content"),
        })
      );

      if (err_1) {
        message.error(err_1?.response?.data?.message || err_1.message);
        return;
      }
      message.success("Cập nhật thành công");
    }

    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title={state.type === "CREATE" ? "Create Debt" : "Update Debt"}
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
          <ProFormText
            name="account"
            label="Account Number"
            placeholder="Nhập account number"
            rules={[{ required: true, message: "Account number là bắt buộc!" }]}
          />
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
        </Form>
      </Card>
    </Modal>
  );
};

export default CustomerForm;

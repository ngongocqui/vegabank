import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { createAccount } from "services/account";
import { registerUser } from "services/auth";

const CreateAccountForm = (props) => {
  const [form] = Form.useForm();
  const state = useReactive(props.state);

  const onSubmit = async () => {
    const [err] = await to(form.validateFields());
    if (err && Array.isArray(err.errorFields)) {
      err.errorFields.forEach((it) => {
        message.error(it?.errors?.[0] || "");
      });
      return;
    }

    const [err_1] = await to(
      createAccount({
        customerId: props.state.data?.id,
        type: form.getFieldValue("type"),
        balance: form.getFieldValue("balance"),
      })
    );

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }
    message.success("Tạo account thành công");
    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Create Account"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormSelect
            name="type"
            label="Type"
            placeholder="Chọn type"
            rules={[{ required: true, message: "Type là bắt buộc!" }]}
            request={() => [
              { label: "PAYROLL", value: "PAYROLL" },
              { label: "SAVING", value: "SAVING" },
            ]}
          />
          <ProFormDigit
            name="balance"
            label="Ballance"
            placeholder="Nhập balance"
            rules={[{ required: true, message: "Balance là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateAccountForm;

import { ProFormText } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Card, Form, message, Modal } from "antd";
import to from "await-to-js";
import { updateBalace } from "services/debt";
const SendOTPDebt = (props) => {
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
      updateBalace(state.id, {
        code: form.getFieldValue("code"),
      })
    );

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }

    message.success("Chuyển tiền thành công");
    onCancel();
    await props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Nhập mã OTP"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormText
            name="code"
            label="Mã OTP"
            placeholder="Nhập otp"
            rules={[{ required: true, message: "Mã otp là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default SendOTPDebt;

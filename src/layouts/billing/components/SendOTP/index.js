import { ProFormText } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Card, Form, message, Modal } from "antd";
import to from "await-to-js";
import { useSelector } from "react-redux";
import { sendMail } from "services/transaction";
import { accountInfo } from "slices/accountSlice";
import { customerInfo } from "slices/customerSlice";

const SendOTP = (props) => {
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

    const [err_1] = await to(sendMail(state.id, {
      code: form.getFieldValue("code")
    }));

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }

    message.success("Nạp tiền thành công");
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
        <Form form={form} layout='vertical'>
          <ProFormText
            name="code"
            label="Mã OTP"
            placeholder="Nhập otp"
            rules={[
              { required: true, message: "Mã otp là bắt buộc!" },
            ]}
          />
        </Form>
      </Card>
    </Modal>
  )
};

export default SendOTP;
import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { createAccount } from "services/account";
import { registerUser } from "services/auth";
import { cancelDebt } from "services/debt";

const CancelDebt = (props) => {
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
      cancelDebt(props.state.data._id, {
        cancelReason: form.getFieldValue("reason"),
      })
    );

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }
    message.success("Huỷ thành công");
    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Cancel Debt"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormTextArea
            name="reason"
            label="Reason"
            placeholder="Nhập reason"
            rules={[{ required: true, message: "Reason là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default CancelDebt;

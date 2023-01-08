import { ProFormText } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { useEffect } from "react";
import { registerUser } from "services/auth";
import { updateReceiver } from "services/receiver";
import { createReceiver } from "services/receiver";

const CustomerForm = (props) => {
  const [form] = Form.useForm();
  const state = useReactive(props.state);

  useEffect(() => {
    if (props.type === "CREATE") {
      form.setFieldsValue({
        name: "",
        account: "",
      });
    } else {
      form.setFieldsValue({
        name: props.state.data?.remindName,
        account: props.state.data?.accountNumber,
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
        createReceiver({
          remindName: form.getFieldValue("name"),
          accountNumber: form.getFieldValue("account"),
        })
      );

      if (err_1) {
        message.error(err_1?.response?.data?.message || err_1.message);
        return;
      }
      message.success("Tạo receiver thành công");
    } else if (state.type === "UPDATE") {
      const [err_1] = await to(
        updateReceiver(state?.data?._id, {
          remindName: form.getFieldValue("name"),
          accountNumber: form.getFieldValue("account"),
        })
      );

      if (err_1) {
        message.error(err_1?.response?.data?.message || err_1.message);
        return;
      }
      message.success("Cập nhật receiver thành công");
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
      title={state.type === "CREATE" ? "Create Receiver" : "Update Receiver"}
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormText
            name="name"
            label="Name"
            placeholder="Nhập name"
            rules={[{ required: true, message: "Name là bắt buộc!" }]}
          />
          <ProFormText
            name="account"
            label="Account Number"
            placeholder="Nhập account number"
            rules={[{ required: true, message: "Account number là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default CustomerForm;

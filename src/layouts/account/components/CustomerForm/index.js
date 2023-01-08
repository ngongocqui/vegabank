import { ProFormText } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { registerUser } from "services/auth";

const CustomerForm = (props) => {
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
      registerUser({
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
        name: form.getFieldValue("name"),
      })
    );

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }
    message.success("Đăng kí thành công");
    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Create Customer"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormText
            name="email"
            label="Email"
            placeholder="Nhập email"
            rules={[
              { required: true, message: "Email là bắt buộc!" },
              {
                validator: (rule, value, callback) => {
                  if (!value) return callback();
                  const reg = new RegExp(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
                    "i"
                  );
                  if (value.length !== 0 && !reg.test(value))
                    return callback("Email không đúng định dạng!");
                  return callback();
                },
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            label="Password"
            placeholder="Nhập password"
            rules={[{ required: true, message: "Password là bắt buộc!" }]}
          />
          <ProFormText
            name="name"
            label="Name"
            placeholder="Nhập name"
            rules={[{ required: true, message: "Name là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default CustomerForm;

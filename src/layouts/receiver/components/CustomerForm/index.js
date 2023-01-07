import { ProFormText } from '@ant-design/pro-components';
import { useReactive } from 'ahooks';
import { Modal, Form, Card, message } from 'antd';
import to from 'await-to-js';
import { registerUser } from 'services/auth';
import { createReceiver } from 'services/receiver';

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

    const [err_1] = await to(createReceiver({
      remindName: form.getFieldValue("name"),
      accountNumber: form.getFieldValue("account"),
    }));

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
      return;
    }
    message.success("Tạo receiver thành công");
    onCancel();
    props.reload?.();
  };

  const onCancel = () => {
    state.visible = false;
    form.resetFields();
  };

  return (
    <Modal
      title="Create Receiver"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout='vertical'>
          <ProFormText
            name="name"
            label="Name"
            placeholder="Nhập name"
            rules={[
              { required: true, message: "Name là bắt buộc!" },
            ]}
          />
          <ProFormText
            name="account"
            label="Account Number"
            placeholder="Nhập account number"
            rules={[
              { required: true, message: "Account number là bắt buộc!" },
            ]}
          />
        </Form>
      </Card>
    </Modal>
  )
};

export default CustomerForm;
import { ProFormDigit, ProFormSelect } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { getAccount } from "services/account";
import { updateBalance } from "services/account";

const NapTienForm = (props) => {
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
      updateBalance(form.getFieldValue("account"), {
        balance: form.getFieldValue("balance"),
      })
    );

    if (err_1) {
      message.error(err_1?.response?.data?.message || err_1.message);
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
      title="Nạp Tiền"
      open={state.visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Card>
        <Form form={form} layout="vertical">
          <ProFormSelect
            name="account"
            label="Account Number"
            placeholder="Chọn account number"
            rules={[{ required: true, message: "Account number là bắt buộc!" }]}
            showSearch
            request={async () => {
              const res = await getAccount();
              return res?.data?.map((it) => ({
                label: it.accountNumber,
                value: it.id,
              }));
            }}
          />
          <ProFormDigit
            name="balance"
            label="Balance"
            placeholder="Nhập balance"
            rules={[{ required: true, message: "Balance là bắt buộc!" }]}
          />
        </Form>
      </Card>
    </Modal>
  );
};

export default NapTienForm;

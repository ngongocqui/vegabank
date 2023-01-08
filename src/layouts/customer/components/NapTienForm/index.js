import { ProFormDigit, ProFormSelect } from "@ant-design/pro-components";
import { useReactive } from "ahooks";
import { Modal, Form, Card, message } from "antd";
import to from "await-to-js";
import { getAccountFindOne } from "services/account";
import { updateBalance } from "services/account";
import { getCustomerFindOne } from "services/customer";
import { getCustomer } from "services/customer";

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

    const [err_2, res_2] = await to(
      getAccountFindOne(form.getFieldValue("email"))
    );
    const accounts = res_2?.data?.data || [];
    if (err_2) {
      message.error(err_2?.response?.data?.message || err_2.message);
      return;
    }

    if (accounts?.length === 0) {
      message.error("Không lấy được tài khoản!");
      return;
    }

    const [err_1] = await to(
      updateBalance(accounts[0]?.id, {
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
            name="email"
            label="Email"
            placeholder="Chọn email"
            rules={[{ required: true, message: "Email là bắt buộc!" }]}
            showSearch
            request={async () => {
              const res = await getCustomer();
              return res?.data?.map((it) => ({
                label: it.email,
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

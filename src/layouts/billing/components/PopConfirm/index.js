import { useReactive } from "ahooks";
import { Button, message, Popconfirm } from "antd";
import { closeAccount } from "services/account";

const CloseAccount = (props) => {
  const state = useReactive({
    visible: false,
  });

  return (
    <Popconfirm
      title="Đóng tài khoản"
      open={state.visible}
      onConfirm={async () => {
        await closeAccount(props.id);
        state.visible = false;
        message.success("Bạn đã đóng tài khoản");
      }}
      onCancel={() => (state.visible = false)}
    >
      <Button onClick={() => (state.visible = true)}>Đóng tài khoản</Button>
    </Popconfirm>
  );
};

export default CloseAccount;

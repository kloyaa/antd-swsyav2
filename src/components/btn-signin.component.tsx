import { Button } from 'antd';

interface IBtnSignIn {
  isLoading: boolean;
}

export const BtnSignIn = ({ isLoading }: IBtnSignIn) => {
  return (
    <Button
      type="primary"
      size="middle"
      loading={isLoading}
      style={{ marginTop: 20 }}
      htmlType="submit"
      block
    >
      Sign in
    </Button>
  );
};

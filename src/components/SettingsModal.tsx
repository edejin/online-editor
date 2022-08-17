import React, {useCallback} from 'react';
import {Form, Input, InputNumber, Modal} from 'antd';
import {observer} from 'mobx-react';
import {store} from '../store';

interface Props {
  handleCancel: () => void;
  handleOk: () => void;
  isModalVisible: boolean;
}

interface SettingsFormRecord {
  delay: number;
  func: string;
}

export const SettingsModal: React.FC<Props> = observer((props: Props) => {
  const [form] = Form.useForm();

  const {
    loopProtectionDelay,
    loopProtectionFunction
  } = store;

  const {
    isModalVisible,
    handleCancel,
    handleOk
  } = props;

  const onFinish = ({delay, func}: SettingsFormRecord) => {
    store.updateLoopProtectionProps(delay, func);
  }

  const handleOkInternal = useCallback(() => {
    form.submit();
    handleOk();
  }, [handleOk, form]);

  return (
    <Modal title="Settings" visible={isModalVisible} onOk={handleOkInternal} onCancel={handleCancel}>
      <Form<SettingsFormRecord>
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ delay: loopProtectionDelay, func: loopProtectionFunction }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Loop delay"
          name="delay"
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Loop error function"
          name="func"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
});

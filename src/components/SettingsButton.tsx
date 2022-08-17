import React, {useState} from 'react';
import {Button} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import {SettingsModal} from './SettingsModal';

export const SettingsButton = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const openModalHandler = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Button type="primary" title="Settings" onClick={openModalHandler}><SettingOutlined/></Button>
      <SettingsModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel}/>
    </>
  );
}

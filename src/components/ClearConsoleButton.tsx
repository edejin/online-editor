import React from 'react';
import {Button} from 'antd';
import {ClearOutlined} from '@ant-design/icons';
import {store} from '../store';

export const ClearConsoleButton = () => (
  <Button type="primary" onClick={() => store.clearConsole()} title="Console clear">
    <ClearOutlined />
  </Button>
);

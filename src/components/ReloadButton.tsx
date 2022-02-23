import React from 'react';
import {Button} from 'antd';
import {store} from '../store';
import {ReloadOutlined} from '@ant-design/icons';

export const ReloadButton = () => (
  <Button
    title="Refresh"
    type="primary"
    onClick={() => store.reloadIFrame()}
  >
    <ReloadOutlined/>
  </Button>
);

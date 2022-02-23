import React from 'react';
import {Button, Popconfirm} from 'antd';
import {store} from '../store';
import {FileAddOutlined} from '@ant-design/icons';

export const CreateButton = () => (
  <Popconfirm
    title="Are you sure?"
    onConfirm={() => store.reinit()}
    okText="Yes"
    cancelText="No"
  >
    <Button type="primary" title="Create new sandbox">
      <FileAddOutlined />
    </Button>
  </Popconfirm>
);

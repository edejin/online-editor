import React from 'react';
import {Button} from 'antd';
import {downloadFile} from '../cmd/downloadFile';
import {CloudDownloadOutlined} from '@ant-design/icons';
import {observer} from 'mobx-react';
import {store} from '../store';

export const DownloadButton = observer(() => {
  const {
    fileContent
  } = store;
  return (
    <Button
      title="Download"
      type="primary"
      onClick={() => fileContent.then((d) => downloadFile('text/html', 'file.html', d))}>
      <CloudDownloadOutlined/>
    </Button>
  );
});

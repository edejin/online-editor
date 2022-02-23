import React from 'react';
import {observer} from 'mobx-react';
import {Layout} from 'antd';
import {store} from '../store';
import {CreateButton} from './CreateButton';
import {DownloadButton} from './DownloadButton';
import {ReloadButton} from './ReloadButton';
import {ButtonGroup} from './ButtonGroup';
import {ClearConsoleButton} from './ClearConsoleButton';

const {Header} = Layout;

export const Head: React.FC = observer(() => {
  const {
    topPanelFields
  } = store;

  return (
    <Header>
      <ButtonGroup
        before={(<CreateButton/>)}
        after={(<>
          <DownloadButton/>
          <ReloadButton/>
          <ClearConsoleButton/>
        </>)}
        fields={topPanelFields}
      />
    </Header>
  );
});

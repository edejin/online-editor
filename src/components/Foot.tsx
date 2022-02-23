import React from 'react';
import {Layout} from 'antd';
import {observer} from 'mobx-react';
import {store} from '../store';
import {ButtonGroup} from './ButtonGroup';

const {Footer} = Layout;

export const Foot = observer(() => {
  const {
    bottomPanelFields
  } = store;

  return (
    <Footer>
      <ButtonGroup
        fields={bottomPanelFields}
        top={false}
      />
    </Footer>
  );
});

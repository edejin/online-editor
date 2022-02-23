import React from 'react';
import {observer} from 'mobx-react';
import {Button, Typography} from 'antd';
import {FieldTypes, store} from '../store';
import {styleByType} from '../cmd/styleByType';

const {Text} = Typography;

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

export const HTMLButton = observer(() => {
  const {
    showHtml,
    htmlChanged
  } = store;

  return (
    <Button
      draggable="true"
      type={styleByType(showHtml)}
      onClick={() => store.setShowHtml(!showHtml)}
      onDrag={() => dragHandler(FieldTypes.HTML)}
      onDragEnd={() => dragHandler()}
    >
      <Text strong={htmlChanged}>HTML</Text>
    </Button>
  );
});

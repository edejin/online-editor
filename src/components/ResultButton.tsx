import React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'antd';
import {FieldTypes, store} from '../store';
import {styleByType} from '../cmd/styleByType';

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

export const ResultButton = observer(() => {
  const {showOut} = store;

  return (
    <Button
      draggable="true"
      type={styleByType(showOut)}
      onClick={() => store.setShowOut(!showOut)}
      onDrag={() => dragHandler(FieldTypes.RESULT)}
      onDragEnd={() => dragHandler()}
    >
      Result
    </Button>
  );
});

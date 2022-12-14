import React from 'react';
import {observer} from 'mobx-react';
import {Badge, Button} from 'antd';
import {FieldTypes, store} from '../store';
import {styleByType} from '../cmd/styleByType';

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

export const ConsoleButton = observer(() => {
  const {showConsole, console} = store;

  return (
    <Button
      draggable="true"
      type={styleByType(showConsole)}
      onClick={() => store.setShowConsole(!showConsole)}
      onDrag={() => dragHandler(FieldTypes.CONSOLE)}
      onDragEnd={() => dragHandler()}
    >
      <Badge dot={!!console.length}>Console</Badge>
    </Button>
  );
});

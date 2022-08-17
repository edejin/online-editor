import React from 'react';
import {Badge, Button, Dropdown, Menu} from 'antd';
import {FieldTypes, JsTypes, JsTypesNames, store} from '../store';
import {observer} from 'mobx-react';
import {styleByType} from '../cmd/styleByType';

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

const JsMenu = (
  <Menu onClick={({key}) => store.setJsType(key as JsTypes)}>
    {/*// @ts-ignore*/}
    {Object.keys(JsTypes).map((k: any) => (<Menu.Item key={JsTypes[k]}>{JsTypesNames[JsTypes[k]]}</Menu.Item>))}
  </Menu>
);

export const ScriptButton = observer(() => {
  const {
    showJs,
    jsChanged,
    jsType
  } = store;

  return (
    <Dropdown overlay={JsMenu}>
      <Button
        draggable="true"
        type={styleByType(showJs)}
        onClick={() => store.setShowJs(!showJs)}
        onDrag={() => dragHandler(FieldTypes.SCRIPT)}
        onDragEnd={() => dragHandler()}
      >
        <Badge dot={jsChanged}>{JsTypesNames[jsType]}</Badge>
      </Button>
    </Dropdown>
  );
});

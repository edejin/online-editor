import React from 'react';
import {Button, Dropdown, Menu, Typography} from 'antd';
import {FieldTypes, JsTypes, JsTypesNames, store} from '../store';
import {observer} from 'mobx-react';
import {styleByType} from '../cmd/styleByType';

const {Text} = Typography;

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
        <Text strong={jsChanged}>{JsTypesNames[jsType]}</Text>
      </Button>
    </Dropdown>
  );
});

import React from 'react';
import {observer} from 'mobx-react';
import {Badge, Button, Dropdown, Menu} from 'antd';
import {FieldTypes, store, StyleTypes, StyleTypesNames} from '../store';
import {styleByType} from '../cmd/styleByType';

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

const StyleMenu = (
  <Menu onClick={({key}) => store.setCssType(key as StyleTypes)}>
    {/*// @ts-ignore*/}
    {Object.keys(StyleTypes).map((k: any) => (<Menu.Item key={StyleTypes[k]}>{StyleTypesNames[StyleTypes[k]]}</Menu.Item>))}
  </Menu>
);

export const StyleButton = observer(() => {
  const {showCss, cssChanged, cssType} = store;

  return (
    <Dropdown overlay={StyleMenu}>
      <Button
        draggable="true"
        type={styleByType(showCss)}
        onClick={() => store.setShowCss(!showCss)}
        onDrag={() => dragHandler(FieldTypes.STYLE)}
        onDragEnd={() => dragHandler()}
      >
        <Badge dot={cssChanged}>{StyleTypesNames[cssType]}</Badge>
      </Button>
    </Dropdown>
  );
});

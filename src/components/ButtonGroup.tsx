import React, {ReactElement} from 'react';
import {FieldTypes, JsTypes, JsTypesNames, store, StyleTypes, StyleTypesNames} from '../store';
import {Button, Dropdown, Menu, Typography} from 'antd';
import {DropDivider} from './DropDivider';
import styled from 'styled-components';
import {observer} from 'mobx-react';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const t = (v: boolean) => v ? 'primary' : 'default';

const dragHandler = (t?: FieldTypes) => {
  store.setDrag(t);
}

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-btn + .custom-drop-divider + .ant-btn {
    border-left: 0;
  }
`;
const {Text} = Typography;

const Group = styled(Button.Group)`
  &>.ant-btn:last-child:not(:first-child),
  &>span:last-child:not(:first-child)>.ant-btn {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  &>.ant-btn:first-child:not(:last-child),
  &>span:first-child:not(:last-child)>.ant-btn {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
`;

interface Props {
  before?: ReactElement;
  after?: ReactElement;
  fields: FieldTypes[];
  top?: boolean;
}

export const ButtonGroup: React.FC<Props> = observer((props: Props) => {
  const {
    before = (<Button type="primary">&nbsp;</Button>),
    after = (<Button type="primary">&nbsp;</Button>),
    fields,
    top = true
  } = props;

  const {
    showOut,
    showJs,
    showCss,
    showHtml,
    showConsole,
    cssType,
    jsType,
    console,
    cssChanged,
    jsChanged,
    htmlChanged,
  } = store;

  const StyleMenu = (
    <Menu onClick={({key}) => store.setCssType(key as StyleTypes)}>
      {/*// @ts-ignore*/}
      {Object.keys(StyleTypes).map((k: any) => (<Menu.Item key={StyleTypes[k]}>{StyleTypesNames[StyleTypes[k]]}</Menu.Item>))}
    </Menu>
  );

  const JsMenu = (
    <Menu onClick={({key}) => store.setJsType(key as JsTypes)}>
      {/*// @ts-ignore*/}
      {Object.keys(JsTypes).map((k: any) => (<Menu.Item key={JsTypes[k]}>{JsTypesNames[JsTypes[k]]}</Menu.Item>))}
    </Menu>
  );

  return (
    <HeaderWrapper>
      <ButtonsWrapper>
        <Group>
          {before}
          {fields.map((v: FieldTypes) => {
            switch (v) {
              case FieldTypes.HTML:
                return (
                  <Button
                    key={v}
                    draggable="true"
                    type={t(showHtml)}
                    onClick={() => store.setShowHtml(!showHtml)}
                    onDrag={() => dragHandler(FieldTypes.HTML)}
                    onDragEnd={() => dragHandler()}
                  >
                    <Text strong={htmlChanged}>HTML</Text>
                  </Button>
                );
              case FieldTypes.STYLE:
                return (
                  <Dropdown key={v} overlay={StyleMenu}>
                    <Button
                      draggable="true"
                      type={t(showCss)}
                      onClick={() => store.setShowCss(!showCss)}
                      onDrag={() => dragHandler(FieldTypes.STYLE)}
                      onDragEnd={() => dragHandler()}
                    >
                      <Text strong={cssChanged}>{StyleTypesNames[cssType]}</Text>
                    </Button>
                  </Dropdown>
                );
              case FieldTypes.SCRIPT:
                return (
                  <Dropdown key={v} overlay={JsMenu}>
                    <Button
                      draggable="true"
                      type={t(showJs)}
                      onClick={() => store.setShowJs(!showJs)}
                      onDrag={() => dragHandler(FieldTypes.SCRIPT)}
                      onDragEnd={() => dragHandler()}
                    >
                      <Text strong={jsChanged}>{JsTypesNames[jsType]}</Text>
                    </Button>
                  </Dropdown>
                );
              case FieldTypes.CONSOLE:
                return (
                  <Button
                    key={v}
                    draggable="true"
                    type={t(showConsole)}
                    onClick={() => store.setShowConsole(!showConsole)}
                    onDrag={() => dragHandler(FieldTypes.CONSOLE)}
                    onDragEnd={() => dragHandler()}
                  >
                    <Text strong={!!console.length}>Console</Text>
                  </Button>
                );
              case FieldTypes.RESULT:
                return (
                  <Button
                    key={v}
                    draggable="true"
                    type={t(showOut)}
                    onClick={() => store.setShowOut(!showOut)}
                    onDrag={() => dragHandler(FieldTypes.RESULT)}
                    onDragEnd={() => dragHandler()}
                  >
                    <Text>Result</Text>
                  </Button>
                );
            }
            return null;
          }).map((e, index) => (
            <React.Fragment key={fields[index]}>
              <DropDivider before={fields[index]} top={top}/>
              {e}
            </React.Fragment>
          ))}
          <DropDivider before={FieldTypes.END} top={top}/>
          {after}
        </Group>
      </ButtonsWrapper>
    </HeaderWrapper>
  );
});

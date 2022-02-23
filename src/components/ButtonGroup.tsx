import React, {ReactElement} from 'react';
import {FieldTypes} from '../store';
import {Button} from 'antd';
import {DropDivider} from './DropDivider';
import styled from 'styled-components';
import {HTMLButton} from './HTMLButton';
import {StyleButton} from './StyleButton';
import {ScriptButton} from './ScriptButton';
import {ConsoleButton} from './ConsoleButton';
import {ResultButton} from './ResultButton';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-btn + .custom-drop-divider + .ant-btn {
    border-left: 0;
  }
`;

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

export const ButtonGroup: React.FC<Props> = (props: Props) => {
  const {
    before = (<Button type="primary">&nbsp;</Button>),
    after = (<Button type="primary">&nbsp;</Button>),
    fields,
    top = true
  } = props;

  return (
    <HeaderWrapper>
      <ButtonsWrapper>
        <Group>
          {before}
          {fields.map((v: FieldTypes) => {
            switch (v) {
              case FieldTypes.HTML:
                return (
                  <HTMLButton key={v}/>
                );
              case FieldTypes.STYLE:
                return (
                  <StyleButton key={v}/>
                );
              case FieldTypes.SCRIPT:
                return (
                  <ScriptButton key={v}/>
                );
              case FieldTypes.CONSOLE:
                return (
                  <ConsoleButton key={v}/>
                );
              case FieldTypes.RESULT:
                return (
                  <ResultButton key={v}/>
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
};

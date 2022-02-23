import React, {DragEvent, useCallback, useState} from 'react';
import styled, {css} from 'styled-components';
import {observer} from 'mobx-react';
import {FieldTypes, store} from '../store';

interface Propz {
  drag: boolean;
  over: boolean;
}

const DropDividerElement = styled.div<Propz>`
  ${({drag}: Propz) => css`pointer-events: ${drag ? 'all' : 'none'};`}
  ${({over}: Propz) => css`width: ${over ? '30px' : '0'};`}
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  transition: width 500ms;
  
  &::before {
    content: '';
    width: 30px;
    flex: 0 0 30px;
    height: 100%;
  }
`;

interface Props {
  before: FieldTypes;
  top: boolean;
}

export const DropDivider: React.FC<Props> = observer(({before, top}: Props) => {
  const {
    drag
  } = store;
  const [over, setOver] = useState(false);
  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(true);
  };
  const dragLeaveHandler = () => {
    setOver(false);
  };
  const dropHandler = useCallback(() => {
    if (drag && drag !== before) {
      store.reorder(top, drag, before);
    }
    setOver(false);
  }, [drag, before, top]);
  return (
    <DropDividerElement
      className="custom-drop-divider"
      drag={!!drag}
      over={over}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    />
  );
});

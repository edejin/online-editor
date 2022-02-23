import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';

interface ResizerProps {
  vertical?: boolean;
}

export const ResizerSize = 5;

const Resizer = styled.div<ResizerProps>`
  flex: 0 0 ${ResizerSize}px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px;
  ${({vertical}: ResizerProps) => vertical ? css`
    flex-direction: column;
    height: ${ResizerSize}px;
    cursor: row-resize;
  ` : css`
    width: ${ResizerSize}px;
    cursor: col-resize;
  `}

  &::after,
  &::before {
    content: '';
    display: block;
    ${({vertical}: ResizerProps) => vertical ? css`width: 16px;height: 1px;` : css`width: 1px;height: 16px;`}
    
    flex: 0 0 1px;
    background: #8f8f8f;
  }
`;

interface Props {
  vertical?: boolean;
  cb: ({x, y}: {x: number, y: number}) => void;
}

export const ResizerElement: React.FC<Props> = (props: Props) => {
  const {
    vertical = false,
    cb
  } = props;
  const [moveState, setMoveState] = useState(false);
  const [pos, setPos] = useState({clientX: 0, clientY: 0});
  const resizer = useRef();
  const down: (e: MouseEvent) => any = ({target, clientX, clientY}) => {
    if (target === resizer.current) {
      setMoveState(true);
      setPos({
        clientX,
        clientY
      });
    }
  };
  const up = () => {
    setMoveState(false);
  };
  const move: (e: MouseEvent) => any = useCallback(({clientX, clientY}) => {
    const x = clientX - pos.clientX;
    const y = clientY - pos.clientY;
    setPos({
      clientX,
      clientY
    });
    cb({
      x,
      y
    });
  }, [cb, pos]);

  useEffect(() => {
    window.addEventListener('mousedown', down);

    return () => {
      window.removeEventListener('mousedown', down);
    };
  }, []);
  useEffect(() => {
    if (moveState) {
      window.addEventListener('mouseup', up);

      return () => {
        window.removeEventListener('mouseup', up);
      };
    }
  }, [moveState]);
  useEffect(() => {
    if (moveState) {
      const f = (e: MouseEvent) => move(e);
      window.addEventListener('mousemove', f);

      return () => {
        window.removeEventListener('mousemove', f);
      };
    }
  }, [moveState, move]);
  return (
    <Resizer vertical={vertical} ref={resizer as any}/>
  )
};

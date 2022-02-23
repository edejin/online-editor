import React, {useCallback, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import styled, {css} from 'styled-components';
import {store} from '../store';
import {ResizerElement, ResizerSize} from './ResizerElement';

interface Propz {
  events: boolean;
}

const FrameWrapper = styled.div<Propz>`
  ${({events}) => css`pointer-events: ${events ? 'initial' : 'none'}`};
  display: flex;
`;

const ResultFrame = styled.iframe`
  flex: 0 0 calc(100% - ${ResizerSize}px);
  border: 0;
  background: #ffffff;
  width: calc(100% - ${ResizerSize}px);
`;

interface Props {
  index: number;
  top?: boolean;
}

export const Out: React.FC<Props> = observer(({index, top}: Props) => {
  const {content, topWidths, bottomWidths, reloadTrigger} = store;
  const [downState, setDownState] = useState(false);
  const [data, setData] = useState('');
  const iframe = useRef<HTMLIFrameElement>();
  useEffect(() => {
    if (iframe.current) {
      iframe.current.src += '';
    }
  }, [reloadTrigger]);
  useEffect(() => {
    let wait = true;
    content.then((css) => {
      if (wait) {
        setData(encodeURIComponent(css));
      }
    });
    return () => {
      wait = false;
    };
  }, [content]);
  const down: (e: MouseEvent) => any = ({target, clientX, clientY}) => {
    setDownState(true);
  };
  const up = () => {
    setDownState(false);
  };
  const resizerCallback = useCallback(({x}) => {
    if (top) {
      store.setTopWidthByIndex(index, x);
    } else {
      store.setBottomWidthByIndex(index, x);
    }
  }, [top, index]);
  useEffect(() => {
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);
  return (
    <FrameWrapper events={!downState} style={{flex: `0 0 ${(top ? topWidths : bottomWidths)[index].toFixed(2)}px`}}>
      <ResultFrame
        src={`data:text/html;charset=utf-8, ${data}`}
        ref={iframe as any}
      />
      <ResizerElement cb={resizerCallback}/>
    </FrameWrapper>
  );
});

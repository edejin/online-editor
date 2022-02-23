import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import {store} from '../store';

const Wrapper = styled.div`
  width: 0;
  height: 0;
`;

const Iframe = styled.iframe`
  height: 1px;
  width: 1px;
  position: fixed;
  left: -1px;
  top: -1px;
  border: 0;
`;

export const HiddenIframe: React.FC = observer(() => {
  const {showOut, content, reloadTrigger} = store;
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
  if (showOut) {
    return null;
  }
  return (
    <Wrapper>
      <Iframe src={`data:text/html;charset=utf-8, ${data}`} ref={iframe as any}/>
    </Wrapper>
  );
});

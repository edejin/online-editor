import React, {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {store} from '../store';
import {Layout} from 'antd';
import {observer} from 'mobx-react';
import {ConsoleNotifications} from './ConsoleNotifications';
import {PanelsGroup} from './PanelsGroup';

const {Content} = Layout;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
`;

export const Body: React.FC = observer(() => {
  const wrapper = useRef<HTMLDivElement>();

  const {
    showConsole,
    topPanelFields,
    bottomPanelFields,
    topColumnCount,
    bottomColumnCount,
    topHeight,
    bottomHeight
  } = store;

  const getSize = useCallback(() => {
    if (wrapper.current) {
      // const newWidth = wrapper.current.clientWidth;
      const newWidth = window.innerWidth;
      const newHeight = wrapper.current.clientHeight;
      store.setSize(newWidth, newHeight);
    }
  }, [wrapper]);

  useEffect(() => {
    const f = () => getSize();
    f();
    window.addEventListener('DOMContentLoaded', f);
    window.addEventListener('resize', f);
    return () => {
      window.removeEventListener('DOMContentLoaded', f);
      window.removeEventListener('resize', f);
    };
  }, [getSize]);

  return (
    <Layout>
      <Content>
        <Wrapper ref={wrapper as any}>
          {topColumnCount ? (
            <PanelsGroup top={true} fields={topPanelFields} height={topHeight}/>
          ) : null}
          {bottomColumnCount ? (
            <PanelsGroup top={false} fields={bottomPanelFields} height={bottomHeight}/>
          ) : null}
        </Wrapper>
      </Content>
      <ConsoleNotifications show={showConsole}/>
    </Layout>
  );
});

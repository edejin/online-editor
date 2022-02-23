import React from 'react';
import {Layout} from 'antd';

import {Body} from './components/Body';
import {Head} from './components/Head';
import {createGlobalStyle} from 'styled-components';
import {Foot} from './components/Foot';

const GlobalStyle = createGlobalStyle`
  #root {
    height: 100%;
    display: flex;
  }
`;

export const App = () => {
  return (
    <Layout>
      <GlobalStyle/>
      <Head/>
      <Body/>
      <Foot/>
    </Layout>
  );
};

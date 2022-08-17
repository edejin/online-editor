import React from 'react';
import styled from 'styled-components';
import {Badge} from 'antd';
import {BadgeProps} from 'antd/lib/badge';

export const CustomRibbon = styled(Badge.Ribbon)<BadgeProps>`
  opacity: 0.7;
  padding-right: 32px;
  transition: opacity 1s;
  pointer-events: none;
`;
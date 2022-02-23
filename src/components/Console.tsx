import React, {useCallback} from 'react';
import {Space, Timeline, Typography} from 'antd';
import {observer} from 'mobx-react';
import {store} from '../store';
import styled from 'styled-components';
import {BaseType} from 'antd/lib/typography/Base';
import moment from 'moment';
import { red, orange, grey, green } from '@ant-design/colors';
import {ResizerElement} from './ResizerElement';

const { Text } = Typography;

export enum MessageTypes {
  log= 'log',
  info = 'info',
  warn = 'warn',
  error = 'error',
  clear = 'clear',
  infinityLoopError = 'infinityLoopError'
}

export interface ConsoleMessage {
  data: any;
  type: MessageTypes;
  date?: number;
}

const ConsoleWrapper = styled.div`
  display: flex;
  overflow: auto;
`;

const ConsoleHolder = styled.div`
  flex: 1 1 auto;
  padding: 16px;
  overflow: auto;
  display: flex;
  
  & > * {
    flex: 1 1 auto;
  }
`;

interface Props {
  index: number;
  top: boolean;
}

const typeTransformer = (t: MessageTypes): BaseType | undefined => {
  switch (t) {
    case MessageTypes.error:
      return 'danger';
    case MessageTypes.warn:
      return 'warning';
    case MessageTypes.info:
      return 'secondary';
    case MessageTypes.log:
    default:
      return 'success';
  }
}

const typeToColorTransformer = (t: MessageTypes): string => {
  switch (t) {
    case MessageTypes.error:
      return red.primary!;
    case MessageTypes.warn:
      return orange.primary!;
    case MessageTypes.info:
      return grey.primary!;
    case MessageTypes.log:
    default:
      return green.primary!;
  }
}

export const Console: React.FC<Props> = observer(({index, top}: Props) => {
  const {topWidths, console, bottomWidths} = store;
  const resizerCallback = useCallback(({x}) => {
    if (top) {
      store.setTopWidthByIndex(index, x);
    } else {
      store.setBottomWidthByIndex(index, x);
    }
  }, [top, index])
  return (
    <ConsoleWrapper style={{flex: `0 0 ${(top ? topWidths : bottomWidths)[index]}px`}}>
      <ConsoleHolder>
        <Timeline>
          {console.map(({data, type, date}) => {
            const d = JSON.stringify(data);
            const label = moment(date).format('HH:mm:ss.SSS');
            return (
              <Timeline.Item color={typeToColorTransformer(type)} key={d}>
                <Space align={'start'}>
                  <Text style={{whiteSpace: 'nowrap'}}>{label}</Text>
                  <Text type={typeTransformer(type)}>{d}</Text>
                </Space>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </ConsoleHolder>
      <ResizerElement cb={resizerCallback}/>
    </ConsoleWrapper>
  );
});

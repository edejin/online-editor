import React, {useEffect} from 'react';
import {notification} from 'antd';
import {observer} from 'mobx-react';
import {store} from '../store';
import {ConsoleMessage, MessageTypes} from './Console';

interface Props {
  show: boolean;
}

export const ConsoleNotifications: React.FC<Props> = observer(({show}: Props) => {
  useEffect(() => {
    const l = (event: MessageEvent) => {
      if (event.origin === 'null') {
        const m = JSON.parse(event.data) as ConsoleMessage;
        const {type, data} = m;
        switch (type) {
          case MessageTypes.error:
            if (!show) {
              notification.error({
                message: 'Error',
                description: JSON.stringify(data)
              });
            }
            store.addToConsole(m);
            break;
          case MessageTypes.info:
            if (!show) {
              notification.info({
                message: 'Info',
                description: JSON.stringify(data)
              });
            }
            store.addToConsole(m);
            break;
          case MessageTypes.log:
            if (!show) {
              notification.success({
                message: 'Log',
                description: JSON.stringify(data)
              });
            }
            store.addToConsole(m);
            break;
          case MessageTypes.warn:
            if (!show) {
              notification.warn({
                message: 'Warn',
                description: JSON.stringify(data)
              });
            }
            store.addToConsole(m);
            break;
          case MessageTypes.infinityLoopError:
            notification.error({
              message: 'Possible infinty loop'
            });
            break;
          case MessageTypes.clear:
            if (!show) {
              notification.destroy();
            }
            store.clearConsole();
            break;
        }
      }
    };
    window.addEventListener('message', l);
    return () => {
      window.removeEventListener('message', l);
    };
  }, [show]);
  return null;
});

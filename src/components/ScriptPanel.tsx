import React from 'react';
import {observer} from 'mobx-react';
import {store} from '../store';
import {Editor} from './Editor';

interface Props {
  index: number;
  height: number;
  top: boolean;
}

export const ScriptPanel: React.FC<Props> = observer((props: Props) => {
  const {jsData, jsType} = store;
  return (
    <Editor
      data={jsData}
      setter={(v) => store.setJsData(v)}
      mode={jsType}
      {...props}
    />
  );
});

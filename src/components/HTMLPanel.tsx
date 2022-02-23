import React from 'react';
import {observer} from 'mobx-react';
import {store} from '../store';
import {Editor} from './Editor';

interface Props {
  index: number;
  height: number;
  top: boolean;
}

export const HTMLPanel: React.FC<Props> = observer((props: Props) => {
  const {htmlData} = store;
  return (
    <Editor
      data={htmlData}
      setter={(v) => store.setHtmlData(v)}
      mode="html"
      {...props}
    />
  );
});

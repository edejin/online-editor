import React from 'react';
import {observer} from 'mobx-react';
import {store} from '../store';
import {Editor} from './Editor';

interface Props {
  index: number;
  height: number;
  top: boolean;
}

export const StylePanel: React.FC<Props> = observer((props: Props) => {
  const {cssData, cssType} = store;
  return (
    <Editor
      data={cssData}
      setter={(v) => store.setCssData(v)}
      mode={cssType}
      {...props}
    />
  );
});

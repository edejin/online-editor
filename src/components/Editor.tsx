import React, {useCallback, useState} from 'react';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import {observer} from 'mobx-react';
import {store} from '../store';
import {ResizerElement, ResizerSize} from './ResizerElement';
import {CustomRibbon} from './CustomRibbon';

const EditorWrapper = styled.div`
  overflow: hidden;
  display: flex;

  &.focus, &:hover {
    .ant-ribbon {
      opacity: 0.2;
    }
  }
`;

const AceHolder = styled.div`
  flex: 1 1 auto;
`;

interface EditorProps {
  index: number;
  mode: string;
  data: string;
  setter: (v: string) => void;
  top: boolean;
  height: number;
}

export const Editor: React.FC<EditorProps> = observer((props: EditorProps) => {
  const {
    index,
    mode,
    data,
    setter,
    top,
    height
  } = props;
  const [focus, setFocus] = useState(false);
  const {topWidths, bottomWidths} = store;
  const resizeCallback = useCallback(({x}) => {
    if (top) {
      store.setTopWidthByIndex(index, x);
    } else {
      store.setBottomWidthByIndex(index, x);
    }
  }, [top, index])
  return (
    <EditorWrapper className={focus ? 'focus' : ''} style={{flex: `0 0 ${(top ? topWidths : bottomWidths)[index].toFixed(2)}px`}}>
      <CustomRibbon text={mode.toUpperCase()}>
        <AceHolder>
          <AceEditor
            mode={mode}
            theme="twilight"
            name={mode}
            value={data}
            onChange={setter}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            height={(height - ResizerSize).toFixed(2) + 'px'}
            width={((top ? topWidths : bottomWidths)[index] - ResizerSize).toFixed(2) + 'px'}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </AceHolder>
      </CustomRibbon>
      <ResizerElement cb={resizeCallback}/>
    </EditorWrapper>
  );
});

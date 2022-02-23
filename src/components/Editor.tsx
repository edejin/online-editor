import React, {useCallback, useState} from 'react';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import {observer} from 'mobx-react';
import {store} from '../store';
import {Tag} from 'antd';
import {ResizerElement, ResizerSize} from './ResizerElement';

const EditorWrapper = styled.div`
  overflow: hidden;
  display: flex;

  &.focus, &:hover {
    .tag-wrapper {
      opacity: 0.2;
    }
  }
`;

const TypeHolder = styled.div`
  position: relative;
  flex: 0 0 0;
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  pointer-events: none;
`;

const AceHolder = styled.div`
  flex: 1 1 auto;
`;

const TagWrapper = styled.div`
  position: absolute;
  z-index: 10;
  transition: opacity 1s;
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
      <TypeHolder>
        <TagWrapper className="tag-wrapper">
          <Tag color="magenta">{mode.toUpperCase()}</Tag>
        </TagWrapper>
      </TypeHolder>
      <ResizerElement cb={resizeCallback}/>
    </EditorWrapper>
  );
});

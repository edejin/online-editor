import React, {useCallback} from 'react';
import styled from 'styled-components';
import {FieldTypes, store} from '../store';
import {Editor} from './Editor';
import {Console} from './Console';
import {Out} from './Out';
import {observer} from 'mobx-react';
import {ResizerElement, ResizerSize} from './ResizerElement';

interface Props {
  top: boolean;
  fields: FieldTypes[];
  height: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 0 0 calc(100% - ${ResizerSize}px);
`;

export const PanelsGroup: React.FC<Props> = observer(({fields, top, height}: Props) => {
  const resizerCallback = useCallback(({y}) => {
    if (top) {
      store.changeTopHeight(y);
    }
  }, [top]);
  const {
    showJs,
    showCss,
    showHtml,
    showOut,
    showConsole,
    cssType,
    jsType,
    htmlData,
    cssData,
    jsData,
  } = store;

  let index = 0;
  return (
    <Wrapper style={{flex: `0 0 ${height.toFixed(2)}px`}}>
      <InnerWrapper>
        {
          fields.map((v: FieldTypes) => {
            switch (v) {
              case FieldTypes.HTML:
                if (showHtml) {
                  return (
                    <Editor
                      index={index++}
                      data={htmlData}
                      setter={(v) => store.setHtmlData(v)}
                      mode="html"
                      top={top}
                      key={v}
                      height={height}
                    />
                  );
                }
                return null;
              case FieldTypes.STYLE:
                if (showCss) {
                  return (
                    <Editor
                      index={index++}
                      data={cssData}
                      setter={(v) => store.setCssData(v)}
                      mode={cssType}
                      top={top}
                      key={v}
                      height={height}
                    />
                  );
                }
                return null;
              case FieldTypes.SCRIPT:
                if (showJs) {
                  return (
                    <Editor
                      index={index++}
                      data={jsData}
                      setter={(v) => store.setJsData(v)}
                      mode={jsType}
                      top={top}
                      key={v}
                      height={height}
                    />
                  );
                }
                return null;
              case FieldTypes.CONSOLE:
                if (showConsole) {
                  return (
                    <Console index={index++} top={top} key={v}/>
                  );
                }
                return null;
              case FieldTypes.RESULT:
                if (showOut) {
                  return (
                    <Out index={index++} top={top} key={v}/>
                  );
                }
                return null;
            }
            return null;
          })
        }
      </InnerWrapper>
      <ResizerElement vertical={true} cb={resizerCallback}/>
    </Wrapper>
  );
});

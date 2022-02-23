import ts from 'typescript';
import {JsTypes, StyleTypes} from '../store';
import Less from 'less';
import {addToBody, addToHead, initScript, initStyle} from './contentGenerator';

interface Props {
  htmlData: string;
  cssData: string;
  jsData: string;
  cssType: StyleTypes;
  jsType: JsTypes;
}

export const fileGenerator = async (props: Props) => {
  const {htmlData, cssData, jsData, cssType, jsType} = props;
  let res = htmlData;
  if (cssData) {
    switch (cssType) {
      case StyleTypes.CSS:
        res = addToHead(res, initStyle(cssData));
        break;
      case StyleTypes.Less:
        res = addToHead(res, initStyle(await Less.render(cssData).then(({css}) => css)));
        break;
    }
  }
  if (jsData) {
    switch (jsType) {
      case JsTypes.JS:
        res = addToBody(res, initScript(jsData));
        break;
      case JsTypes.TypeScript:
        res = addToBody(res, initScript(ts.transpile(jsData)));
        break;
    }
  }
  return res;
};

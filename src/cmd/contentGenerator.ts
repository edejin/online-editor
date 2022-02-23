import ts from 'typescript';
import {JsTypes, StyleTypes} from '../store';
import Less from 'less';
// @ts-ignore Because definitions not exist
import * as Babel from 'babel-standalone';
import {loopProtect} from './loopProtect';
/* eslint import/no-webpack-loader-syntax: off */
import additionalJS from '!!raw-loader!../consts/additionalJS.js';

const callback = (line: number) => {
  // @ts-ignore Because this function not exist in this scope, but it's exist in `additionalJS`
  infinityLoopError();
  debugger;
  throw new Error(`Bad loop on line ${line}`);
};

const timeout = 100;
Babel.registerPlugin('loopProtection', loopProtect(timeout, callback));

const loopProtection = (source: string) => Babel.transform(source, {
  plugins: ['loopProtection'],
}).code;

interface Props {
  htmlData: string;
  cssData: string;
  jsData: string;
  cssType: StyleTypes;
  jsType: JsTypes;
}

export const initStyle = (v: string): string => `<style>${v}</style>`;
export const initScript = (v: string): string => `<script>${v}</script>`;
export const addToHead = (v: string, fragment: string): string => {
  if (v.includes('</head>')) {
    return v.replace('</head>', `${fragment}</head>`);
  }
  return `${fragment}${v}`;
};
export const addToBody = (v: string, fragment: string): string => {
  if (v.includes('</body>')) {
    return v.replace('</body>', `${fragment}</body>`);
  }
  return `${v}${fragment}`;
};

const addAdditionalJS = (v: string) => `${additionalJS}${v}`;

export const contentGenerator = async (props: Props) => {
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
        res = addToBody(res, initScript(addAdditionalJS(loopProtection(jsData))));
        break;
      case JsTypes.TypeScript:
        res = addToBody(res, initScript(addAdditionalJS(loopProtection(ts.transpile(jsData)))));
        break;
    }
  }
  return res;
};

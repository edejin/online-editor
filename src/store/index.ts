import {makeAutoObservable} from 'mobx';
import {contentGenerator} from '../cmd/contentGenerator';
import {fileGenerator} from '../cmd/fileGenerator';
import {ConsoleMessage} from '../components/Console';
/* eslint import/no-webpack-loader-syntax: off */
import defaultHTML from '!!raw-loader!../consts/defaultHTML.html';
/* eslint import/no-webpack-loader-syntax: off */
import defaultCss from '!!raw-loader!../consts/defaultCSS.css';
/* eslint import/no-webpack-loader-syntax: off */
import defaultJs from '!!raw-loader!../consts/defaultJS.js';
/* eslint import/no-webpack-loader-syntax: off */
import loopProtectionCallback from '!!raw-loader!../consts/loopProtectionCallback.js';

export enum StyleTypes {
  CSS = 'css',
  Less = 'less'
}

export enum StyleTypesNames {
  'css' = 'CSS',
  'less' = 'LessCSS'
}

export enum JsTypes {
  JS = 'javascript',
  TypeScript = 'typescript'
}

export enum JsTypesNames {
  'javascript' = 'JavaScript',
  'typescript' = 'TypeScript'
}

const updateUrl = (showHtml: boolean, showCss: boolean, showJs: boolean, showOut: boolean, showConsole: boolean, cssType: StyleTypes, jsType: JsTypes) => {
  const parts = [];
  if (showHtml) {
    parts.push('html');
  }
  if (showCss) {
    parts.push(cssType);
  }
  if (showJs) {
    parts.push(jsType);
  }
  if (showOut) {
    parts.push('out');
  }
  if (showConsole) {
    parts.push('console');
  }
  const newUrl = `${document.location.href.split('#')[0]}#${parts.join(',')}`;
  window.history.replaceState({}, '', newUrl);
};

const getParams = (): Record<string, string> => {
  return (document.location.search.split('?')[1] || '')
    .split('&')
    .filter((l) => l.length)
    .reduce((a: Record<string, string>, z: string) => {
      const [k, v] = z.split('=');
      a[k] = decodeURIComponent(v);
      return a;
    }, {});
};

interface Example {
  html?: string;
  javascript?: string;
  typescript?: string;
  css?: string;
  less?: string;
}

export enum FieldTypes {
  HTML = 1,
  STYLE,
  SCRIPT,
  CONSOLE,
  RESULT,
  END
}

const getPreset = (id: string): Promise<Example> => fetch(`./examples/${id}.json`).then((resp) => resp.json() as Promise<Example>);

class StoreClass {
  topWidths: number[] = new Array(5).fill(0);
  bottomWidths: number[] = new Array(5).fill(0);
  topPanelFields: FieldTypes[] = [FieldTypes.HTML, FieldTypes.STYLE, FieldTypes.SCRIPT, FieldTypes.CONSOLE, FieldTypes.RESULT];
  bottomPanelFields: FieldTypes[] = [];
  drag?: FieldTypes;
  topHeight: number = 0;
  width: number = 100;
  height: number = 100;
  showHtml: boolean = true;
  showCss: boolean = true;
  showJs: boolean = true;
  showOut: boolean = true;
  showConsole: boolean = false;
  cssType: StyleTypes = StyleTypes.Less;
  jsType: JsTypes = JsTypes.TypeScript;
  htmlData: string = defaultHTML;
  cssData: string = defaultCss;
  jsData: string = defaultJs;
  reloadTrigger: boolean = true;
  console: ConsoleMessage[] = [];
  loopProtectionDelay: number = 100;
  loopProtectionFunction: string = loopProtectionCallback;

  constructor() {
    makeAutoObservable(this);
    const parts = (document.location.href.split('#')[1] || `html,out,${JsTypes.JS},${StyleTypes.CSS}`).split(',').filter((l) => l.length);
    this.showHtml = parts.includes('html');
    this.showOut = parts.includes('out');
    this.showConsole = parts.includes('console');
    this.showJs = parts.includes(JsTypes.JS) || parts.includes(JsTypes.TypeScript);
    this.showCss = parts.includes(StyleTypes.CSS) || parts.includes(StyleTypes.Less);
    if (parts.includes(StyleTypes.CSS)) {
      this.cssType = StyleTypes.CSS;
    } else if (parts.includes(StyleTypes.Less)) {
      this.cssType = StyleTypes.Less;
    }
    if (parts.includes(JsTypes.JS)) {
      this.jsType = JsTypes.JS;
    } else if (parts.includes(JsTypes.TypeScript)) {
      this.jsType = JsTypes.TypeScript;
    }
    const {id} = getParams();
    if (id) {
      getPreset(id).then((data) => {
        const {
          css,
          html,
          javascript,
          less,
          typescript
        } = data;
        if (html) {
          this.setHtmlData(html);
        }
        if (css) {
          this.setCssData(css);
          this.setCssType(StyleTypes.CSS);
        }
        if (less) {
          this.setCssData(less);
          this.setCssType(StyleTypes.Less);
        }
        if (javascript) {
          this.setJsData(javascript);
          this.setJsType(JsTypes.JS);
        }
        if (typescript) {
          this.setJsData(typescript);
          this.setJsType(JsTypes.TypeScript);
        }
      });
    }
  }

  addToConsole(m: ConsoleMessage) {
    this.console.push({
      ...m,
      date: Date.now()
    });
  }

  clearConsole() {
    this.console = [];
  }

  setSize(width: number, height: number) {
    let changed = false;
    if (this.width !== width) {
      this.width = width;
      changed = true;
    }
    if (this.height !== height) {
      this.height = height;
      changed = true;
    }
    if (changed) {
      this.recalculateWidths(width);
    }
  }

  recalculateWidths(width: number = this.width) {
    const topCount = this.topColumnCount;
    this.topWidths = new Array(topCount).fill(width / topCount);
    const bottomCount = this.bottomColumnCount;
    this.bottomWidths = new Array(bottomCount).fill(width / bottomCount);
    if (topCount === 0) {
      this.topHeight = 0;
    }
    if (bottomCount === 0) {
      this.topHeight = this.height;
    }
    if (topCount && bottomCount) {
      this.topHeight = this.height / 2;
    }
  }

  get bottomHeight(): number {
    return this.height - this.topHeight;
  }

  setShowHtml(v: boolean) {
    this.showHtml = v;
    this.recalculateWidths();
    updateUrl(v, this.showCss, this.showJs, this.showOut, this.showConsole, this.cssType, this.jsType);
  }

  setShowCss(v: boolean) {
    this.showCss = v;
    this.recalculateWidths();
    updateUrl(this.showHtml, v, this.showJs, this.showOut, this.showConsole, this.cssType, this.jsType);
  }

  setShowJs(v: boolean) {
    this.showJs = v;
    this.recalculateWidths();
    updateUrl(this.showHtml, this.showCss, v, this.showOut, this.showConsole, this.cssType, this.jsType);
  }

  setShowOut(v: boolean) {
    this.showOut = v;
    this.recalculateWidths();
    updateUrl(this.showHtml, this.showCss, this.showJs, v, this.showConsole, this.cssType, this.jsType);
  }

  setShowConsole(v: boolean) {
    this.showConsole = v;
    this.recalculateWidths();
    updateUrl(this.showHtml, this.showCss, this.showJs, this.showOut, v, this.cssType, this.jsType);
  }

  setCssType(c: StyleTypes) {
    this.cssType = c;
    updateUrl(this.showHtml, this.showCss, this.showJs, this.showOut, this.showConsole, c, this.jsType);
  }

  setJsType(c: JsTypes) {
    this.jsType = c;
    updateUrl(this.showHtml, this.showCss, this.showJs, this.showOut, this.showConsole, this.cssType, c);
  }

  get content(): Promise<string> {
    const {htmlData, cssData, jsData, cssType, jsType, loopProtectionDelay, loopProtectionFunction} = this;
    return contentGenerator({
      htmlData,
      cssData,
      jsData,
      cssType,
      jsType
    }, loopProtectionDelay, loopProtectionFunction);
  }

  get fileContent(): Promise<string> {
    const {htmlData, cssData, jsData, cssType, jsType} = this;
    return fileGenerator({
      htmlData,
      cssData,
      jsData,
      cssType,
      jsType
    });
  }

  get topColumnCount(): number {
    let c = 0;
    const {
      showOut,
      showHtml,
      showCss,
      showJs,
      showConsole,
      topPanelFields
    } = this;
    if (showOut && topPanelFields.includes(FieldTypes.RESULT)) {
      c++;
    }
    if (showHtml && topPanelFields.includes(FieldTypes.HTML)) {
      c++;
    }
    if (showCss && topPanelFields.includes(FieldTypes.STYLE)) {
      c++;
    }
    if (showJs && topPanelFields.includes(FieldTypes.SCRIPT)) {
      c++;
    }
    if (showConsole && topPanelFields.includes(FieldTypes.CONSOLE)) {
      c++;
    }
    return c;
  }

  get bottomColumnCount(): number {
    let c = 0;
    const {
      showOut,
      showHtml,
      showCss,
      showJs,
      showConsole,
      bottomPanelFields
    } = this;
    if (showOut && bottomPanelFields.includes(FieldTypes.RESULT)) {
      c++;
    }
    if (showHtml && bottomPanelFields.includes(FieldTypes.HTML)) {
      c++;
    }
    if (showCss && bottomPanelFields.includes(FieldTypes.STYLE)) {
      c++;
    }
    if (showJs && bottomPanelFields.includes(FieldTypes.SCRIPT)) {
      c++;
    }
    if (showConsole && bottomPanelFields.includes(FieldTypes.CONSOLE)) {
      c++;
    }
    return c;
  }

  setHtmlData(v: string) {
    this.htmlData = v;
  }

  setCssData(v: string) {
    this.cssData = v;
  }

  setJsData(v: string) {
    this.jsData = v;
  }

  setTopWidthByIndex(i: number, v: number) {
    if (i + 1 < this.topColumnCount) {
      this.topWidths[i] += v;
      this.topWidths[i + 1] -= v;
    }
  }

  setBottomWidthByIndex(i: number, v: number) {
    if (i + 1 < this.bottomColumnCount) {
      this.bottomWidths[i] += v;
      this.bottomWidths[i + 1] -= v;
    }
  }

  reloadIFrame() {
    this.reloadTrigger = !this.reloadTrigger;
  }

  get cssChanged(): boolean {
    return this.cssData !== defaultCss;
  }

  get jsChanged(): boolean {
    return this.jsData !== defaultJs;
  }

  get htmlChanged(): boolean {
    return this.htmlData !== defaultHTML;
  }

  reinit() {
    this.htmlData = defaultHTML;
    this.cssData = defaultCss;
    this.jsData = defaultJs;
    this.reloadIFrame();
  }

  setDrag(v?: FieldTypes) {
    this.drag = v;
  }

  reorder(top: boolean, drag: FieldTypes, before: FieldTypes) {
    const resTop: FieldTypes[] = this.topPanelFields.filter((r) => r !== drag);
    const resBottom: FieldTypes[] = this.bottomPanelFields.filter((r) => r !== drag);
    if (top) {
      const i = resTop.findIndex((r) => r === before);
      resTop.splice(i === -1 ? resTop.length : i, 0, drag);
    } else {
      const i = resBottom.findIndex((r) => r === before);
      resBottom.splice(i === -1 ? resBottom.length : i, 0, drag);
    }

    this.topPanelFields = resTop;
    this.bottomPanelFields = resBottom;

    this.recalculateWidths();
  }

  changeTopHeight(v: number) {
    this.topHeight += v;
  }

  updateLoopProtectionProps(delay: number, func: string) {
    this.loopProtectionDelay = delay;
    this.loopProtectionFunction = func;
  }
}

export const store = new StoreClass();
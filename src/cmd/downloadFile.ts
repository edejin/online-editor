export const downloadFile = (type: string, filename: string, textInput: string) => {
  const element = document.createElement('a');
  element.setAttribute('href',`data:${type};charset=utf-8, ${encodeURIComponent(textInput)}`);
  element.setAttribute('download', filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

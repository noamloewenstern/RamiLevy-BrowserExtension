const injectScriptURLFile = 'src/contentScript/interceptRequests/injectedDOMscript.js';
function addScriptToDOM() {
  const xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.id = '__xhrOverrideScript';
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.setAttribute('deffer', 'true');
  xhrOverrideScript.src = chrome.runtime.getURL(injectScriptURLFile);
  document.head.prepend(xhrOverrideScript);
}

export function addInjectScriptAfterDOMReady() {
  if (document.body && document.head) {
    const interceptResultsDataElement = createInterceptDataElement();
    document.body.appendChild(interceptResultsDataElement);

    addScriptToDOM();
    return interceptResultsDataElement;
  } else {
    requestIdleCallback(addInjectScriptAfterDOMReady);
  }
}

function createInterceptDataElement() {
  const interceptDataElement = document.createElement('div');
  interceptDataElement.id = '__interceptedData';
  interceptDataElement.innerText = 'intercepted data';
  interceptDataElement.style.height = '0';
  interceptDataElement.style.overflow = 'hidden';
  return interceptDataElement;
}

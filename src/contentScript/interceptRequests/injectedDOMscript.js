const URLS_TO_INTERCEPT = [
  /rami-levy\.co\.il\/api\/v2\/site\/clubs\/shop-lists(\/\d+)?/,
  /rami-levy\.co\.il\/api\/items/,
];

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}
function saveResponseInfo(resultsElem, { url, data, method }, options = { onlyIfJson: true }) {
  let respInfo = { url, data, method };
  if (options.onlyIfJson) {
    const parsedData = parseJson(data);
    if (parsedData === undefined) return;
    respInfo = { url, data: parsedData, method };
  }

  const savedInfo = JSON.stringify(respInfo);
  const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  respDiv = document.createElement('div');
  respDiv.id = `__interceptedData_` + randomId;
  respDiv.setAttribute('url', url);
  respDiv.style.height = '0';
  respDiv.style.overflow = 'hidden';
  resultsElem.appendChild(respDiv);
  respDiv.innerText = savedInfo;
  setTimeout(() => {
    respDiv.remove();
  }, 3000);
}

function interceptData() {
  const resultsElemId = '__interceptedData';
  const interceptDataElement = document.getElementById(resultsElemId);
  if (!interceptDataElement) {
    console.error(`interceptDataElement element with id '${resultsElemId}' not found`);
    return;
  }

  interceptRequests();

  function interceptRequests() {
    const XHR = XMLHttpRequest.prototype;
    const send = XHR.send;
    const open = XHR.open;
    XHR.open = function (method, url) {
      this._url = url; // the request url
      this._method = method;
      return open.apply(this, arguments);
    };
    XHR.send = function () {
      this.addEventListener('load', function () {
        const validUrl = URLS_TO_INTERCEPT.some(urlRegex => urlRegex.test(this._url));
        if (validUrl) {
          saveResponseInfo(
            interceptDataElement,
            { url: this._url, method: this._method, data: this.response },
            { onlyIfJson: true },
          );
        }
      });
      return send.apply(this, arguments);
    };
  }
}

function checkForDOM() {
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

const URLS_TO_INTERCEPT = ['api-prod.rami-levy.co.il/api/v2/site/clubs/shop-lists'];

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}
function saveResponseInfo(resultsElem, { url, data }, options = { onlyIfJson: true }) {
  let respInfo = { url, data };
  if (options.onlyIfJson) {
    const parsedData = parseJson(data);
    if (parsedData === undefined) return;
    respInfo = { url, data: parsedData };
  }

  const savedInfo = JSON.stringify(respInfo);
  const respDivId = `__interceptedData_${url}`;
  let respDiv = document.getElementById(respDivId);
  if (!respDiv) {
    respDiv = document.createElement('div');
    respDiv.id = `__interceptedData_${url}`;
    respDiv.setAttribute('url', url);
    respDiv.style.height = '0';
    respDiv.style.overflow = 'hidden';
    resultsElem.appendChild(respDiv);
  }
  respDiv.innerText = savedInfo;
}

// function getResponseInfo(url) {
//   const respDiv = document.getElementById(`__interceptedData_${url}`);
//   if (respDiv) {
//     return JSON.parse(respDiv.innerText);
//   }
//   return;
// }

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
      this.url = url; // the request url
      return open.apply(this, arguments);
    };
    XHR.send = function () {
      this.addEventListener('load', function () {
        if (URLS_TO_INTERCEPT.some(url => this.url.includes(url))) {
          saveResponseInfo(interceptDataElement, { url: this.url, data: this.response }, { onlyIfJson: true });
        }
      });
      return send.apply(this, arguments);
    };
  }
}

function checkForDOM() {
  if (document.body && document.head) {
    // console.log('[DOM script] running');
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);

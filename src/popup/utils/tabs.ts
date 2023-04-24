export const getActiveTab = () => {
  return new Promise<chrome.tabs.Tab | null>(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      resolve(tabs[0]);
    });
    setTimeout(() => resolve(null), 1000);
  });
};

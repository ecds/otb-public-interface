const detectBrowserEnv = () => {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isMac = /macintosh/i.test(ua) && !isIOS;
  const isChrome = /chrome/i.test(ua) && !/edg/i.test(ua);
  const isEdge = /edg/i.test(ua);
  const isFirefox = /firefox/i.test(ua);
  const isSafari = /safari/i.test(ua) && !isChrome && !isEdge;

  if (isIOS && isSafari) return "safari-ios";
  if (isIOS && isChrome) return "chrome-ios"; // WKWebView — same as Safari-iOS for permissions
  if (isAndroid && isEdge) return "edge-android";
  if (isAndroid) return "chrome-android";
  if (isMac && isSafari) return "safari-mac";
  if (isEdge) return "edge-desktop";
  if (isFirefox) return "firefox";
  if (isChrome) return "chrome-desktop";
  return "other";
};

export default detectBrowserEnv;

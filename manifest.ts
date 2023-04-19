import { ManifestV3Export } from '@crxjs/vite-plugin';
const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Rami Levi Online Helper',
  version: '1.0.0',
  action: {
    default_title: 'Popup',
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'logo192.png',
      '32': 'logo192.png',
      '48': 'logo192.png',
      '128': 'logo192.png',
    },
  },
  icons: {
    '48': 'logo192.png',
  },
  content_scripts: [
    {
      matches: ['https://www.rami-levy.co.il/*', 'https://api-prod.rami-levy.co.il/*'],
      js: ['src/contentScript/content.ts'],
      // css: ['src/contentScript/index.css'],
    },
    {
      matches: ['https://www.rami-levy.co.il/*', 'https://api-prod.rami-levy.co.il/*'],
      js: ['src/contentScript/interceptRequests/injectInterceptRequests.ts'],
      run_at: 'document_start',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        // 'src/contentScript/index.css',
        'logo192.png',
        'src/assets/logo192.png',
        'src/contentScript/interceptRequests/injectedDOMscript.js',
      ],
      matches: ['https://www.rami-levy.co.il/*', 'https://api-prod.rami-levy.co.il/*'],
    },
  ],
  content_security_policy: {
    extension_pages:
      "default-src 'self'; script-src: 'self' 'unsafe-inline'; object-src 'self' ; default-src 'none'; frame-ancestors 'none';",
    // 'script-src': [
    //   "'self'",
    //   "'unsafe-eval'",
    //   "'unsafe-inline'",
    //   'object-src',
    //   'https://www.rami-levy.co.il/*',
    //   'https://api-prod.rami-levy.co.il/*',
    //   'script-src',
    // ],
  },
  permissions: ['storage', 'activeTab', 'webRequest', 'cookies', 'webNavigation', 'scripting'],
  background: {
    service_worker: 'src/backgroundScripts/background.ts',
    type: 'module',
  },
  options_ui: {
    page: 'src/options/index.html',
    open_in_tab: true,
  },
  host_permissions: ['https://www.rami-levy.co.il/*', 'https://api-prod.rami-levy.co.il/api/*'],
};
export default manifest;

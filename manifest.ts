import { ManifestV3Export } from '@crxjs/vite-plugin';
const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Rami Levi Online Helper',
  version: '1.0.0',
  action: {
    default_title: 'Popup',
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'logo128.png',
      '32': 'logo128.png',
      '48': 'logo128.png',
      '128': 'logo128.png',
    },
  },
  icons: {
    '48': 'logo128.png',
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
        'logo128.png',
        'src/assets/logo128.png',
        'src/contentScript/interceptRequests/injectedDOMscript.js',
      ],
      matches: ['https://www.rami-levy.co.il/*', 'https://api-prod.rami-levy.co.il/*'],
    },
  ],
  content_security_policy: {
    extension_pages:
      "default-src 'self'; script-src: 'self' 'unsafe-inline'; object-src 'self' ; default-src 'none'; frame-ancestors 'none';",
  },
  permissions: ['storage', 'activeTab'],
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

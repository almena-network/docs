import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Mermaid → langium → `vscode-languageserver-types` (UMD): Webpack avisa por `require` dinámico.
 */
function suppressLangiumDependencyWarnings() {
  return {
    name: 'suppress-langium-dependency-warnings',
    configureWebpack() {
      return {
        ignoreWarnings: [
          { module: /vscode-languageserver-types/ },
          /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
        ],
      };
    },
  };
}

const config: Config = {
  title: 'Almena Network',
  tagline: 'Decentralized Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    // Rspack imprime este warning en consola aun con ignoreWarnings; Webpack lo respeta.
    faster: {
      rspackBundler: false,
      rspackPersistentCache: false,
    },
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [suppressLangiumDependencyWarnings],

  url: 'https://docs.almena.network',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'almena-network',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      es: {
        label: 'Español',
        direction: 'ltr',
        htmlLang: 'es-ES',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Almena Network',
      logo: {
        alt: 'Almena Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'usersSidebar',
          position: 'left',
          label: 'Users',
        },
        {
          type: 'docSidebar',
          sidebarId: 'integratorsSidebar',
          position: 'left',
          label: 'Integrators',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developersSidebar',
          position: 'left',
          label: 'Developers',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/almena-network',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Users',
              to: '/docs/users',
            },
            {
              label: 'Integrators',
              to: '/docs/integrators',
            },
            {
              label: 'Developers',
              to: '/docs/developers',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/almena-network',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Almena Network. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

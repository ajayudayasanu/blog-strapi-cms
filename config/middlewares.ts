export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'storage.googleapis.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'storage.googleapis.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '200mb',
      jsonLimit: '200mb',
      textLimit: '200mb',
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // 200mb in bytes
        uploadDir: '/tmp', // App Engine filesystem is read-only; /tmp is writable
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

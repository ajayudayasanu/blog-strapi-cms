module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
        providerOptions: {
          bucketName: env('GCS_BUCKET_NAME'),
          basePath: env('GCS_BASE_PATH'),
          baseUrl: `https://storage.googleapis.com/${env('GCS_BUCKET_NAME')}`,
          publicFiles: true,
          uniform: true,
        },
      },
    },
});

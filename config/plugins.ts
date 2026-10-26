export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
  // Google Cloud Storage provider for GCP App Engine production (or when FORCE_GCS is enabled)
  if ((env('NODE_ENV') === 'production' || env('FORCE_GCS') === 'true') && env('GCS_BUCKET_NAME')) {
    return {
      upload: {
        config: {
          provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
          providerOptions: {
            bucketName: env('GCS_BUCKET_NAME'),
            basePath: env('GCS_BASE_PATH', 'cms'),
            baseUrl: `https://storage.googleapis.com/${env('GCS_BUCKET_NAME')}`,
            publicFiles: true,
            uniform: true,
          },
        },
      },
    };
  }

  // Local development fallback: default local upload provider
  return {};
};

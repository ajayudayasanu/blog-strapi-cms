import fs from 'fs';
import path from 'path';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: any }) {
    // App Engine Standard has a read-only filesystem at /workspace.
    // Redirect the uploads directory to /tmp which is always writable.
    // This acts as a safety net if the GCS provider falls back to local storage.
    const tmpUploads = '/tmp/uploads';
    if (!fs.existsSync(tmpUploads)) {
      fs.mkdirSync(tmpUploads, { recursive: true });
    }

    // Override Strapi's public dir so local upload provider writes to /tmp
    if (strapi.dirs?.static?.public) {
      strapi.dirs.static.public = '/tmp';
    }
  },
};


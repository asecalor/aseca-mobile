const { withAndroidManifest } = require('@expo/config-plugins');

const withCustomAndroidManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    let androidManifest = config.modResults;

    // Ensure the androidManifest is in the expected format
    if (!androidManifest.manifest) androidManifest.manifest = {};
    if (!androidManifest.manifest.$) androidManifest.manifest.$ = {};

    // Add the tools namespace to the manifest tag
    androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Ensure the application tag is present
    if (!androidManifest.manifest.application) androidManifest.manifest.application = [{}];

    const application = androidManifest.manifest.application[0];

    if (!application.$) application.$ = {};
    application.$['android:usesCleartextTraffic'] = 'true';
    application.$['tools:targetApi'] = '28';

    return config;
  });
};

module.exports = withCustomAndroidManifest;

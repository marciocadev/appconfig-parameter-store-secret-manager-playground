import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.44.0',
  defaultReleaseBranch: 'main',
  name: 'appconfig-parameter-store-secret-manager-playground',
  projenrcTs: true,

  deps: [
    'axios',
    'source-map-support',
    '@aws-sdk/client-appconfig',
    '@aws-sdk/client-ssm',
    '@aws-sdk/client-secrets-manager',
  ],
  devDeps: ['@aws-sdk/credential-providers'],
});
project.synth();
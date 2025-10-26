import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-central-1_9DUZ3HyCf",
      userPoolClientId: "7v7v8svggc1piqbtbq7rbud8u0",
       identityPoolId: 'eu-central-1:f358268f-cc7a-46cb-8f02-8c1feb934e22',   
       region: 'eu-central-1',
      loginWith: { email: true },
    },
  },
  Storage: {
    S3: { 
    region: 'eu-central-1',
    bucket: 'securevaultsfile', 
    // identityPoolId: 'eu-central-1:f358268f-cc7a-46cb-8f02-8c1feb934e22'
    }
  }
});

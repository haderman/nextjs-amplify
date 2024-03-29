// @ts-nocheck
import AWS from 'aws-sdk';

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
let region = "us-east-1",
  secretName = "fauna_db_access_key",
  secret,
  decodedBinarySecret;

// Create a Secrets Manager client
let client = new AWS.SecretsManager({
  region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

let error;
let inCallback;

client.getSecretValue({ SecretId: secretName }, function(err, data) {
  inCallback = 'in callback getting ' + secretName;
  if (err) {
    error = err.code;
    // if (err.code === 'DecryptionFailureException')
    //   // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
    //   // Deal with the exception here, and/or rethrow at your discretion.
    //   throw err;
    // else if (err.code === 'InternalServiceErrorException')
    //   // An error occurred on the server side.
    //   // Deal with the exception here, and/or rethrow at your discretion.
    //   throw err;
    // else if (err.code === 'InvalidParameterException')
    //   // You provided an invalid value for a parameter.
    //   // Deal with the exception here, and/or rethrow at your discretion.
    //   throw err;
    // else if (err.code === 'InvalidRequestException')
    //   // You provided a parameter value that is not valid for the current state of the resource.
    //   // Deal with the exception here, and/or rethrow at your discretion.
    //   throw err;
    // else if (err.code === 'ResourceNotFoundException')
    //   // We can't find the resource that you asked for.
    //   // Deal with the exception here, and/or rethrow at your discretion.
    //   throw err;
  }
  else {
    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ('SecretString' in data) {
      secret = data.SecretString;
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64');
      decodedBinarySecret = buff.toString('ascii');
    }
  }

  // Your code goes here.
});

export function getSecret() {
  return secret;
}

export function getError() {
  return error;
}

export function getDecodedBinarySecret() {
  return decodedBinarySecret;
}

export function getInCallback() {
  return inCallback;
}

export function getSecretV2() {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, function(err, data) {
      inCallback = 'in callback getting ' + secretName;
      if (err) {
        resolve(err.code);
      } else {
        resolve(JSON.stringify(data));
      }
      // if (err) {
      //   error = err.code;
      //   reject(error.code);
      // }
      // else {
      //   // Decrypts secret using the associated KMS CMK.
      //   // Depending on whether the secret is a string or binary, one of these fields will be populated.
      //   if ('SecretString' in data) {
      //     secret = data.SecretString;
      //     resolve(secret);
      //   } else {
      //     let buff = new Buffer(data.SecretBinary, 'base64');
      //     decodedBinarySecret = buff.toString('ascii');
      //     resolve(decodedBinarySecret);
      //   }
      // }
    });
  })
}

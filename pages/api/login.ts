import type { NextApiRequest, NextApiResponse } from 'next'
import faunadb, { query as q } from 'faunadb';
import { uuid } from 'uuidv4';

import { getSecret, getError, getDecodedBinarySecret, getInCallback, getSecretV2 } from '../../external/aws';

const secret = getSecret();
const secretError = getError();
const secretBinary = getDecodedBinarySecret();
const inCallback = getInCallback();

const client = new faunadb.Client({
  secret: secret,
});

export default (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (req.method !== 'POST') {
    res.status(404).send('this route does not exist');
    return;
  }

  createAuthToken()
    .then(({ result, token }) => {
      if (!result.ref) {
        return res.status(404).send('token ref is missing');
      }
      res.status(201).send(token);
    })
    .catch(error => {
      getSecretV2()
        .then(val => {
          res.status(error.requestResult.statusCode).send(val as string);
        })
        .catch(err => {
          res.status(error.requestResult.statusCode).send(err);
        })
      // const secret = getSecret();
      // const secretError = getError();
      // const secretBinary = getDecodedBinarySecret();
      // const inCallback = getInCallback();
      // const errorMSG = `${error} - secret: ${secret} - error: ${secretError} - secret binary: ${secretBinary} - inCallback: ${inCallback}`
      // res.status(error.requestResult.statusCode).send(errorMSG);
    });
}

function createAuthToken(): Promise<{ result: any, token: string }> {
  return new Promise((resolve, reject) => {
    const token = uuid();
    client.query(
      q.Create(q.Collection('Auth'), {
        data: {
          token,
        }
      })
    )
      .then((result) => {
        resolve({ result, token });
      })
      .catch(err => {
        reject(err);
      });
  });
}

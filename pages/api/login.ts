import type { NextApiRequest, NextApiResponse } from 'next'
import faunadb, { query as q } from 'faunadb';
import { uuid } from 'uuidv4';

import { getSecret } from '../../external/aws';

const client = new faunadb.Client({
  secret: getSecret(),
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
      const errorMSG = `${error} - env var: ${process.env.FAUNA_ACCESS_KEY_ADMIN}`
      res.status(error.requestResult.statusCode).send(errorMSG);
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
import axios from 'axios';
import randomstring from 'randomstring';
import { userSchema } from './schemas/userSchema';

export interface User {
  user_id: string;
  email: string;
  email_verified: boolean;
  blocked: boolean;
  connection: string;
  verify_email: boolean;
  app_metadata: {
    imported: boolean;
  };
};

export const createUser = async (user: User): Promise<any> => {
  const { error, value: validatedUser } = userSchema.validate(
    user, { abortEarly: false, stripUnknown: true },
  );

  if (error) {
    const errors = error.details.map(({ path, message }) => ({ field: path[0], message }));
    throw errors;
  }

  try {
    const { data: { access_token: accessToken } } = await axios.post(`${process.env.API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: 'https://dev-3ya3mn-i.eu.auth0.com/api/v2/'
    });

    const createdUser = await axios.post(
      `${process.env.API_URL}/api/v2/users`,
      { ...validatedUser, password: randomstring.generate() },
      { headers: { 'Authorization': `Bearer ${accessToken}` } },
    );

    return createdUser.data;
  } catch (e) {
    console.error(`Error ${e.response.status}: ${e.response.data.message}`);
    throw e;
  }
};

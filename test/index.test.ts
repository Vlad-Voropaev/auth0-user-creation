import axios from 'axios';
import { createUser, User } from '../src/index';
import { userSchema } from '../src/schemas/userSchema';

jest.mock('axios');

describe("createUser", () => {
  it("successful user creation", async() => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    (userSchema.validate as jest.Mock) = jest.fn().mockResolvedValue({ error: null, value: {} });

    await createUser({} as User);

    expect(userSchema.validate).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(`${process.env.API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: 'https://dev-3ya3mn-i.eu.auth0.com/api/v2/'
    });
    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});
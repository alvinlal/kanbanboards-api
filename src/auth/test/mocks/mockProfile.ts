import { faker } from '@faker-js/faker';
import { Profile } from 'passport-google-oauth20';

export const mockProfile: Profile = {
  profileUrl: faker.internet.url(),
  _raw: 'raw',
  displayName: faker.name.firstName(),
  id: faker.datatype.uuid(),
  provider: 'google',
  emails: [
    {
      value: faker.internet.email(),
      verified: 'true',
    },
  ],
  name: {
    familyName: faker.name.firstName(),
    givenName: faker.name.firstName(),
    middleName: faker.name.middleName(),
  },
  photos: [{ value: faker.internet.url() }],
  username: faker.internet.userName(),
  _json: {
    iss: 'https://accounts.google.com',
    azp: '1234987819200.apps.googleusercontent.com',
    aud: '1234987819200.apps.googleusercontent.com',
    sub: '10769150350006150715113082367',
    at_hash: 'HK6E_P6Dh8Y93mRNtsDB1Q',
    hd: 'example.com',
    email: 'jsmith@example.com',
    email_verified: 'true',
    iat: 1353601026,
    exp: 1353604926,
    nonce: '0394852-3190485-2490358',
  },
};

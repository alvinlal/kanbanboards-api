import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import * as request from 'supertest';
import { userStub } from '../../../user/test/stubs/user.stub';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from '../../../validationPipeConfig';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let dbConnection: Connection;
  let httpServer;
  let app: INestApplication;
  let agent: request.SuperAgentTest;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
    jwtService = moduleRef.get<JwtService>(JwtService);
    agent = request.agent(httpServer);
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    const signupUrl = '/auth/signup';
    describe('when signup is called with valid email and password', () => {
      it('should successfully inserts user into db and responds with an object with _id in it', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.status).toBe(201);
        expect(response.type).toMatch(/json/);
        expect(response.body).toEqual({ _id: expect.any(String) });
      });

      it('should set jwt token in a cookie', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.header['set-cookie'][0]).toEqual(expect.any(String));
      });
    });

    describe('when signup is called with invalid fields', () => {
      it('should return status code of 400', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: 'invalidemail.com', password: '1 1' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            {
              property: 'email',
              constraints: {
                isEmail: 'please enter a valid email',
              },
            },
            {
              property: 'password',
              constraints: {
                notContains: 'password should not contain spaces',
                minLength: 'password should be atleast 6 characters',
              },
            },
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('when signup is called with an already existing email', () => {
      beforeEach(async () => {
        await dbConnection.collection('users').insertOne({
          email: userStub().email,
          password: userStub().password,
        });
      });
      it('should return the correct BadRequest response', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            {
              property: 'email',
              constraints: {
                isEmailExists: 'Account already exists, please login',
              },
            },
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('when signup is called with an invalid email', () => {
      it('should return the correct BadRequest response', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: 'invalidemail.com', password: userStub().password });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            {
              property: 'email',
              constraints: {
                isEmail: 'please enter a valid email',
              },
            },
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('when signup is called with invalid password', () => {
      it('should return the correct BadRequest response', async () => {
        const response = await request(httpServer)
          .post(signupUrl)
          .send({ email: userStub().email, password: 'pa s' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            {
              property: 'password',
              constraints: {
                notContains: 'password should not contain spaces',
                minLength: 'password should be atleast 6 characters',
              },
            },
          ],
          error: 'Bad Request',
        });
      });
    });
  });

  describe('GET /auth/me', () => {
    const meUrl = '/auth/me';
    describe('when me is called with no access token in cookie', () => {
      it('should return the correct Unauthorized response', async () => {
        const response = await request(httpServer).get(meUrl);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
    });

    describe('when me is called with invalid access token in cookie', () => {
      it('should return the correct Unauthorized response', async () => {
        const response = await agent
          .get(meUrl)
          .set('Cookie', [
            'ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzdkMDYwNDZhMGZiZTM5MmFhMmZmMmMiLCJpYXQiOjE2NjkxMzc5MjQsImV4cCI6MTY3MTI5NzkyNH0.MKx1W5C0wY-O7XQ_sXCYrIwb-arkEaHYVFaCKmd8aUy',
          ]);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
    });

    describe('when me is called with valid access token in cookie', () => {
      it('should return an object containing unique id of the user', async () => {
        const token = jwtService.sign({
          sub: userStub()._id,
        });

        const response = await agent
          .get(meUrl)
          .set('Cookie', [`ACCESS_TOKEN=${token}`]);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          _id: expect.any(String),
        });
      });
    });
  });

  describe('POST /auth/login', () => {
    const loginUrl = '/auth/login';

    describe('when login is called with correct credentials', () => {
      beforeEach(async () => {
        await dbConnection.collection('users').insertOne({
          email: userStub().email,
          password: await bcrypt.hash(userStub().password, 10),
        });
      });
      it('should return an object with unique user id', async () => {
        const response = await request(httpServer)
          .post(loginUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.status).toBe(200);
        expect(response.header['set-cookie'][0]).toEqual(expect.any(String));
        expect(response.body).toEqual({
          _id: expect.any(String),
        });
      });
    });

    describe("when login is called with email that doesn'nt exists", () => {
      it('should return the correct Unauthorized response', async () => {
        const response = await request(httpServer)
          .post(loginUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'incorrect email or password',
          error: 'Unauthorized',
        });
      });
    });

    describe('when login is called with incorrect password', () => {
      beforeEach(async () => {
        await dbConnection.collection('user').insertOne({
          email: userStub().email,
          password: await bcrypt.hash(userStub().password, 10),
        });
      });

      it('should return the correct Unauthorized response', async () => {
        const response = await request(httpServer)
          .post(loginUrl)
          .send({ email: userStub().email, password: 'wrong password' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message: 'incorrect email or password',
          error: 'Unauthorized',
        });
      });
    });

    describe('when login is called with an email which were signed up with google', () => {
      beforeEach(async () => {
        await dbConnection.collection('users').insertOne({
          email: userStub().email,
          password: null,
        });
      });

      it('should return the correct Unauthorized response', async () => {
        const response = await request(httpServer)
          .post(loginUrl)
          .send({ email: userStub().email, password: userStub().password });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          statusCode: 401,
          message:
            "This account can only be logged into with Google, or by resetting the password with 'Forgot Password'.",
          error: 'Unauthorized',
        });
      });
    });
  });
});

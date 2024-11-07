import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ApiModule } from '../src/api/api.module';
import { INestApplication } from '@nestjs/common';

describe('ApiController (e2e)', () => {
  let api: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    api = moduleFixture.createNestApplication();
    await api.init();
  });

  afterAll(async () => {
    await api.close();
  });

  it('/ (GET)', () => {
    return request(api.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

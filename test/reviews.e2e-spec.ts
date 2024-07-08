import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReviewsModule } from '../src/reviews/reviews.module';

const headers = {
  'x-api-key': 'eminem',
};

jest.setTimeout(10000);

describe('ReviewsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ReviewsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/reviews (GET)', async () => {
    const urlPath =
      '/reviews?url=https://www.hostelworld.com/pwa/wds/hosteldetails.php/St-Christopher-s-Inn-Gare-du-Nord/Paris/72963?from=2024-07-09%26to=2024-07-12%26guests=1%26display=reviews&endDate=2024-06-01&maxResults=1';
    const req = request.agent(app.getHttpServer());
    req.set(headers);
    return await req.get(urlPath).expect(200);
  });
});

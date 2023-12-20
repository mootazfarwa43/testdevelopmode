import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { Category } from '../src/book/schemas/book.schema';

describe('BookController & AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    afterAll(() => mongoose.disconnect());

    const user = {
        name: 'Ghulam',
        email: 'ghulam@gmail.com',
        password: '12345678',
    };

    const newBook = {
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
    };

    let jwtToken: string = '';
    let bookCreated;

    describe('Auth', () => {
        it('(POST) - Register a new user', async () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(user)
                .expect(201)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                });
        });

        it('(POST) - Login user', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')  // Change this to POST
                .send({ email: user.email, password: user.password })
                .expect(200)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                    jwtToken = res.body.token;
                });
        });

    });

    describe('Book', () => {
        it('(POST) - Create new Book', async () => {
            return request(app.getHttpServer())
                .post('/books')
                .set('Authorization', 'Bearer ' + jwtToken)
                .send(newBook)
                .expect(201)
                .then((res) => {
                    expect(res.body._id).toBeDefined();
                    expect(res.body.title).toEqual(newBook.title);
                    bookCreated = res.body;
                });
        });

        it('(GET) - Get all Books', async () => {
            return request(app.getHttpServer())
                .get('/books')
                .expect(200)
                .then((res) => {
                    expect(res.body.length).toBe(1);
                });
        });


    });
});
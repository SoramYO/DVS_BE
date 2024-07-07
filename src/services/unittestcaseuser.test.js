const request = require('supertest');
const app = require('./app');
const userService = require('./userService');
const { error } = require('jquery');

jest.mock('./userService');

describe('User Controller', () => {
    describe('POST /login', () => {
        it('should return 400 if username or password is missing', async () => {
            const res = await request(app)
                .post('/login')
                .send({ username: 'testuser' }); // Missing password

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "Missing INPUT PARAMETER! Please check again!",
            });
        });

        it('should return 400 if userData has errCode !== 0', async () => {
            userService.handleUserLogin.mockResolvedValue({
                errCode: 1,
                errMessage: "Invalid credentials",
            });

            const res = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "Invalid credentials",
                user: {},
            });
        });

        it('should return 200 and set a cookie if login is successful', async () => {
            userService.handleUserLogin.mockResolvedValue({
                errCode: 0,
                errMessage: "Success",
                user: { id: 1, role: 'user' },
                accessToken: 'mocked_access_token',
            });

            const res = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'password' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body).toEqual(expect.objectContaining({
                errCode: 0,
                message: "Success",
                user: { id: 1, role: 'user' },
            }));
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('POST /register', () => {
        it('should return 400 if any required field is missing', async () => {
            const res = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', firstName: 'John' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "Missing INPUT PARAMETER! Please check again!",
            });
        });

        it('should return 400 if registration fails', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 1,
                message: "User already exists",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "User already exists",
            });
        });

        it('should return 200 if registration is successful', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 0,
                message: "Registration successful",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                errCode: 0,
                message: "Registration successful",
            });
        });
        it('should return 400 error No recipients mail defined', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 1,
                message: "Server error",
                error: "No recipients mail defined",
            });


            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'email',
                    phone: '0123456789',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "Server error",
                error: "No recipients mail defined",
            });
        });
        it('should return 400 error Phone number is invalid', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 1,
                message: "Phone number is invalid",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'email',
                    phone: '123456789',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 1,
                message: "Phone number is invalid",
            });
        });
        it('should return 400 if username is less than 6 characters', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 2,
                message: "Username must be at least 6 characters!",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'test', // Less than 6 characters
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 2,
                message: "Username must be at least 6 characters!",
            });
        });

        it('should return 400 if username is more than 26 characters', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 2,
                message: "Username must be less than 26 characters!",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'averylongusername1234567890', // More than 26 characters
                    password: 'password',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 2,
                message: "Username must be less than 26 characters!",
            });
        });

        it('should return 400 if password is less than 6 characters', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 2,
                message: "Password must be at least 6 characters!",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'pass', // Less than 6 characters
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 2,
                message: "Password must be at least 6 characters!",
            });
        });

        it('should return 400 if password is more than 26 characters', async () => {
            userService.handleUserRegister.mockResolvedValue({
                errCode: 2,
                message: "Password must be less than 26 characters!",
            });

            const res = await request(app)
                .post('/register')
                .send({
                    username: 'testuser',
                    password: 'averylongpassword1234567890', // More than 26 characters
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                errCode: 2,
                message: "Password must be less than 26 characters!",
            });
        });
    });
});

const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const keys = require('../config/dev');
const server = require('../index');
const { Post } = require('../models/Post');

const app = request.agent(server);
let postId = '';

before(function (done) {
    mongoose.connect(keys.mongo_uri, () => {
        mongoose.connection.db.dropDatabase(() => {
            done();
        });
    });
});

describe('POST request', () => {
    describe('Adding new post', () => {
        it('Success should be return true', () => {
            app.post('/posts/add').send({
                title: 'My Post for testing',
                description: 'Easy',
                postCategory: 'Chai and Mocha'
            }).end((err, res) => {
                expect(res.body.success).to.equal(true);
            });
        });
    });
});

describe('GET request', () => {
    describe('Get all post', () => {
        it('Success should be return true', () => {
            app.get('/posts').end((err, res) => {
                expect(res.body.success).to.equal(true);
            });
        });
    });
});

describe('PUT request', () => {
    let post = null;
    before('Finding a post', async () => {
        post = await Post.findOne({ title: 'My Post for testing' });
        postId = post._id;
    });
    describe('Edit a post', () => {
        let result = null;
        before(async () => {
            result = await app.put(`/posts/update/${postId}`).send({
                title: 'Testing with mocha and chai',
                description: 'Easy',
                postCategory: 'Chai and Mocha'
            });
        });

        it('Success should be true', function (done) {
            expect(result.body.success).to.equal(true);
            done();
        });

        it('Title should be "Testing with mocha and chai"', function (done) {
            expect(result.body.data.title).to.equal('Testing with mocha and chai');
            done();
        });
    });
});

describe('DELETE request', () => {

    describe('Deleting a post', () => {
        let result = null;
        before(async () => {
            result = await app.delete(`/posts/delete/${postId}`);
            console.log('Result: ', result.body);
        });

        it('Success should be true', function (done) {
            expect(result.body.success).to.equal(true);
            done();
        });

        it('deletedCount should be 1', function (done) {
            expect(result.body.data.deletedCount).to.equal(1);
            done();
        });
    });
});
const supertest = require('supertest')
const app = require('../server.js')
const Helpers = require('api/src/utils/helpers.js');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 4,
      min: 1
    }
  });
let randomNumber = Math.floor(Math.random() * 10) + 1;
 

request = supertest(app)
// TEST
describe('GET /test endpoint', ()=>{
    test('check if response is 200', async (done) =>{
        try {
            const response = await request.get('/test')
            expect(response.status).toBe(200,done())
            expect(response.body).toStrictEqual({},done())
        } catch (error) {
            
        }
    })
})
describe('POST /test endpoint', ()=>{
    test('check if response is 404', async (done) =>{
        try {
            const response = await request.post('/test')
            expect(response.status).toBe(404,done())
        } catch (error) {
            if (error) {
                console.log(error);
            }
            done()
        }
    })
})


// STORY
describe('POST /newstoryblock endpoint', ()=>{
    randomNumber = Math.floor(Math.random() * 10) + 1;
    const service = {
        content: lorem.generateSentences(1),
        story_id: randomNumber
    };
    test('check if response is created and story_id exist', async (done) =>{
        try {
            const response = await request.post('/newstoryblock').send(service)
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('check if story id exist ', async (done) =>{
        service.story_id = 111
        try {
            const response = await request.post('/newstoryblock').send(service)
            expect(response.status).toBe(404)
            done()
        } catch (error) {
            console.log(error)
        }
    })
    test('check if content length is above 100 and if it\'s a string', async (done) =>{
        service.content = "Hallo dit is een string groter als 100 de bedoeling is dat hij status 404 terug geeft en de test lukt."
        service.story_id = 1
        try {
            const response = await request.post('/newstoryblock').send(service)
            expect(response.status).toBe(404);
            done()
        } catch (error) {
            console.log(error);
        }
    })
})

describe('GET /storyblock endpoint', ()=>{
    test('check if response is created', async (done) =>{
        try {
            const response = await request.get('/storyblock/1')
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log(error);
        }
    })
})
describe('DELETE /storyblock endpoint', ()=>{
    test('check if the delete request has a uuid', async (done) =>{
        try {
            const service = {
                test: 'f70445c0-2910-11eb-891c-89c8941e6bf9'
            };
            const response = await request.delete('/storyblock/').send(service)
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log(error);
        }
    })
    test('check if storyblock is deleted', async (done) =>{
        try {
            const service = {
                uuid: 'f70445c0-2910-11eb-891c-89c8941e6bf9'
            };
            const response = await request.delete('/storyblock/').send(service)
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log(error);
        }
    })
})

describe('GET /storyblock endpoint', ()=>{
    test('check the endpoint send all storyblocks back', async (done) =>{
        try {
            const response = await request.get('/storyblock/')
            expect(response.status).toBe(200)
            done()
        } catch (error) {
            console.log(error);
        }
    })
})
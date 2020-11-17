const supertest = require('supertest')
const app = require('../server.js')


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
    test('check if response is created and story_id exist', async (done) =>{
        const service = {
            content: "Hallo ik ben andres",
            story_id: 2
        };
        try {
            const response = await request.post('/newstoryblock').send(service)
            expect(response.status).toBe(200,done())
        } catch (error) {
            console.log(error);
            done()
        }
    })
    test('story id does not exist ', async (done) =>{
        const service = {
            content: "Hallo ik ben andres",
            story_id: 111
        };
        try {
            const response = await request.post('/newstoryblock').send(service)
            expect(response.status).toBe(404,done())
        } catch (error) {
            console.log(error);
            done()
        }
    })
})
describe('GET /storyblock endpoint', ()=>{
    test('check if response is created', async (done) =>{
        try {
            const response = await request.get('/storyblock/2')
            expect(response.status).toBe(200,done())
        } catch (error) {
            console.log(error);
            done()
        }
    })
})
describe('DELETE /storyblock endpoint', ()=>{
    test('check if storyblock is deleted', async (done) =>{
        try {
            const service = {
                uuid: 'f70445c0-2910-11eb-891c-89c8941e6bf9'
            };
            const response = await request.delete('/storyblock/').send(service)
            expect(response.status).toBe(200,done())
        } catch (error) {
            console.log(error);
            done()
        }
    })
})


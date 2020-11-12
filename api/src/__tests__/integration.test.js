const supertest = require('supertest')
const app = require('../server.js')


request = supertest(app)
describe('GET /test endpoint', ()=>{
    test('check if response is 201', async (done) =>{
        try {
            const response = await request.get('/test')
            expect(response.status).toBe(201,done())
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
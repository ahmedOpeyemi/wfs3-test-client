const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)
chai.use(require('chai-json-schema'))

// Schemas
const contentSchema = require('./schemas/json/content.json')
const reqClassSchema = require('./schemas/json/req-classes.json')
const linkSchema = require('./schemas/json/link.json')

const BASE_URL = 'https://www.ldproxy.nrw.de/topographie'
const ENDPOINTS = {
    apiDefintion: '/api/?f=json',
    conformance: '/api/conformance'
}

const CONTENT_TYPES = {
    openApiJson: 'application/openapi+json;version=3.0',
    json: 'application/json'
}

describe('7.2.1. General requirements', () => {
    /**
     * Questions: For content negotiation, if accept field is not specified,
     * what should be the desired response? Empty body? or an error code?
     */
    it('Req 1: The service SHALL provide an API definition document at the path /api.', (done) => {
        chai.request(BASE_URL)
            .get(ENDPOINTS.apiDefintion)
            .set('Accept', CONTENT_TYPES.json)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.not.be.empty
                // Check for required fields.
                // TODO: this should be validating against the schema.
                expect(res.body).to.have.property('openapi')
                expect(res.body).to.have.property('info') // Check for required info fields.
                expect(res.body).to.have.property('paths')
                done()
            })
    })
})

describe('7.2.2 Support for generic clients', () => {
    it('Req 2: The server SHALL support the HTTP GET operation at the path /api/conformance', (done) => {
        const requiredFields = {
            conformsToField: 'conformsTo'
        }
        chai.request(BASE_URL)
            .get(ENDPOINTS.conformance)
            .set('Accept', CONTENT_TYPES.json)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(reqClassSchema)
                done()
            })
    })
})

describe('7.5. Support for cross-origin requests', () => {
    /**
     * Questions: Are there any other way to determine if a server allows other origins?
     */
    it('Rec 3:If the server is intended to be accessed from the browser, cross-origin requests SHOULD be supported', (done) => {
        chai.request(BASE_URL).options('/').end((err, res) => {
            expect(res.header).to.have.property('access-control-allow-origin', '*')
            done()
        })
    })
})

describe('7.8. Feature collection metadata', () => {
    it('Req 6: A successful execution of the operation SHALL be reported as a response with a HTTP status code 200.', (done) => {
        // Additionally; The content of that response SHALL be based upon the OpenAPI 3.0 schema
        chai.request(BASE_URL).get('/')
            .set('Accept', CONTENT_TYPES.json)
            .end((err, res) => {
                expect(res).to.have.status(200)
                // TODO: This should validate the nested properties.
                expect(res.body).to.be.jsonSchema(contentSchema)
                done()
            })
    })
})
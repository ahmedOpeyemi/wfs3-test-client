const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)
chai.use(require('chai-json-schema'))

const BASE_URL = 'https://www.ldproxy.nrw.de/kataster/'
const ENDPOINTS = {
    apiDefintion: 'api/',
    conformance: 'api/conformance'
}

const CONTENT_TYPES = {
    openApiJson: 'application/openapi+json;version=3.0',
    json: 'application/json'
}

describe('General requirements', () => {
    /**
     * Questions: For content negotiation, if accept field is not specified,
     * what should be the desired response? Empty body? or an error code?
     */
    it('The service SHALL provide an API definition document at the path /api.', (done) => {
        chai.request(BASE_URL)
            .get(ENDPOINTS.apiDefintion)
            .set('Accept', CONTENT_TYPES.json)
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                }
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

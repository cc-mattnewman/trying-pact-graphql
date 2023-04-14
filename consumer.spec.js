import path from 'path';
import GraphQLDummyService from './consumer.js';
import * as Pact from '@pact-foundation/pact';
import {expect} from 'chai';

const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

describe('DummyService GraphQL API', () => {

    const provider = new Pact.Pact({
        port: 4000,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        consumer: 'GovernorCustomer',
        provider: 'GovernorGraphQL',
        logLevel: LOG_LEVEL,
      });

    before(async () => await provider.setup());
    after(async () => await provider.finalize());

    const dummyService = new GraphQLDummyService('http://localhost', '4000');

    describe('getDummy()', () => {

        beforeEach(async () => {

            await provider.addInteraction(new Pact.ApolloGraphQLInteraction()
                .uponReceiving('a GetDummy Query')
                .withRequest({
                    path: '/graphql',
                    method: 'POST',
                })
                .withOperation("GetDummy")
                .withQuery(`
                    query GetDummy($id: Int!) {
                        dummy(id: $id) {
                          name
                          __typename
                        }
                    }`)
                .withVariables({
                    id: 42
                })
                .willRespondWith({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: {
                        data: {
                            dummy: {
                                name: Pact.Matchers.somethingLike('Superman2'),
                                __typename: 'Dummy'
                            }
                        }
                    }
                }));
        });

        it('sends a request according to contract', (done) => {
            dummyService.getDummy(42)
                .then(dummy => {
                    expect(dummy.name).equal('Superman2');
                })
                .then(() => {
                    provider.verify()
                        .then(
                            () => done(), 
                            error => {
                                console.warn( 'provider.verify ERROR', { error } );
                                done(error);
                            }
                        )
                }).catch((reject) => {
                    done(reject);
                    console.warn( 'WEIRD ERROR, catching', { reject } );
                });
        });

    });

});
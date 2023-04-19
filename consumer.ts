import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
} from "@apollo/client";
import gql from "graphql-tag"
import Dummy from "./dummy";
import fetch from 'cross-fetch';

class GraphQLHeroService {

    client;

    constructor(baseUrl, port) {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({uri: `${baseUrl}:${port}/graphql`, fetch })
        });
    }

    getDummy(id) {
        if (id == null) {
            throw new Error("dummy id must not be null!");
        }
        return this.client.query({
            query: gql`
              query GetDummy($id: Int!) {
                dummy(id: $id) {
                  name
                }
              }
            `,
            variables: {
                id: id
            }
        }).then((response) => {
            return new Promise((resolve, reject) => {
                try {
                    const dummy = new Dummy(response.data.dummy.name, id);
                    Dummy.validateName(dummy);
                    resolve(dummy);
                } catch (error) {
                    reject(error);
                }
            })
        });
    };

}

export default GraphQLHeroService;
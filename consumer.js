import {
    ApolloClient,
    InMemoryCache,
} from "@apollo/client/core/core.cjs";
import gql from "graphql-tag"
import Dummy from "./dummy.js";

class GraphQLHeroService {

    constructor(baseUrl, port) {
        this.client = new ApolloClient({
            uri: `${baseUrl}:${port}/graphql`,
            cache: new InMemoryCache()
        });
    }

    getDummy(id) {
        if (id == null) {
            throw new Error("dummy id must not be null!");
        }
        return this.client.query({
            query: gql`
              query GetDummy($id: Int!) {
                hero(id: $id) {
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
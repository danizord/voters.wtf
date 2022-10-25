import { client } from "./client";
import { graphql } from "./graphql";

const GetCommunitiesQuery = graphql(`
  query GetCommunities {
    communities {
      id
      name
    }
  }
`);

export const getHouses = async () => {
  return (await client.request(GetCommunitiesQuery)).communities.map((house) => ({
    ...house,
    slug: house.name.replaceAll(" ", "-").toLowerCase(),
  }));
};

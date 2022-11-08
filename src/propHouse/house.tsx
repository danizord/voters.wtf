import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { sort } from "radash";
import { client } from "./client";
import { graphql } from "./graphql";

export type HouseData = Awaited<ReturnType<typeof getHouseData>>;

const GetCommunities = graphql(`
  query GetCommunities {
    communities {
      id
      name
      profileImageUrl
      contractAddress
    }
  }
`);

export function useHouse() {
  const houses = useHouses();
  const slug = useRouter().query["houseSlug"] ?? "nouns";
  const id = houses.find((house) => house.slug === slug)!.id;
  const house = useQuery(
    ["house", id], //
    async () => await getHouseData(id),
    { suspense: true, staleTime: Infinity }
  ).data!;

  return { ...house, slug };
}

export function useHouses() {
  return useQuery(["houses"], { queryFn: async () => await getHouses(), suspense: true, staleTime: Infinity }).data!;
}

export async function getHouses() {
  const response = await client.request(GetCommunities);

  return sort(
    response.communities.map((house) => ({
      ...house,
      slug: house.name.replaceAll(" ", "-").toLowerCase(),
    })),
    (c) => c.id
  );
}

const GetHouseData = graphql(`
  query GetHouseData($houseId: Int!) {
    community(id: $houseId) {
      id
      name
      contractAddress
      auctions {
        id
        title
        proposalEndTime
        votingEndTime
        numWinners
        proposals {
          id
          address
          title
          tldr
          voteCount
          votes {
            id
            createdDate
            address
            weight
          }
        }
      }
    }
  }
`);

export const getHouseData = async (houseId: number) => {
  return (await client.request(GetHouseData, { houseId: houseId })).community;
};

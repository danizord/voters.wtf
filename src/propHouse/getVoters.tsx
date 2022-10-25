import { counting } from "radash";
import { client } from "./client";
import { graphql } from "./graphql";

const GetVoterAddresses = graphql(`
  query GetVoterAddresses($houseId: Int!) {
    community(id: $houseId) {
      auctions {
        proposals {
          votes {
            address
          }
        }
      }
    }
  }
`);

export const getVoters = async (houseId: number) => {
  const response = await client.request(GetVoterAddresses, { houseId });
  const votes = response.community.auctions.flatMap((auction) => {
    return auction.proposals.flatMap((proposal) => proposal.votes);
  });

  const votedRoundsByVoter = counting(votes, (vote) => vote.address);
  const voters = Object.keys(votedRoundsByVoter);

  return voters.map((voter) => ({
    address: voter,
    votedRounds: votedRoundsByVoter[voter]!,
  }));
};

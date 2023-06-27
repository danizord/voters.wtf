import { match } from "ts-pattern";
import { z } from "zod";
import { Address } from "./accounts";
import { getRoundById } from "./propHouse";

export async function getVotingPower(
  roundId: number,
  voterAddress: Address
): Promise<number> {
  const round = await getRoundById(roundId);

  return await match(round.community)
    .with(1, async () => getNounishVotingPower(roundId, voterAddress))
    .run();
}

const getNounishVotingPower = async (
  roundId: number,
  voterAddress: Address
) => {
  const voters = await getRoundVoters(roundId);
  const voter = voters.find((v) => voterAddress.equals(v.address));

  return voter?.votingPower ?? 0;
};

export const getRoundVoters = async (roundId: number) => {
  const round = await getRoundById(roundId);
  const parsedBlockTag = parseBlockTag(round.balanceBlockTag);

  if (!parsedBlockTag) throw new Error("Failed to parse block tag");

  // Todo: traverse pagination
  const response = await fetch(
    `https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          delegates(block: { number: ${parsedBlockTag} }, where: { delegatedVotesRaw_gt: "0" }, first: 1000) {
            id
            delegatedVotesRaw
          }
        }`,
      }),
    }
  );

  const { data } = z
    .object({
      data: z.object({
        delegates: z
          .array(
            z.object({
              id: z.string(),
              delegatedVotesRaw: z.string().transform((data) => parseInt(data)),
            })
          )
          .min(101)
          .max(999),
      }),
    })
    .parse(await response.json());

  return data.delegates.map((delegate) => ({
    address: new Address(delegate.id),
    votingPower: delegate.delegatedVotesRaw * 10,
  }));
};

/**
 * Attempt to resolve a blocktag into a number, if the tag isn't a number return undefined.
 */
export const parseBlockTag = (
  blockTag: number | string | "latest" | undefined
): number | undefined => {
  if (typeof blockTag === "number" || typeof blockTag === "undefined")
    return blockTag;
  let blockNumber: number | undefined = undefined;
  const parsedBlockTag = blockTag.includes("0x")
    ? parseInt(blockTag, 16)
    : parseInt(blockTag, 10);
  if (!isNaN(parsedBlockTag)) blockNumber = parsedBlockTag;
  return blockNumber;
};

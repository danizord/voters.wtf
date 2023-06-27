import z from "zod";
import { Address } from "./accounts";

export async function getHouseById(houseId: number) {
  return await call(`/communities/${houseId}`, House);
}

export async function getHouseBySlug(houseSlug: string) {
  return await call(`/communities/name/${houseSlug}`, House);
}

export async function getCommunities() {
  return await call("/communities", Houses);
}

export async function getRounds() {
  return await call("/auctions", Rounds);
}

export async function getRoundBySlug(houseSlug: string, roundSlug: string) {
  const rounds = await getRounds();

  // const URLEncoded = encodeURIComponent(roundSlug);

  const round = rounds.find(
    (round) =>
      // slugify(round.house.name) === houseSlug &&
      encodeURIComponent(slugify(round.title)) === roundSlug
  );

  if (!round) {
    throw new Error(`Failed to find round ${roundSlug} in house ${houseSlug}`);
  }

  return round;
}

export async function getRoundById(roundId: number) {
  const rounds = await getRounds();
  const round = rounds.find((round) => round.id === roundId);

  if (!round) {
    throw new Error(`Failed to find round ${roundId}`);
  }

  return round;
}

export async function getProposals(roundId: string | number) {
  const proposals = await call(`/auctions/${roundId}/proposals`, Proposals);

  return proposals
    .filter((proposal) => proposal.visible && !proposal.deletedAt)
    .map((p) => ({
      ...p,
      voteCount: p.voteCountFor,
      author: { address: new Address(p.address) },
    }));
}

export async function getVotes(roundId: string | number) {
  const proposals = await getProposals(roundId);

  const votes = proposals.flatMap((proposal) => {
    const proposalVotes = proposal.votes.map((vote) => ({
      ...vote,
      voter: { address: new Address(vote.address) },
      proposal: {
        id: proposal.id,
        title: proposal.title,
        voteCount: proposal.voteCount,
      },
    }));

    // Merge sequential votes from the same address
    const mergedVotes = proposalVotes.reduce((acc, vote) => {
      const lastVote = acc[acc.length - 1];

      if (lastVote && lastVote.voter.address.equals(vote.voter.address)) {
        lastVote.weight += vote.weight;
      } else {
        acc.push(vote);
      }

      return acc;
    }, [] as typeof proposalVotes);

    return mergedVotes;
  });

  // Sort by ID
  return votes.sort((a, b) => a.id - b.id);
}

const DateTime = z.string().datetime().pipe(z.coerce.date());

const House = z.object({
  id: z.number(),
  name: z.string(),
  profileImageUrl: z.string().url(),
  contractAddress: z.string().startsWith("0x"),
  description: z.string(),
});

const Houses = z.array(House);

const Round = z.object({
  id: z.number(),
  title: z.string(),
  community: z.number(),

  fundingAmount: z.string(),
  currencyType: z.string(),
  numWinners: z.number(),

  balanceBlockTag: z.number(),
  startTime: DateTime,
  proposalEndTime: DateTime,
  votingEndTime: DateTime,
});

const Rounds = z.array(Round);

const Proposal = z.object({
  id: z.number(),
  visible: z.boolean(),
  title: z.string(),
  deletedAt: z.string().nullable(),
  address: z.string(),
  voteCountFor: z.number(),
  votes: z.array(
    z.object({
      id: z.number(),
      address: z.string(),
      signatureState: z.string(),
      direction: z.number(),
      createdDate: DateTime,
      weight: z.number(),
      // blockHeight: z.number(),
    })
  ),
});

const Proposals = z.array(Proposal);

async function call<T>(path: string, schema: z.ZodType<T>) {
  const url = `https://prod.backend.prop.house${path}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Got HTTP ${response.status} from ${url}`);
  }

  return schema.parse(await response.json());
}

export const slugify = (s: string) => s.toLowerCase().replace(/ /g, "-");

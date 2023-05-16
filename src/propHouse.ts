import assert from "assert";

export async function getHouses() {
  const response = await fetch("https://prod.backend.prop.house/communities");
  assert(response.ok, "Failed to fetch houses");

  const houses = (await response.json()) as {
    id: number;
    name: string;
    profileImageUrl: string;
    contractAddress: string;
    description: string;
  }[];

  return houses;
}

export async function getHouseBySlug(houseSlug: string) {
  const response = await fetch(
    `https://prod.backend.prop.house/communities/name/${houseSlug}`
  );

  assert(response.ok, "Failed to fetch house");

  const house = (await response.json()) as {
    id: number;
    visible: boolean;
    contractAddress: string;
    name: string;
    profileImageUrl: string;
    createdDate: string;
    lastUpdatedDate: string | null;
    description: string;
    numAuctions: number;
    ethFunded: number;
    totalFunded: string;
    numProposals: number;
  };

  return house;
}

export async function getRounds() {
  const response = await fetch("https://prod.backend.prop.house/auctions");
  assert(response.ok, "Failed to fetch rounds");

  const data = (await response.json()) as {
    id: number;
    visible: boolean;
    title: string;
    startTime: string;
    proposalEndTime: string;
    votingEndTime: string;
    fundingAmount: string;
    currencyType: string;
    description: string;
    numWinners: number;
    createdDate: string;
    lastUpdatedDate: string | null;
    balanceBlockTag: number;
    community: number;
    numProposals: number[];
  }[];

  const houses = await getHouses();
  const housesById = houses.reduce((acc, house) => {
    acc[house.id] = house;
    return acc;
  }, {} as Record<number, (typeof houses)[0]>);

  const rounds = data
    .map((data) => ({
      id: data.id.toString(),
      title: data.title,
      url: `/${slugify(housesById[data.community]!.name)!}/${slugify(
        data.title
      )}`,

      fundingAmount: data.fundingAmount,
      currencyType: data.currencyType,
      numWinners: data.numWinners,

      startTime: new Date(data.startTime),
      proposalEndTime: new Date(data.proposalEndTime),
      votingEndTime: new Date(data.votingEndTime),

      house: {
        id: housesById[data.community]!.id,
        name: housesById[data.community]!.name,
        image: housesById[data.community]!.profileImageUrl,
      },
    }))
    .sort((a, b) => b.proposalEndTime.getTime() - a.proposalEndTime.getTime());

  return rounds;
}

export async function getRoundBySlug(houseSlug: string, roundSlug: string) {
  const rounds = await getRounds();
  const round = rounds.find(
    (round) =>
      slugify(round.house.name) === houseSlug &&
      slugify(round.title) === roundSlug
  );
  assert(round, "Failed to find round");

  return round;
}

export async function getProposals(roundId: string) {
  const response = await fetch(
    `https://prod.backend.prop.house/auctions/${roundId}/proposals`
  );
  assert(response.ok, "Failed to fetch proposals");

  const data = (await response.json()) as {
    id: number;
    address: string;
    visible: boolean;
    title: string;
    tldr: string;
    what: string;
    voteCount: string;
    createdDate: string;
    lastUpdatedDate: string | null;
    deletedAt: string | null;
    votes: {
      id: number;
      address: string;
      signatureState: string;
      direction: number;
      createdDate: string;
      weight: number;
      blockHeight: number;
    }[];
  }[];

  return data
    .filter((proposal) => proposal.visible && !proposal.deletedAt)
    .map((data) => {
      return {
        id: data.id.toString(),
        title: data.title,
        author: { address: data.address },
      };
    });
}

export async function getVotes(roundId: string) {
  const response = await fetch(
    `https://prod.backend.prop.house/auctions/${roundId}/proposals`
  );
  assert(response.ok, "Failed to fetch proposals");

  const data = (await response.json()) as {
    id: number;
    address: string;
    visible: boolean;
    title: string;
    tldr: string;
    what: string;
    voteCount: string;
    createdDate: string;
    lastUpdatedDate: string | null;
    deletedAt: string | null;
    votes: {
      id: number;
      address: string;
      signatureState: string;
      direction: number;
      createdDate: string;
      weight: number;
      blockHeight: number;
    }[];
  }[];

  return data
    .filter((proposal) => proposal.visible && !proposal.deletedAt)
    .flatMap((proposal) => {
      return proposal.votes.map((vote) => {
        return {
          id: vote.id,
          proposalId: proposal.id.toString(),
          weight: vote.weight,
          voter: { address: vote.address },
          createdAt: new Date(vote.createdDate),
        };
      });
    })
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

const slugify = (s: string) => s.toLowerCase().replace(/ /g, "-");

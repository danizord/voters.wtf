import { getProposals, getRoundById } from "src/propHouse";

export async function getRanking(roundId: number) {
  const proposals = await getProposals(roundId);
  const round = await getRoundById(roundId);
  const sorted = proposals.sort((a, b) => b.voteCount - a.voteCount);
  const ranking = sorted.slice(0, round.numWinners);

  return ranking;
}

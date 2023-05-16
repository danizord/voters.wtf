import { getProposals, getRoundBySlug, getVotes } from "src/propHouse";
import { Ranking } from "./ranking";
import { TimelineItem } from "./timeline";

export default async function RoundPage({ params }: { params: { house: string, round: string } }) {
  const houseSlug = params.house;
  const roundSlug = params.round;
  const round = await getRoundBySlug(houseSlug, roundSlug);

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-wrap items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">#{round.id} {round.title}</h1>
        </div>
      </div>

      <Votes roundId={round.id}></Votes>
      <Proposals roundId={round.id}></Proposals>

      {/* <RoundState round={round} proposals={proposals}>
      </RoundState> */}
    </div>
  );
}

// Todo:
// - Cross-browser styling with Radix UI
// - Scroll to the end by default
// - Add arrow buttons for scrolling?
export async function Votes({ roundId }: { roundId: string }) {
  const votes = await getVotes(roundId);

  // A horizontal list of votes
  // For now, let's just pust a small gray circle as placeholder for each vote
  return <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-y-auto">
    {votes.map((vote) => (
      <TimelineItem key={vote.id} voteId={vote.id}>
        <div className="w-16 h-16 rounded-full bg-gray-500 hover:border-2 hover:border-red-500">

        </div>
      </TimelineItem>
    ))}
  </div>
}

export async function Proposals({ roundId }: { roundId: string }) {
  const proposals = (await getProposals(roundId));

  const items = Object.fromEntries(proposals.map((proposal) => [proposal.id, (
    <div key={proposal.id} className="text-sm">
      <p className="font-bold">{proposal.title}</p>
      {/* Todo: author */}
      <p className="text-gray-500">{proposal.id}</p>
    </div>
  )]));

  const votes = await getVotes(roundId);

  return <Ranking proposals={items} votes={votes} />
}

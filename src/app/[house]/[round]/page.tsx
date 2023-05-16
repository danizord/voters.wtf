import { Suspense } from "react";
import { getAvatar, getName } from "src/accounts";
import { getProposals, getRoundBySlug, getVotes } from "src/propHouse";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/ui/tooltip";
import { Ranking } from "./ranking";
import { TimelineItem } from "./timeline";

export const runtime = 'edge';

export default async function RoundPage({ params }: { params: { house: string, round: string } }) {
  const houseSlug = params.house;
  const roundSlug = params.round;
  const round = await getRoundBySlug(houseSlug, roundSlug);

  return (
    <div className="container pt-4 space-y-4">
      <div className="flex w-full flex-wrap items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">#{round.id} {round.title}</h1>
        </div>
      </div>

      <Votes roundId={round.id}></Votes>
      <Proposals roundId={round.id}></Proposals>
    </div>
  );
}

// Todo:
// - Cross-browser styling with Radix UI
// - Scroll to the end by default
// - Add arrow buttons for scrolling?
async function Votes({ roundId }: { roundId: string }) {
  const votes = await getVotes(roundId);

  // A horizontal list of votes
  // For now, let's just pust a small gray circle as placeholder for each vote
  return <div className="flex overflow-y-auto gap-2">
    {votes.map((vote) => (
      <TimelineItem key={vote.id} voteId={vote.id}>
        <div className="flex-shrink-0 flex-grow-0 w-16 h-16 rounded-full hover:border-2 hover:border-red-500 overflow-clip">
          <Suspense fallback={<div className="bg-gray-500 w-full h-full"></div>}>
            <Avatar address={vote.voter.address} />
          </Suspense>
        </div>
      </TimelineItem>
    ))}
  </div>
}

async function Avatar({ address }: { address: string }) {
  const name = await getName(address);
  const avatar = await getAvatar(address);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {avatar
          // ? <Image unoptimized src={avatar} alt={name} height={64} width={64} />
          ? <img src={avatar} alt={name} height="64px" width="64px" />
          : <div className=" w-full h-full bg-green-500" />}
      </TooltipTrigger>
      <TooltipContent>
        {name}
      </TooltipContent>
    </Tooltip>
  )
}

async function Proposals({ roundId }: { roundId: string }) {
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

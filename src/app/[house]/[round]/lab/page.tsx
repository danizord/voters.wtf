import { Suspense } from "react";
import { AccountName, Avatar } from "src/accounts";
import {
  getProposals,
  getRoundById,
  getRoundBySlug,
  getVotes,
} from "src/propHouse";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/ui/tooltip";
import { Feed as FeedSection } from "../feed";
import { Ranking } from "../ranking";
import { TimelineItem } from "../timeline";
import { VoteView } from "../vote";
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  Text,
  Bold,
  Badge,
} from "@tremor/react";
import { getRanking } from "../service";

// export const runtime = "edge";

// Todo:
// - [X] Heading
// - [X] Tabs
// - [-] Timeline: history navigation, vote impact, ranking changes
// - [ ] Thin timeline overview
// - [ ] < Horizontal Feed navigation >
// - [ ] Vote details
// - [ ] Chart: vote impact
// - [ ] Ranking (collapsible)
// - [ ] Proposals tab
// - [ ] Chart: vote counts over time
// - [ ] Chart: bump chart
// - [ ] Proposal details
// - [ ] Al voters
// - [ ] Comments
// - [ ] Voters tab
// - [ ] Chart: voter dominance over time
export default async function RoundPage({
  params,
}: {
  params: { house: string; round: string };
}) {
  const houseSlug = params.house;
  const roundSlug = params.round;
  const round = await getRoundBySlug(houseSlug, roundSlug);

  return (
    <>
      <div className="container space-y-6 px-2 pt-4">
        <SummarySection roundId={round.id} />

        <TabGroup className="border-t">
          <TabList>
            <Tab>Timeline</Tab>
            <Tab>Proposals</Tab>
            <Tab>Voters</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <input type="range" className="w-full" />
              <SmallRanking roundId={round.id} />
              <div className="mt-6"> </div>
              <FeedSection roundId={round.id} />
            </TabPanel>
            <TabPanel>Proposals</TabPanel>
            <TabPanel>Voters</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </>
    // // {/* <div className="container space-y-4 pt-4">
    //   {/* <SummarySection roundId={round.id} />
    //   <TimelineSection roundId={round.id} />
    //   <FeedSection roundId={round.id} />
    //   <RankingSection roundId={round.id} /> */}
    // </div>
  );
}

async function SummarySection({ roundId }: { roundId: number }) {
  const round = await getRoundById(roundId);

  return (
    <div className="flex flex-wrap items-start justify-between">
      <div>
        <h1 className="mb-2 text-2xl font-bold">
          #{round.id} {round.title}
        </h1>
        {/* <p>
          Prize: {round.fundingAmount} {round.currencyType} x {round.numWinners}
        </p>
        <p>Start: {round.startTime.toLocaleString()}</p>
        <p>End: {round.votingEndTime.toLocaleString()}</p>
        <p>BlockTag: {round.balanceBlockTag}</p> */}
      </div>
    </div>
  );
}

async function SmallRanking({ roundId }: { roundId: number }) {
  const proposals = await getRanking(roundId);

  return (
    <List>
      {proposals.map((proposal, i) => (
        <ListItem key={proposal.id} className="space-x-2">
          <Badge>{i + 1}</Badge>
          <Text className="flex-grow truncate">{proposal.title}</Text>
          <Text>{proposal.voteCount}</Text>
        </ListItem>
      ))}
    </List>
    // Todo: Add a "show more" here
  );
}

async function TimelineSection({ roundId }: { roundId: string }) {
  return <div className="flex flex-col"></div>;
}

// Todo:
// - Cross-browser styling with Radix UI
// - Scroll to the end by default
// - Add arrow buttons for scrolling?
async function Votes({ roundId }: { roundId: number }) {
  const votes = await getVotes(roundId);

  // A horizontal list of votes
  // For now, let's just pust a small gray circle as placeholder for each vote
  return (
    <>
      <div className="flex gap-2 overflow-y-auto">
        {votes.map((vote) => (
          <TimelineItem key={vote.id} voteId={vote.id}>
            <div className="h-16 w-16 flex-shrink-0 flex-grow-0 overflow-clip rounded-full hover:border-2 hover:border-red-500">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Suspense
                    fallback={<div className="h-full w-full bg-gray-500"></div>}
                  >
                    <Avatar address={vote.voter.address} />
                  </Suspense>
                </TooltipTrigger>
                <TooltipContent>
                  <Suspense>
                    <AccountName address={vote.voter.address} />
                  </Suspense>
                </TooltipContent>
              </Tooltip>
            </div>
          </TimelineItem>
        ))}
      </div>
      <VoteView />
    </>
  );
}

async function RankingSection({ roundId }: { roundId: string }) {
  const proposals = await getProposals(roundId);

  const items = Object.fromEntries(
    proposals.map((proposal) => [
      proposal.id,
      <div key={proposal.id} className="text-sm">
        <p className="font-bold">{proposal.title}</p>
        {/* Todo: author */}
        <p className="text-gray-500">
          <Suspense>
            <AccountName address={proposal.author.address} />
          </Suspense>
        </p>
      </div>,
    ])
  );

  const votes = await getVotes(roundId);

  return <Ranking proposals={items} votes={votes} />;
}

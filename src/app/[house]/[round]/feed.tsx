import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import {
  Badge,
  BadgeDelta,
  Bold,
  Card,
  CategoryBar,
  DeltaBar,
  Flex,
  List,
  ListItem,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import { AccountName, Address } from "src/accounts";
import { getVotes } from "src/propHouse";
import { getRoundVoters, getVotingPower } from "src/votingPower";
import { ChevronDown } from "lucide-react";

export async function Feed({ roundId }: { roundId: number }) {
  const items = await getFeedItems(roundId);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <Card key={i}>
          <Flex justifyContent="start" className="space-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <Bold>
                <AccountName address={item.voter.address} />
              </Bold>
              <Text>At {item.timestamp.toLocaleString()}</Text>
            </div>
          </Flex>

          <Flex>
            <Text>
              <Bold>Proposal</Bold>
            </Text>
            <Text>
              <Bold>Weight</Bold>
            </Text>
          </Flex>
          <List>
            {item.votes.map((vote, j) => (
              // Todo: Ranking changes
              // Todo: Total votes changes
              // Todo: Vote list
              // Todo: Used voting power | amount of votes cast
              // Todo: Check if we can use a horizontal stacked bars chart instead
              // Collapse (2 lines)
              // - Ranking (delta) | Title (truncated) | \/ (Expand)
              // - PrevVotes | (VotesBar: PrevVotes | AddedVotes | (VotesToWin|MaxVotes|?) | CurrentVotes
              // Expanded
              // - Show deltas from other voters

              <ListItem key={j} className="space-x-2">
                <Badge size="lg">1</Badge>
                <Flex flexDirection="col">
                  <Flex className="space-x-2">
                    <Text className="flex-shrink truncate">
                      {vote.proposal.title}
                    </Text>
                    <ChevronDown className="h-4" />
                  </Flex>

                  <Flex>
                    <CategoryBar
                      values={[
                        ((vote.proposal.voteCount - vote.weight) / 207) * 100,
                        (vote.weight / 207) * 100,
                      ]}
                      showLabels={false}
                      colors={["yellow", "emerald", "slate"]}
                      // markerValue={62}
                      className="flex-grow"
                    />
                    <Text className="text-green-500">+{vote.weight}</Text>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </List>
          {/* <p>Voting Power: {item.voter.votingPower}</p>
          <p>Remaining: {item.voter.remainingVotes}</p> */}
        </Card>
      ))}
    </div>
  );
}

/**
 * Aggregates multiple subsequent votes from the same voter
 */
const getFeedItems = async (roundId: number) => {
  const votes = await getVotes(roundId);

  const items = [] as {
    timestamp: Date;
    voter: {
      address: Address;
      // votingPower: number;
      // remainingVotes: number;
    };
    votes: typeof votes;
  }[];

  // const votingPowers: Record<string, number> = {};

  // Todo: Also aggregate subsequent votes from the same voter for the same proposal
  for (const vote of votes) {
    // const remainingVotingPower = (votingPowers[vote.voter.address.toString()] ?? await getVotingPower(roundId, vote.voter.address)) - vote.weight;
    // votingPowers[vote.voter.address.toString()] = remainingVotingPower;

    const lastItem = items[items.length - 1];

    if (lastItem && lastItem.voter.address.equals(vote.voter.address)) {
      lastItem.votes.push(vote);
      lastItem.timestamp = vote.createdDate;
      // lastItem.voter.remainingVotes -= vote.weight;
    } else {
      items.push({
        voter: {
          address: vote.voter.address,
          // votingPower: await getVotingPower(roundId, vote.voter.address),
          // remainingVotes: remainingVotingPower,
        },
        timestamp: vote.createdDate,
        votes: [vote],
      });
    }
  }

  return items.reverse();
};

// - getRanking
// - countVotes
// - getVotes()
// -

async function ProposalVotesBar({
  proposalId,
  roundId,
  highlightVoteId,
}: {
  proposalId: number;
  roundId: number;
  highlightVoteId?: number;
}) {
  const votes = await getVotes(roundId);

  // If highlighting a specific vote, we filter only the votes before that vote
  const filteredVotes = highlightVoteId
    ? votes.filter((vote) => vote.id <= highlightVoteId)
    : votes;

  const voteCounts = countVotes(filteredVotes);
  const maxVoteCount = Math.max(...Object.values(voteCounts));

  // Votes for this proposal
  const proposalVotes = filteredVotes.filter(
    (vote) => vote.proposalId === proposalId
  );

  return (
    <progress
      className="w-full"
      max={maxVoteCount}
      value={voteCounts[proposalId]}
    />
  );
}

function countVotes(votes: Awaited<ReturnType<typeof getVotes>>) {
  const voteCounts = {} as Record<number, number>;

  for (const vote of votes) {
    voteCounts[vote.proposalId] =
      (voteCounts[vote.proposalId] ?? 0) + vote.weight;
  }

  return voteCounts;
}

async function VotingPowerBar(
  roundId: number,
  item: {
    timestamp: Date;
    voter: {
      address: Address;
      votingPower: number;
      remainingVotes: number;
    };
    votes: {
      voter: { address: Address };
      proposalId: number;
      id: number;
      address: string;
      signatureState: string;
      direction: number;
      createdDate: Date;
      weight: number;
    }[];
  }
) {
  const voters = await getRoundVoters(roundId);
  const maximumVotingPower = voters.reduce(
    (max, voter) => Math.max(max, voter.votingPower),
    0
  );

  // Bar size is relative to the maximum voting power of all voters. But we calc it in a way that the small bars are not too small.
  const barSize = (item.voter.votingPower / maximumVotingPower) * 100;

  return (
    <progress
      max={item.voter.votingPower}
      value={item.voter.remainingVotes}
      style={{ width: `${barSize}%` }}
    ></progress>
  );
}

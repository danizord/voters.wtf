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
import { FeedItem } from "@/app/[house]/[round]/feed";

export function VotesCard({ item }: { item: FeedItem }) {
  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <Bold>{/* <AccountName address={item.voter.address} /> */}</Bold>
          <Text>At {item.timestamp.toLocaleString()}</Text>
        </div>
      </Flex>

      {/* {VotingPowerBar(roundId, item)} */}
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
  );
}

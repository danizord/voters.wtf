import {
  Badge,
  Bold,
  Button,
  Card,
  Flex,
  List,
  ListItem,
  Metric,
  Text,
} from "@tremor/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { match } from "ts-pattern";
import { getRounds } from "./service";

// export const runtime = "edge";

export default async function HomePage() {
  const rounds = await getRounds();

  // Todo:
  // - Community avatar
  // - Mini timeline progres
  // - Number of props
  return (
    <div className="container mx-auto max-w-sm pt-4">
      <ul className="space-y-6">
        {rounds.map((round) => {
          return (
            <li key={round.id}>
              <a href={round.url}>
                <Card>
                  <Flex>
                    <Bold>{round.title}</Bold>
                    {match(round.status)
                      .with("NOT_STARTED", () => (
                        <Badge color="yellow">Not started</Badge>
                      ))
                      .with("PROPOSING", () => (
                        <Badge color="blue">Proposing</Badge>
                      ))
                      .with("VOTING", () => <Badge color="green">Voting</Badge>)
                      .with("ENDED", () => <Badge color="red">Ended</Badge>)
                      .exhaustive()}
                  </Flex>
                  <Text>{round.house.name}</Text>

                  <List className="mt-4">
                    {[
                      {
                        "Proposing starts": formatDistanceToNow(
                          round.startTime,
                          {
                            addSuffix: true,
                          }
                        ),
                      },
                      {
                        "Voting starts": formatDistanceToNow(
                          round.proposalEndTime,
                          { addSuffix: true }
                        ),
                      },
                      {
                        "Voting ends": formatDistanceToNow(
                          round.votingEndTime,
                          { addSuffix: true }
                        ),
                      },
                    ]
                      .map((o) => Object.entries(o)[0])
                      .map(([key, value]: any) => (
                        <ListItem key={key}>
                          <Text>{key}</Text>
                          <Text>{value}</Text>
                        </ListItem>
                      ))}
                  </List>

                  <Flex className="mt-6 border-t pt-4">
                    <div>
                      <Text>Funding</Text>
                      <Flex
                        alignItems="baseline"
                        justifyContent="start"
                        className="space-x-1"
                      >
                        <Metric>
                          {round.fundingAmount} {round.currencyType}
                        </Metric>
                        <Text>
                          x <Bold>{round.numWinners}</Bold>
                        </Text>
                      </Flex>
                    </div>

                    <Link href={round.url}>
                      <Button
                        size="xs"
                        variant="light"
                        // Todo: add icon support from RSC
                        // icon={ArrowNarrowRightIcon}
                        iconPosition="right"
                      >
                        View more
                      </Button>
                    </Link>
                  </Flex>
                </Card>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

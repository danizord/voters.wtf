import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import { sort, sum } from "radash";
import { useHouse, useVoter } from "src/propHouse";

export const VotedProposals = () => {
  const house = useHouse();
  const voter = useVoter()!;
  const rounds = useVotedRounds();

  const votedRounds = rounds.filter((round) =>
    round.proposals.some((proposal) => {
      return proposal.votes.some((vote) => {
        return vote.address === voter.address;
      });
    })
  );

  return (
    <Stack spacing={6}>
      {votedRounds.map((round) => {
        const lowestWinningScore =
          sort(round.proposals, (p) => p.voteCount, true)[round.numWinners - 1]?.voteCount ?? 0;

        const votes = sort(
          round.proposals
            .flatMap((proposal) => proposal.votes.map((vote) => ({ ...vote, proposal })))
            .filter((vote) => vote.address === voter.address),
          (vote) => vote.weight,
          true
        );

        const totalWeight = sum(votes, (vote) => vote.weight);

        return (
          <Stack
            key={round.id}
            spacing={4}
            _light={{ backgroundColor: "gray.100" }}
            _dark={{ backgroundColor: "whiteAlpha.100" }}
            p={6}
            rounded={"xl"}
          >
            <Heading size={"md"}>{round.title}</Heading>

            <TableContainer>
              <Table variant="simple" size={"md"}>
                <Thead>
                  <Tr>
                    <Th px={0}>Weight</Th>
                    <Th px={4} width="full">
                      Proposal
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {votes.map((vote) => {
                    const votingFinished = new Date(round.votingEndTime) < new Date();
                    const isWinner = votingFinished && vote.proposal.voteCount >= lowestWinningScore;

                    return (
                      <Tr key={vote.id}>
                        <Td px={0} textAlign="right" valign="top">
                          <CircularProgress value={vote.weight} max={totalWeight} color="green.400" size="50px">
                            <CircularProgressLabel fontSize="md">{vote.weight}</CircularProgressLabel>
                          </CircularProgress>
                        </Td>
                        <Td px={4} valign="top">
                          <Link
                            href={`https://prop.house/${house.slug}/${round.slug}/${vote.proposal.id}`}
                            target="_blank"
                          >
                            <HStack spacing={2} align="start">
                              <Heading size={"sm"}>
                                {vote.proposal.title} <ExternalLinkIcon mx="2px" />
                              </Heading>
                              {isWinner && <Badge colorScheme="green">Winner</Badge>}
                            </HStack>

                            <Text mt={1} fontSize="sm">
                              {vote.proposal.tldr}
                            </Text>
                          </Link>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        );
      })}
      {votedRounds.length === 0 && (
        <Alert status="info" rounded={"lg"}>
          <AlertIcon />
          {voter.name} have not voted in {house.name} house yet.
        </Alert>
      )}
    </Stack>
  );
};

export const useVotedRounds = () => {
  const house = useHouse();

  return sort(
    house.auctions.map((auction) => {
      return {
        ...auction,
        slug: auction.title.toLowerCase().replace(" ", "-"),
        proposalEndTime: new Date(auction.proposalEndTime),
      };
    }),
    (auction) => auction.proposalEndTime.getTime(),
    true
  );
};

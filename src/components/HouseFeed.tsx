import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Heading,
  HStack,
  Link as ChakraLink,
  List,
  ListItem,
  SkeletonCircle,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { sort, sum } from "radash";
import { useMemo, useRef } from "react";
import { useHouse, useVoterQuery } from "src/propHouse";
import { useEnsName } from "wagmi";

export const HouseFeed = () => {
  const scrollWindowRef = useRef<HTMLDivElement>(null);
  const house = useHouse();

  const feed = useMemo(() => {
    const votes = house.auctions.flatMap((auction) => {
      return auction.proposals.flatMap((proposal) =>
        proposal.votes.map((vote) => {
          return {
            voter: vote.address,
            round: auction.title,
            createdDate: new Date(vote.createdDate),
            weight: vote.weight,
            proposal: proposal,
          };
        })
      );
    });

    const sorted = sort([...votes], (e) => e.createdDate.getTime(), true);

    const aggregated = sorted.reduce((events, vote) => {
      const proposal = {
        id: vote.proposal.id,
        title: vote.proposal.title,
        by: vote.proposal.address,
        url: `https://prop.house/${house.slug}/${vote.round.toLowerCase().replace(" ", "-")}/${vote.proposal.id}`,
        weight: vote.weight,
      };
      const previous = events[events.length - 1];

      if (previous && previous.voter === vote.voter && previous.round === vote.round) {
        previous.proposals.push(proposal);

        return events;
      }

      events.push({
        type: "VOTE",
        timestamp: vote.createdDate,
        voter: vote.voter,
        round: vote.round,
        proposals: [proposal],
      });

      return events;
    }, [] as { type: "VOTE"; timestamp: Date; voter: string; round: string; proposals: { id: number; title: string; by: string; url: string; weight: number }[] }[]);

    return aggregated;
  }, [house]);

  const virtualizer = useVirtualizer({
    count: feed.length ?? 0,
    getScrollElement: () => scrollWindowRef.current,
    estimateSize: (i) => 144 + feed[i]!.proposals.length * 61,
    overscan: 10,
  });

  return (
    <Box ref={scrollWindowRef} overflowY="scroll" flex="1" maxH={"full"}>
      <Container as={Stack} spacing={6} py={6} maxW={"container.lg"}>
        <Heading>Feed</Heading>

        <List h={virtualizer.getTotalSize()} position="relative" maxW="container.lg">
          {virtualizer.getVirtualItems().map((item) => (
            <ListItem
              key={item.key}
              width={"full"}
              style={{
                position: "absolute",
                top: 0,
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <FeedItem event={feed[item.key]} />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export const FeedItem = ({ event }) => {
  const house = useHouse();
  const totalWeight = sum(event.proposals.map((p) => p.weight));
  const voter = useVoterQuery(event.voter);

  return (
    <Box p={4} mb={6} bg={useColorModeValue("gray.100", "whiteAlpha.100")} rounded={"xl"}>
      <HStack align="start" spacing={4} mb={4}>
        <Link href={`/${house.slug}/${event.voter}`}>
          {voter.isLoading ? <SkeletonCircle size="10" /> : <Avatar src={voter.avatar} />}
        </Link>

        <Stack spacing={1}>
          <Heading mt={1} fontSize="md" noOfLines={1}>
            <ChakraLink as={Link} fontWeight={"bold"} href={`/${house.slug}/${voter.slug}`}>
              {voter.name}
            </ChakraLink>
            {` voted for `}
            {event.proposals.length > 1 ? `${event.proposals.length} proposals` : `proposal #${event.proposals[0].id}`}
          </Heading>
          <Text fontSize="sm" noOfLines={1}>
            <ChakraLink>{event.round}</ChakraLink> | {formatDistanceToNow(event.timestamp)} ago
          </Text>
        </Stack>
      </HStack>

      <TableContainer whiteSpace="pre-wrap">
        <Table variant="simple" size={"sm"}>
          <Thead>
            <Tr>
              <Th px={0} fontSize="2xs">
                Weight
              </Th>
              <Th px={4} fontSize="2xs" width="full">
                Proposal
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {event.proposals.map((proposal, i) => {
              return <ProposalLine key={i} proposal={proposal} totalWeight={totalWeight} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function ProposalLine({ proposal, totalWeight }) {
  const by = useEnsName({ address: proposal.by }).data! ?? trimEthAddress(proposal.by);

  return (
    <Tr>
      <Td px={0} textAlign="right" valign="top">
        <CircularProgress value={proposal.weight} max={totalWeight} color="green.400" size={"44px"}>
          <CircularProgressLabel fontSize="sm">{proposal.weight}</CircularProgressLabel>
        </CircularProgress>
      </Td>

      <Td px={4} valign="top">
        <Link href={proposal.url} target="_blank">
          <HStack spacing={2} align="start">
            <Heading size={"xs"} noOfLines={1}>
              {proposal.title}
            </Heading>
          </HStack>

          <Text mt={1} fontSize="sm" noOfLines={1}>
            by {by} <ExternalLinkIcon mx="2px" />
          </Text>
        </Link>
      </Td>
    </Tr>
  );
}
const trimEthAddress = (address: string) => [address.slice(0, 5), address.slice(address.length - 4)].join("...");

// Round 10 voting finsihed
// 5h ago

// (avatar1)->(avatar2) fulano.eth delegated votes to ciclano.eth
// 4h ago

// (avatar) Fulano.eth voted for 3 proposals:
// 4h ago
//   - 1 Yadda
//   - 2 Yadda
//   - 3 Yadda

// (avatar) Fulano.eth voted for proposal #124: Do something blablabal
// 4h ago

// Round 10 voting started!
// 5h ago

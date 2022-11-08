import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Divider,
  Heading,
  HStack,
  Link,
  List,
  ListItem,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { batchProvider } from "src/blockchain";
import { useHouse, useVoter, useVoterQuery } from "src/propHouse";
import { useQuery } from "wagmi";
import { useDelegators } from "./Voter/useDelegators";

export const Delegators = () => {
  const house = useHouse();
  const voter = useVoter();
  const delegators = useDelegators();

  if (delegators.length === 0) {
    return (
      <Alert status="info" rounded={"lg"}>
        <AlertIcon />
        {voter.name} has no delegators on {house.name} house yet.
      </Alert>
    );
  }

  // Delegator avatar
  // Delegator address/name
  // Delegated voting power
  // When delegated
  return (
    <Stack
      as={List}
      spacing={4}
      _light={{ backgroundColor: "gray.100" }}
      _dark={{ backgroundColor: "whiteAlpha.100" }}
      p={6}
      rounded={"xl"}
      divider={<Divider />}
    >
      {delegators.map((delegator) => (
        <ListItem key={delegator.address}>
          <DelegatorCard delegator={delegator} />
        </ListItem>
      ))}
    </Stack>
  );
};

export const DelegatorCard = ({ delegator }) => {
  const profile = useVoterQuery(delegator.address);
  const block = useQuery(["block", delegator.blockHash], async () => await batchProvider.getBlock(delegator.blockHash));

  return (
    <HStack spacing={4}>
      {profile.isLoading ? <SkeletonCircle size="10" /> : <Avatar src={profile.avatar} />}
      <Box flex={1}>
        <Heading size={"sm"} noOfLines={1} wordBreak={"break-all"}>
          {profile.name}
        </Heading>
        {block.isSuccess && (
          <Link href={`https://etherscan.io/tx/${delegator.transactionHash}`} isExternal mt={1} fontSize="sm">
            Delegated {formatDistanceToNow(fromUnixTime(block.data!.timestamp))} ago <ExternalLinkIcon mx="2px" />
          </Link>
        )}
      </Box>
      <Box>
        <Text fontSize="2xl">⚡️ {delegator.votingPower}</Text>
        <Text fontSize={"xs"}>Voting power</Text>
      </Box>
    </HStack>
  );
};

import { Avatar, Box, Heading, HStack, SkeletonCircle, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Suspense } from "react";
import { shortAddress, useHouse, useVoter } from "src/propHouse";

export const _VoterCard = ({
  address,
  votedRounds,
  votingPower,
}: {
  address: string;
  votedRounds: number;
  votingPower: number;
}) => {
  const house = useHouse();
  const voter = useVoter(address);

  return (
    <Link href={`/${house.slug}/${voter.slug}`} shallow={true} prefetch={false}>
      <HStack spacing={4} p={4}>
        <Avatar src={voter.avatar} w={10} h={10} loading="lazy" />
        <Box flex={1}>
          <Heading size={"xs"} noOfLines={1} wordBreak={"break-all"}>
            {voter.name}
          </Heading>
          <Text mt={1} fontSize="xs">
            Voted in {votedRounds} {votedRounds === 1 ? `round` : `rounds`}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xl">⚡️ {votingPower}</Text>
          <Text fontSize={"2xs"}>Voting power</Text>
        </Box>
      </HStack>
    </Link>
  );
};

export const VoterCard = (props: { address: string; votedRounds: number; votingPower: number }) => {
  const house = useHouse();

  return (
    <Suspense
      fallback={
        <Link href={`/${house.slug}/${props.address}`}>
          <HStack spacing={4} p={4}>
            <SkeletonCircle size="10" />
            <Box flex={1}>
              <Heading size={"xs"} noOfLines={1} wordBreak={"break-all"} color="gray.400">
                {shortAddress(props.address)}
              </Heading>
              <Text mt={1} fontSize="xs">
                Voted in {props.votedRounds} {props.votedRounds === 1 ? `round` : `rounds`}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xl">⚡️ {props.votingPower}</Text>
              <Text fontSize={"2xs"}>Voting power</Text>
            </Box>
          </HStack>
        </Link>
      }
    >
      <_VoterCard {...props} />
    </Suspense>
  );
};

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Center,
  Heading,
  Hide,
  HStack,
  IconButton,
  Show,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tooltip,
  Wrap,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { Delegators } from "src/components/Delegators";
import { getVotedRounds, useHouse, useVoter, useVotingPower } from "src/propHouse";

const VotedProposals = dynamic(async () => (await import("src/components/VotedProposals")).VotedProposals, {
  ssr: false,
});

export const VoterProfile = () => {
  const house = useHouse();
  const voter = useVoter();
  const votingPower = useVotingPower(voter.address);
  const votedRounds = useMemo(() => getVotedRounds(house, voter.address), [house, voter.address]);

  return (
    <Stack spacing={6} w="full" pt={6}>
      <Wrap spacing={4} px={4} align="start" justify={"space-between"}>
        <Link href={`/${house.slug}`} shallow={true}>
          <IconButton variant="outline" aria-label="Go back" size={"lg"} fontSize={"3xl"} icon={<ArrowBackIcon />} />
        </Link>

        <HStack spacing={4} flex="1" justify={"center"}>
          {voter?.avatar && <Avatar size={"md"} src={voter?.avatar} />}

          <Heading>{voter.name}</Heading>
        </HStack>

        <Show above="md">
          <Tooltip label="Coming soon... 👀" hasArrow>
            <Button colorScheme={"purple"} disabled>
              Delegate
            </Button>
          </Tooltip>
        </Show>
      </Wrap>

      <Hide above="md">
        <HStack justify={"space-between"}>
          <StatGroup pr={4} pb={4}>
            <Stat width="99px" textAlign={"center"}>
              <StatLabel fontSize={"xs"}>Voted rounds</StatLabel>
              <StatNumber>🗳 {votedRounds}</StatNumber>
            </Stat>
            <Stat width="99px" textAlign={"center"}>
              <StatLabel fontSize={"xs"}>Voting Power</StatLabel>
              <StatNumber>⚡️ {votingPower}</StatNumber>
            </Stat>
          </StatGroup>

          <Tooltip label="Coming soon... 👀" hasArrow>
            <Button colorScheme={"purple"} disabled>
              Delegate
            </Button>
          </Tooltip>
        </HStack>
      </Hide>

      <Tabs isLazy size={"md"} variant="enclosed" colorScheme={"purple"} defaultIndex={1}>
        <TabList alignItems={"end"}>
          <Tab isDisabled>
            Feed
            <Tag ml={2} size={"sm"} variant="subtle">
              Soon™️
            </Tag>
          </Tab>
          <Tab>Voted proposals</Tab>
          <Tab>Delegators</Tab>

          <Show above="md">
            <HStack flex="1" justify={"end"}>
              <StatGroup pr={4} pb={2}>
                <Stat width="99px" textAlign={"center"}>
                  <StatLabel fontSize={"xs"}>Voted rounds</StatLabel>
                  <StatNumber>🗳 {votedRounds}</StatNumber>
                </Stat>
                <Stat width="99px" textAlign={"center"}>
                  <StatLabel fontSize={"xs"}>Voting Power</StatLabel>
                  <StatNumber>⚡️ {votingPower}</StatNumber>
                </Stat>
              </StatGroup>
            </HStack>
          </Show>
        </TabList>

        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel py={6} px={0}>
            <Suspense
              fallback={
                <Center>
                  <Spinner />
                </Center>
              }
            >
              <VotedProposals />
            </Suspense>
          </TabPanel>

          <TabPanel py={6} px={0}>
            <Suspense
              fallback={
                <Center>
                  <Spinner />
                </Center>
              }
            >
              <Delegators />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

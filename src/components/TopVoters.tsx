import {
  Box,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { sort } from "radash";
import { useMemo, useRef, useState } from "react";
import { getVotedRounds, getVoterAddresses, useHouse, useVotingPowers } from "src/propHouse";
import { VoterCard } from "./VoterCard";

export const TopVoters = () => {
  const house = useHouse();
  const [sortBy, setSortBy] = useState<"votedRounds" | "votingPower">("votedRounds");
  const votingPowers = useVotingPowers();

  const voters = useMemo(() => {
    const voters = getVoterAddresses(house).map((address) => {
      return {
        address,
        votedRounds: getVotedRounds(house, address),
        votingPower: votingPowers[address]!,
      };
    });

    return sort(voters, (voter) => voter.votingPower, true);
  }, [house, votingPowers]);

  const topVoters = useMemo(
    () => (sortBy === "votedRounds" ? sort(voters, (v) => v.votedRounds, true) : voters),
    [voters, sortBy]
  );

  const scrollWindowRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: topVoters.length ?? 0,
    getScrollElement: () => scrollWindowRef.current,
    estimateSize: () => 77,
    overscan: 20,
    debug: true,
  });

  // Todo: add search bar
  return (
    <>
      <HStack align="center" justify="space-between" spacing={4} mb="4">
        <Heading size={"sm"}>Voters</Heading>
        <RadioGroup onChange={(value) => setSortBy(value as typeof sortBy)} value={sortBy} colorScheme={"pink"}>
          <Stack direction="row">
            <Radio value={"votedRounds"}>By activity</Radio>
            <Radio value={"votingPower"}>By voting power</Radio>
          </Stack>
        </RadioGroup>
      </HStack>

      <Stack spacing={4} flex="1" maxH="full" bg={useColorModeValue("gray.100", "whiteAlpha.100")} rounded="xl">
        <Box ref={scrollWindowRef} flex="1" maxH="full" overflowY={"scroll"}>
          <List h={`${86 * topVoters.length}px`} position="relative">
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
                <VoterCard {...topVoters[item.index]!} />
                <Divider />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    </>
  );
};

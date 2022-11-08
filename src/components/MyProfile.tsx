import { Alert, AlertDescription, Box, Center, Heading, HStack, Spinner, useColorModeValue } from "@chakra-ui/react";
import { Suspense } from "react";
import { getVotedRounds, useHouse, useVotingPower } from "src/propHouse";
import { useAccount } from "wagmi";
import { VoterCard } from "./VoterCard";
import { WalletButton } from "./WalletButton";

export const MyProfile = () => {
  const account = useAccount();
  const cardBg = useColorModeValue("gray.100", "whiteAlpha.100");

  if (!account.isConnected) {
    return (
      <Box maxW={"sm"}>
        <Alert status="info" flexDirection={"column"} alignItems="stretch" bg={cardBg} rounded="xl">
          <HStack align={"start"} w="full"></HStack>

          <AlertDescription fontSize="sm" mb={2}>
            Connect wallet and see your voter profile!
          </AlertDescription>

          <WalletButton />
        </Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Todo: add share button */}
      <Heading size="sm" mb="4">
        My voter profile
      </Heading>

      <Box bg={cardBg} rounded="lg">
        <Suspense
          fallback={
            <Center>
              <Spinner />
            </Center>
          }
        >
          <Connected />
        </Suspense>
      </Box>
    </>
  );
};

const Connected = () => {
  const house = useHouse();
  const account = useAccount();

  return (
    <VoterCard
      address={account.address!}
      votedRounds={getVotedRounds(house, account.address!)}
      votingPower={useVotingPower(account.address!)}
    />
  );
};

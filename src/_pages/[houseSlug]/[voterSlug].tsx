import { Container } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { VoterProfile } from "src/components/VoterProfile";
import { useHouse, useVoter } from "src/propHouse";

const _VoterPage = () => {
  const house = useHouse();
  const voter = useVoter();

  if (!voter) {
    return null;
  }

  return (
    <Container maxW={"container.lg"}>
      <Head>
        <title>{`${voter.name} - ${house.name}`} | voters.wtf</title>
      </Head>

      <VoterProfile />
    </Container>
  );
};

const VoterPage = () => {
  const router = useRouter();

  if (!router.query["voterSlug"]) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <_VoterPage />
    </Suspense>
  );
};

export default VoterPage;

import { Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Voters } from "src/components/Voters";
import { getHouses } from "src/propHouse";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Main } from "../components/Main";

const HousePage = ({ houses }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const houseSlug = useRouter().query["houseSlug"]!;
  const selectedHouse = houses.find((h) => h.slug === houseSlug)!;

  return (
    <Container height="100vh">
      <DarkModeSwitch />

      <Main>
        <Heading>Selected house: {selectedHouse?.name}</Heading>

        <Heading>Houses:</Heading>
        <UnorderedList spacing={3} color="text">
          {houses.map((house) => (
            <ListItem key={house.id}>
              <Link href={`/${house.slug}`} shallow={true}>
                {house.name}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>

        <Voters house={selectedHouse} />
      </Main>
    </Container>
  );
};

// Todo: switch to getStaticProps
// Todo: getStaticPaths should allow only existing/supported houses
export const getServerSideProps = async () => ({ props: { houses: await getHouses() } });

export default HousePage;

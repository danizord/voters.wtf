import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { HouseFeed } from "src/components/HouseFeed";
import { getHouseData, getHouses, getVotingPowers, useHouse } from "src/propHouse";

const HousePage = () => {
  const house = useHouse();

  return (
    <>
      <Head>
        <title>{house.name} | voters.wtf</title>
      </Head>

      <HouseFeed />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const houses = (await getHouses())
    // Only Nouns and Lil Nouns for now
    .filter((house) => [1, 2].includes(house.id));

  return {
    paths: houses.map((house) => ({ params: { houseSlug: house.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  const houses = await queryClient.fetchQuery(
    ["houses"], //
    async () => await getHouses(),
    { staleTime: Infinity, cacheTime: Infinity }
  );

  const houseId = houses.find((house) => house.slug === context.params!["houseSlug"])?.id;

  if (!houseId) {
    return { notFound: true };
  }

  const house = await queryClient.fetchQuery(
    ["house", houseId], //
    async () => await getHouseData(houseId),
    { staleTime: Infinity, cacheTime: Infinity }
  );

  await queryClient.prefetchQuery(
    ["votingPowers", houseId], //
    async () => await getVotingPowers(house),
    { staleTime: Infinity }
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

export default HousePage;

import { Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getVoters } from "src/propHouse";

export const Voters = ({ house }: { house: { id: number } }) => {
  const voters = useQuery(["voters", house.id], () => getVoters(house.id), { suspense: true }).data!;

  return (
    <>
      <Heading>Voters:</Heading>
      {voters.map((voter) => (
        <div key={voter.address}>{voter.address}</div>
      ))}
    </>
  );
};

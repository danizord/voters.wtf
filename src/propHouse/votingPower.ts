import { useQuery } from "@tanstack/react-query";
import { batchProvider, NounishVotingPowerTokenAbi } from "src/blockchain";
import type { Address } from "wagmi";
import { getContract } from "wagmi/actions";
import { HouseData, useHouse } from "./house";
import { getVoterAddresses } from "./voters";

export async function getVotingPowers(house: HouseData) {
  const addresses = getVoterAddresses(house);

  const multiplier = house.id === 1 ? 10 : 1;

  const contract = getContract({
    address: house.contractAddress,
    abi: NounishVotingPowerTokenAbi,
    signerOrProvider: batchProvider,
  });

  return Object.fromEntries(
    await Promise.all(
      addresses.map(async (address) => {
        const currentVotes = await contract!.getCurrentVotes(address as Address);
        return [address, currentVotes.toNumber() * multiplier] as const;
      })
    )
  );
}

export const useVotingPowers = () => {
  const house = useHouse();

  return useQuery(
    ["votingPowers", house.id], //
    async () => await getVotingPowers(house),
    { staleTime: Infinity, suspense: true }
  ).data!;
};

export const useVotingPower = (voterAddress: string) => {
  return useVotingPowers()[voterAddress] ?? 0;
};

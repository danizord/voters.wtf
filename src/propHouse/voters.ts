import { useQuery } from "@tanstack/react-query";
import assert from "assert";
import { isAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { queryClient } from "src/queryClient";
import { HouseData } from "./house";

export function getVoterAddresses(house: HouseData) {
  return Array.from(
    new Set(
      house.auctions.flatMap((round) => {
        return round.proposals.flatMap((p) => p.votes).map((vote) => vote.address);
      })
    )
  );
}

export const useVoter = (_addressOrEnsName?: string) => {
  const voterSlug = useRouter().query["voterSlug"] as string;
  const addressOrName = _addressOrEnsName ?? voterSlug;

  assert(addressOrName, "No voter address or ENS name provided");

  const voter = useQuery(
    ["voter", addressOrName],
    async () => {
      const response = await fetch(`/api/voters/${addressOrName}`);
      const data = await response.json();

      // Todo: throw on 404

      return data as { address: string; ensName: string | null; avatar: string | null };
    },
    {
      suspense: true,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData(["voter", data.ensName], data);
      },
    }
  ).data!;

  const address = voter.address;
  const name = voter.ensName ?? shortAddress(address);
  const slug = voter.ensName ?? address;
  const avatar = voter.avatar;

  return { address, name, slug, avatar };
};

export const useVoterQuery = (_addressOrEnsName?: string) => {
  const voterSlug = useRouter().query["voterSlug"] as string;
  const addressOrName = _addressOrEnsName ?? voterSlug;

  assert(addressOrName, "No voter address or ENS name provided");

  const query = useQuery(
    ["voter", addressOrName],
    async () => {
      const response = await fetch(`/api/voters/${addressOrName}`);
      const data = await response.json();

      // Todo: throw on 404

      return data as { address: string; ensName: string | null; avatar: string | null };
    },
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData(["voter", data.ensName], data);
      },
    }
  );

  const address = query.data?.address ?? (isAddress(addressOrName) ? addressOrName : null);
  const name = query.data?.ensName ?? (isAddress(addressOrName) ? shortAddress(addressOrName) : addressOrName);
  const slug = query.data?.ensName ?? addressOrName;
  const avatar = query.data?.avatar ?? null;

  return { address, name, slug, avatar, isLoading: query.isLoading };
};

export function getVotedRounds(house: HouseData, address: string) {
  return house.auctions.filter((a) => {
    return a.proposals.some((p) => p.votes.some((v) => v.address === address));
  }).length;
}

export const shortAddress = (address: string) => [address.slice(0, 5), address.slice(address.length - 4)].join("...");

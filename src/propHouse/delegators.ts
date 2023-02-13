import { group, sort } from "radash";
import { batchProvider, NounishVotingPowerTokenAbi } from "src/blockchain";
import { Address, useContractReads, useQuery } from "wagmi";
import { getContract } from "wagmi/actions";
import { useHouse } from "./house";
import { useVoter } from "./voters";

export const getDelegators = async ({ house, account }: { house: { contractAddress: string }; account: Address }) => {
  const contract = getContract({
    address: house.contractAddress,
    abi: NounishVotingPowerTokenAbi,
    signerOrProvider: batchProvider,
  });

  // Fetch in parallel all DelegateChanged events "to" and "from" account
  const responses = await Promise.all([
    contract.queryFilter(contract.filters.DelegateChanged(null, null, account)),
    contract.queryFilter(contract.filters.DelegateChanged(null, account, null)),
  ]);

  // Recents first
  const aggregatedEvents = sort(responses.flat(), (e) => e.blockNumber, true);

  // Group by delegator
  const delegators = Object.values(group(aggregatedEvents, (e) => e.args!["delegator"]))
    // Pick most recent event
    .map((events) => events[0]!)
    // Ignore if it is a delegation withdrawal
    .filter((event) => event.args!["toDelegate"] === account)
    // Map to delegator record
    .map((event) => ({
      address: event.args!["delegator"] as Address,
      transactionHash: event.transactionHash,
      blockHash: event.blockHash,
    }));

  return delegators;
};

export const useDelegators = () => {
  const house = useHouse();
  const voter = useVoter()!;

  const delegators = useQuery(["delegators", house.id, voter.address], {
    suspense: true,
    queryFn: async () => {
      return await getDelegators({ house, account: voter.address });
    },
    select: (delegators) => Array.from(delegators),
  }).data!;

  const multiplier = house.id === 1 ? 10 : 1;

  const results = useContractReads({
    suspense: true,
    keepPreviousData: false,
    contracts: delegators.map((delegator) => ({
      address: house.contractAddress,
      abi: NounishVotingPowerTokenAbi,
      functionName: "votesToDelegate",
      args: [delegator.address],
    })),
  }).data!;

  // @ts-ignore
  const votingPowers = results.map((data) => (data?.toNumber() ?? 0) * multiplier);

  return sort(
    delegators.map((delegator, i) => ({ ...delegator, votingPower: votingPowers[i]! })),
    (d) => d.votingPower,
    true
  );
};

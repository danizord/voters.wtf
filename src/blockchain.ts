import { getDefaultClient } from "connectkit";
import { providers } from "ethers";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { infuraProvider as _infuraProvider } from "wagmi/providers/infura";

export const batchProvider = new providers.JsonRpcBatchProvider(
  "https://mainnet.infura.io/v3/45d2ea2d3dee419abb1ac770b5130844",
  {
    chainId: chain.mainnet.id,
    name: chain.mainnet.name,
    ensAddress: chain.mainnet.ens!.address!,
  }
);

const infuraProvider = _infuraProvider({ apiKey: "45d2ea2d3dee419abb1ac770b5130844" });

const customProvider = (chain: Chain) => {
  return {
    ...infuraProvider(chain)!,
    provider: () => batchProvider,
  };
};

export const { provider, webSocketProvider } = configureChains([chain.mainnet], [customProvider]);

export const client = createClient({
  ...getDefaultClient({
    appName: "voters.wtf",
    infuraId: "45d2ea2d3dee419abb1ac770b5130844",
  }),
  provider,
  webSocketProvider,
});

export const NounishVotingPowerTokenAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "delegator", type: "address" },
      { indexed: true, internalType: "address", name: "fromDelegate", type: "address" },
      { indexed: true, internalType: "address", name: "toDelegate", type: "address" },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getCurrentVotes",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "delegator", type: "address" }],
    name: "votesToDelegate",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

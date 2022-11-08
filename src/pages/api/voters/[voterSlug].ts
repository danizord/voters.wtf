import assert from "assert";
import { providers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { fetch } from "undici";
import { erc721ABI } from "wagmi";
import { getContract } from "wagmi/actions";

// export const config = {
//   runtime: "experimental-edge",
// };

const provider = new providers.StaticJsonRpcProvider(
  "https://mainnet.infura.io/v3/45d2ea2d3dee419abb1ac770b5130844",
  "mainnet"
);

const houses = {
  1: {
    graph: "https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph",
    contract: getContract({
      address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
      abi: erc721ABI,
      signerOrProvider: provider,
    }),
  },
  2: {
    graph: "https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph",
    contract: getContract({
      address: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
      abi: erc721ABI,
      signerOrProvider: provider,
    }),
  },
} as const;

type HouseId = keyof typeof houses;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query["voterSlug"] as string;
  const address = isAddress(slug) ? slug : await provider.resolveName(slug);
  assert(isAddress(address!));

  const ensName = !isAddress(slug) ? slug : await provider.lookupAddress(address);
  const ensAvatar = ensName && (await provider.getAvatar(ensName));

  const avatar =
    ensAvatar ?? // ENS avatar
    (await getTokenAvatar(address, 1)) ?? // Nouns avatar
    (await getTokenAvatar(address, 2)); // Lil Nouns avatar

  return res
    .setHeader("cache-control", "public, s-maxage=60, stale-while-revalidate=604800")
    .json({ address, ensName, avatar });
}

async function getTokenAvatar(address: string, houseId: HouseId) {
  const tokenid = await getFirstTokenId(address, houseId);

  if (null !== tokenid) {
    return await getTokenImageUri(tokenid, houseId);
  }

  return null;
}

async function getFirstTokenId(address: string, houseId: HouseId) {
  const response = await fetch(houses[houseId].graph, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      query: `query GetFirstNounId($address: String) {
          account(id: $address) { nouns(first: 1) { id } }
          delegate(id: $address) { nounsRepresented(first: 1) { id } }
        }`,
      variables: { address: address.toLowerCase() },
      operationName: "GetFirstTokenId",
    }),
  });

  assert(response.status === 200, `Bad response from graph: ${response.status}`);

  const result = await response.json();
  const tokenId = result.data.account?.nouns[0]?.id ?? result.data.delegate?.nounsRepresented[0]?.id ?? null;

  return null !== tokenId ? Number(tokenId) : null;
}

const getTokenImageUri = async (tokenId: number, houseId: HouseId) => {
  const metadataUri = await houses[houseId].contract.tokenURI(tokenId);
  const metatada = await (await fetch(metadataUri)).json();

  return metatada.image;
};

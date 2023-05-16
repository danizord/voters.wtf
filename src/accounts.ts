import { getAddress } from "viem";
import { publicClient } from "./blockchain";

export async function getName(_address: string): Promise<string> {
  const address = getAddress(_address);
  const ensName = await publicClient.getEnsName({
    address: address,
  });

  if (!ensName) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return ensName;
}

export async function getAvatar(_address: string): Promise<string | null> {
  const address = getAddress(_address);
  const name = await publicClient.getEnsName({ address });

  if (!name) {
    return null;
  }

  const ensAvatar = await publicClient.getEnsAvatar({ name });

  return ensAvatar;
}

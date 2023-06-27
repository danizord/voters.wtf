// import { getAddress } from "viem";
// import { publicClient } from "./blockchain";

export class Address {
  constructor(public address: string) { }

  toString() {
    return this.address;
  }

  equals(other: Address) {
    return this.address.toLowerCase() === other.address.toLowerCase();
  }

  short() {
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }
}

export async function getName(_address: Address): Promise<string> {
  const response = await fetch(`https://www.voters.wtf/api/voters/${_address.toString().toLowerCase()}`);

  if (!response.ok) {
    return _address.short();
  }

  const data = await response.json();

  return data.ensName ?? _address.short();
    // return _address.short();
  // const address = getAddress(_address.toString());
  // const ensName = await publicClient.getEnsName({
  //   address: address,
  // });

  // if (!ensName) {
  //   return `${address.slice(0, 6)}...${address.slice(-4)}`;
  // }

  // return ensName;
};



export async function getAvatar(_address: Address): Promise<string | null> {
  return null;
  // const address = getAddress(_address);
  // const name = await publicClient.getEnsName({ address });

  // if (!name) {
  //   return null;
  // }

  // const ensAvatar = await publicClient.getEnsAvatar({ name });

  // return ensAvatar;
}

export async function AccountName({ address }: { address: Address }) {
  return await getName(address);
}

export async function Avatar({ address }: { address: Address }) {
  const name = await getName(address);
  const avatar = await getAvatar(address);

  return avatar ? (
    // ? <Image unoptimized src={avatar} alt={name} height={64} width={64} />
    <img src={avatar} alt={name} height="64px" width="64px" />
  ) : (
    <div className=" h-full w-full bg-green-500" />
  );
}

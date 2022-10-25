/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query GetCommunities {\n    communities {\n      id\n      name\n    }\n  }\n": types.GetCommunitiesDocument,
    "\n  query GetVoterAddresses($houseId: Int!) {\n    community(id: $houseId) {\n      auctions {\n        proposals {\n          votes {\n            address\n          }\n        }\n      }\n    }\n  }\n": types.GetVoterAddressesDocument,
};

export function graphql(source: "\n  query GetCommunities {\n    communities {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCommunities {\n    communities {\n      id\n      name\n    }\n  }\n"];
export function graphql(source: "\n  query GetVoterAddresses($houseId: Int!) {\n    community(id: $houseId) {\n      auctions {\n        proposals {\n          votes {\n            address\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVoterAddresses($houseId: Int!) {\n    community(id: $houseId) {\n      auctions {\n        proposals {\n          votes {\n            address\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
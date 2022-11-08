/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query GetCommunities {\n    communities {\n      id\n      name\n      profileImageUrl\n      contractAddress\n    }\n  }\n": types.GetCommunitiesDocument,
    "\n  query GetHouseData($houseId: Int!) {\n    community(id: $houseId) {\n      id\n      name\n      contractAddress\n      auctions {\n        id\n        title\n        proposalEndTime\n        votingEndTime\n        numWinners\n        proposals {\n          id\n          address\n          title\n          tldr\n          voteCount\n          votes {\n            id\n            createdDate\n            address\n            weight\n          }\n        }\n      }\n    }\n  }\n": types.GetHouseDataDocument,
};

export function graphql(source: "\n  query GetCommunities {\n    communities {\n      id\n      name\n      profileImageUrl\n      contractAddress\n    }\n  }\n"): (typeof documents)["\n  query GetCommunities {\n    communities {\n      id\n      name\n      profileImageUrl\n      contractAddress\n    }\n  }\n"];
export function graphql(source: "\n  query GetHouseData($houseId: Int!) {\n    community(id: $houseId) {\n      id\n      name\n      contractAddress\n      auctions {\n        id\n        title\n        proposalEndTime\n        votingEndTime\n        numWinners\n        proposals {\n          id\n          address\n          title\n          tldr\n          voteCount\n          votes {\n            id\n            createdDate\n            address\n            weight\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetHouseData($houseId: Int!) {\n    community(id: $houseId) {\n      id\n      name\n      contractAddress\n      auctions {\n        id\n        title\n        proposalEndTime\n        votingEndTime\n        numWinners\n        proposals {\n          id\n          address\n          title\n          tldr\n          voteCount\n          votes {\n            id\n            createdDate\n            address\n            weight\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
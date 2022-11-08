/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Auction = {
  __typename?: 'Auction';
  balanceBlockTag: Scalars['String'];
  community: Community;
  createdDate: Scalars['DateTime'];
  /** The currency for the auction that winners will be paid in */
  currencyType: Scalars['String'];
  description: Scalars['String'];
  /** The number of currency units paid to each winner */
  fundingAmount: Scalars['Float'];
  /** All auctions are issued a unique ID number */
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  /** The number of winners that will be paid from the auction */
  numWinners: Scalars['Int'];
  /** Users may submit proposals up until Proposal End Time */
  proposalEndTime: Scalars['DateTime'];
  proposals: Array<Proposal>;
  /** After the Start Time users may submit proposals */
  startTime: Scalars['DateTime'];
  /** The current status of the Auction. See AuctionStatus for more detail. */
  status: AuctionStatus;
  title: Scalars['String'];
  /** Between Proposal End Time and Voting End Time, users may submit votes for proposals */
  votingEndTime: Scalars['DateTime'];
};

/** The Auction's current status */
export enum AuctionStatus {
  /** The auction has closed and is not accepting votes or proposals. */
  Closed = 'Closed',
  /** The auction is accepting proposals. */
  Open = 'Open',
  Upcoming = 'Upcoming',
  /** The auction is accepting votes, proposals are closed. */
  Voting = 'Voting'
}

export type Community = {
  __typename?: 'Community';
  auctions: Array<Auction>;
  /** The contract address that is queried for balances */
  contractAddress: Scalars['String'];
  createdDate: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  name: Scalars['String'];
  numAuctions: Scalars['Int'];
  profileImageUrl: Scalars['String'];
};

export type PartialAuctionInput = {
  balanceBlockTag?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['DateTime']>;
  /** The currency for the auction that winners will be paid in */
  currencyType?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  /** The number of currency units paid to each winner */
  fundingAmount?: InputMaybe<Scalars['Float']>;
  /** All auctions are issued a unique ID number */
  id?: InputMaybe<Scalars['Int']>;
  lastUpdatedDate?: InputMaybe<Scalars['DateTime']>;
  /** The number of winners that will be paid from the auction */
  numWinners?: InputMaybe<Scalars['Int']>;
  /** Users may submit proposals up until Proposal End Time */
  proposalEndTime?: InputMaybe<Scalars['DateTime']>;
  /** After the Start Time users may submit proposals */
  startTime?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
  /** Between Proposal End Time and Voting End Time, users may submit votes for proposals */
  votingEndTime?: InputMaybe<Scalars['DateTime']>;
};

export type Proposal = {
  __typename?: 'Proposal';
  address: Scalars['String'];
  auction: Auction;
  auctionId: Scalars['Int'];
  createdDate: Scalars['DateTime'];
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  signatureState: Scalars['String'];
  signedData: SignedDataPayload;
  title: Scalars['String'];
  tldr: Scalars['String'];
  voteCount: Scalars['Float'];
  votes: Array<Vote>;
  what: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Fetch an Auction based on its ID */
  auction: Auction;
  /** Fetch all auctions that match the provided properties */
  auctions: Array<Auction>;
  /** Fetch all auctions by Status */
  auctionsByStatus: Array<Auction>;
  communities: Array<Community>;
  community: Community;
  findByAddress: Community;
  proposal: Proposal;
};


export type QueryAuctionArgs = {
  id: Scalars['Int'];
};


export type QueryAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  where: PartialAuctionInput;
};


export type QueryAuctionsByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  status: AuctionStatus;
};


export type QueryCommunityArgs = {
  id: Scalars['Int'];
};


export type QueryFindByAddressArgs = {
  address: Scalars['String'];
};


export type QueryProposalArgs = {
  id: Scalars['Int'];
};

export type SignedDataPayload = {
  __typename?: 'SignedDataPayload';
  message: Scalars['String'];
  signature: Scalars['String'];
  signer: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  address: Scalars['String'];
  auctionId: Scalars['Int'];
  createdDate: Scalars['DateTime'];
  direction: Scalars['Int'];
  id: Scalars['Int'];
  proposalId: Scalars['Int'];
  signatureState: Scalars['String'];
  signedData: SignedDataPayload;
  weight: Scalars['Int'];
};

export type GetCommunitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCommunitiesQuery = { __typename?: 'Query', communities: Array<{ __typename?: 'Community', id: number, name: string, profileImageUrl: string, contractAddress: string }> };

export type GetHouseDataQueryVariables = Exact<{
  houseId: Scalars['Int'];
}>;


export type GetHouseDataQuery = { __typename?: 'Query', community: { __typename?: 'Community', id: number, name: string, contractAddress: string, auctions: Array<{ __typename?: 'Auction', id: number, title: string, proposalEndTime: any, votingEndTime: any, numWinners: number, proposals: Array<{ __typename?: 'Proposal', id: number, address: string, title: string, tldr: string, voteCount: number, votes: Array<{ __typename?: 'Vote', id: number, createdDate: any, address: string, weight: number }> }> }> } };


export const GetCommunitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCommunities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}}]}}]}}]} as unknown as DocumentNode<GetCommunitiesQuery, GetCommunitiesQueryVariables>;
export const GetHouseDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHouseData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"houseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"houseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"contractAddress"}},{"kind":"Field","name":{"kind":"Name","value":"auctions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"proposalEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"votingEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"numWinners"}},{"kind":"Field","name":{"kind":"Name","value":"proposals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tldr"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetHouseDataQuery, GetHouseDataQueryVariables>;
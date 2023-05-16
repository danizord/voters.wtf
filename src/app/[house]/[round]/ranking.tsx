'use client'

import { motion, useSpring, useTransform } from 'framer-motion';
import type { ReactElement } from 'react';
import { useSelectedVote } from './timeline';

interface RankingProps {
  proposals: {
    [proposalId: string]: ReactElement;
  };
  votes: {
    id: number;
    proposalId: number;
    weight: number;
  }[];
}

export const Ranking = ({ proposals, votes }: RankingProps) => {
  const proposalIds = Object.keys(proposals).map(Number);

  const selectedVote = useSelectedVote();
  const currentVotes = selectedVote ? votes.filter((vote) => vote.id <= selectedVote) : votes;
  const rankedProposalIds = computeRanking(proposalIds, currentVotes);

  return (
    <ul className="space-y-4">
      {rankedProposalIds.map((proposalId, i) => (
        <motion.li layout key={proposalId} className="flex items-center justify-between" transition={{ when: "beforeChildren", staggerChildren: 2 }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              {/* <img className="w-10 h-10 rounded-full" src={proposal.author.avatarUrl} alt="" /> */}
              <div className="w-10 h-10   text-xl text-center" >
                <Position i={i + 1}></Position>
              </div>
            </div>

            <div>
              {proposals[proposalId]}
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}

const Position = ({ i }: { i: number }) => {
  const springConfig = { damping: 20, stiffness: 300 };
  const spring = useSpring(i, springConfig);
  const progress = useTransform(spring, [0, 100], [0, 100], { clamp: true });

  return <motion.div>{progress}</motion.div>
}

const computeRanking = (proposalIds: number[], votes: { proposalId: number, weight: number }[]): number[] => {
  const voteCounts = Object.fromEntries(proposalIds.map((proposalId) => [proposalId, 0]));

  for (const { proposalId, weight } of votes) {
    voteCounts[proposalId] += weight;
  }

  return proposalIds.sort((a, b) => voteCounts[b]! - voteCounts[a]!);
}
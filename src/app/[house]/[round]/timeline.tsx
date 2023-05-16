// This module implements a vote timeline
// It is a way to navigate the round voting history
"use client";

import { Slot } from '@radix-ui/react-slot';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactElement } from "react";

const selectedVote = atom<number | null>(null);

export const useSelectedVote = (): number | null => {
  return useAtomValue(selectedVote);
};

// Returns the list of votes at the current point in time
export const useVotesSnapshot = () => { }

export const TimelineItem = ({
  voteId,
  children,
}: {
  voteId: number;
  children: ReactElement;
}) => {
  const setSelectedVote = useSetAtom(selectedVote);

  return <Slot onClick={() => setSelectedVote(voteId)}>{children}</Slot>;
};

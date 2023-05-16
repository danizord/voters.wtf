// This module implements a vote timeline
// It is a way to navigate the round voting history
"use client";

import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { ReactElement } from "react";

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

  return <button onClick={() => setSelectedVote(voteId)}>{children}</button>;
};

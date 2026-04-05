'use client';

import { useState } from 'react';
import type { DrawerPost } from '../types';

interface DrawerState {
  posts: DrawerPost[];
  index: number;
}

export function useDrawer() {
  const [drawer, setDrawer] = useState<DrawerState | null>(null);

  function open(index: number, posts: DrawerPost[]) {
    setDrawer({ index, posts });
  }

  function close() {
    setDrawer(null);
  }

  return { drawer, open, close };
}

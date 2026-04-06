'use client';

import { AnimatePresence } from 'framer-motion';
import type { DrawerPost } from '@/features/intelligence/types';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { Candidate, Competitor } from '../types';
import {
  AddCandidateModal,
  BulkImportModal,
  TrackProfileModal,
  TrackNicheModal,
} from './modals/AddActionModals';

export type ModalId = 'add-handle' | 'bulk-import' | 'track-profile' | 'track-niche' | null;
export interface DrawerState { index: number; posts: DrawerPost[] }

interface ReconModalsProps {
  modal: ModalId;
  drawer: DrawerState | null;
  onCloseModal: () => void;
  onCloseDrawer: () => void;
  onAddCandidate: (c: Candidate) => void;
  onBulkImport: (cs: Candidate[]) => void;
  onAddCreator: (c: Competitor) => void;
}

export function ReconModals({ modal, drawer, onCloseModal, onCloseDrawer, onAddCandidate, onBulkImport, onAddCreator }: ReconModalsProps) {
  return (
    <AnimatePresence>
      {modal === 'add-handle' && (
        <AddCandidateModal onClose={onCloseModal} onAdd={onAddCandidate} />
      )}
      {modal === 'bulk-import' && (
        <BulkImportModal onClose={onCloseModal} onAdd={onBulkImport} />
      )}
      {modal === 'track-profile' && (
        <TrackProfileModal onClose={onCloseModal} onAdd={onAddCreator} />
      )}
      {modal === 'track-niche' && (
        <TrackNicheModal onClose={onCloseModal} />
      )}
      {drawer && (
        <PostDetailDrawer posts={drawer.posts} initialIndex={drawer.index} onClose={onCloseDrawer} />
      )}
    </AnimatePresence>
  );
}

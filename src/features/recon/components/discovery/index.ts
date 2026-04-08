// -- Row components ----------------------------------------------------------
export { CandidateRow }    from './rows/CandidateRow';
export { ApprovedRow }     from './rows/ApprovedRow';
export { ScrapedRow }      from './rows/ScrapedRow';
export { RejectedPanel }   from './rows/RejectedPanel';

// -- Columns -----------------------------------------------------------------
export { ScrapingColumn }   from './ScrapingColumn';
export { PipelineColumn }   from './PipelineColumn';

// -- Header / stats / widgets ------------------------------------------------
export { ApprovalRatioWidget } from './ApprovalRatioWidget';
export { DiscoveryFunnel }     from './DiscoveryFunnel';
export { DiscoveryHeader }     from './DiscoveryHeader';
export { PipelineStats }       from './PipelineStats';
export { InfoTooltip }         from './InfoTooltip';

// -- Charts ------------------------------------------------------------------
export { NicheDonut }          from './charts/NicheDonut';
export { SourceChart }         from './charts/SourceChart';
export { FollowerScaleChart }  from './charts/FollowerScaleChart';

// -- Detail panel ------------------------------------------------------------
export { DetailPanel }         from './detail/DetailPanel';

// -- Shared re-exports (for backwards compat with old discovery callers) -----
export { EmptyState }          from '../shared/EmptyState';
export { SkeletonRow }         from '../shared/SkeletonRow';
export { RatioBadge }          from '../shared/RatioBadge';
export { MiniStat }            from '../shared/MiniStat';

// -- DnD primitives ----------------------------------------------------------
export { DraggableCard, DroppableZone, DragGhost } from './dnd';
export type { ColumnId } from './dnd';

// -- Data helpers ------------------------------------------------------------
export { AVATAR_COLORS, SAMPLE_GRADIENTS, stableNum, fmtFollowers, getInitials, convexToCandidate } from './data';
export type { ConvexCandidate, MappedCandidate } from './data';

// -- Seed data ---------------------------------------------------------------
export { PRE_APPROVED } from '../../constants';

// -- Extracted hooks ---------------------------------------------------------
export { useDiscoveryActions } from './hooks/useDiscoveryActions';
export type { DiscoveryActionsDeps } from './hooks/useDiscoveryActions';
export { useDndHandlers } from './hooks/useDndHandlers';
export type { DndHandlersDeps } from './hooks/useDndHandlers';
export { computeDiscoveryStats } from './DiscoveryStats';
export type { DiscoveryStatsData } from './DiscoveryStats';

// -- Utilities ---------------------------------------------------------------
export { fmtViews, getRatioColor } from './discoveryUtils';

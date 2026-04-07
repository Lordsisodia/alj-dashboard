// -- Sub-components ---------------------------------------------------------------
export { CandidateRow }     from './CandidateRow';
export { ApprovedRow }      from './ApprovedRow';
export { ScrapedRow }       from './ScrapedRow';
export { ScrapingColumn }   from './ScrapingColumn';
export { PipelineColumn }  from './PipelineColumn';
export { RejectedPanel }   from './RejectedPanel';
export { ApprovalRatioWidget } from './ApprovalRatioWidget';
export { NicheDonut }      from './NicheDonut';
export { DiscoveryFunnel } from './DiscoveryFunnel';
export { DiscoveryHeader } from './DiscoveryHeader';
export { DetailPanel }     from './DetailPanel';
export { InfoTooltip }     from './InfoTooltip';
export { EmptyState }      from './EmptyState';
export { SkeletonRow }     from './SkeletonRow';
export { RatioBadge }      from './RatioBadge';
export { MiniStat }        from './MiniStat';
export { PipelineStats }   from './PipelineStats';
export { SourceChart }     from './SourceChart';
export { FollowerScaleChart } from './FollowerScaleChart';

// -- DnD primitives ---------------------------------------------------------------
export { DraggableCard, DroppableZone, DragGhost } from './dnd';
export type { ColumnId } from './dnd';

// -- Data helpers ----------------------------------------------------------------
export { AVATAR_COLORS, SAMPLE_GRADIENTS, stableNum, fmtFollowers, getInitials, convexToCandidate } from './data';
export type { ConvexCandidate, MappedCandidate } from './data';

// -- Seed data ------------------------------------------------------------------
export { PRE_APPROVED } from '../../../constants';

// -- Utilities -----------------------------------------------------------------
export { fmtViews, getRatioColor } from './discoveryUtils';

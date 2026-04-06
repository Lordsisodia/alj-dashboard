'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, fadeUp } from '../../constants';
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const CARD_W = 220, CARD_H = 100, GAP_X = 48, GAP_Y = 80, PAD = 80;

interface OrgNode {
  id: string; name: string; role: string; title: string;
  status: 'running' | 'idle' | 'active'; children: OrgNode[];
}
interface LayoutNode extends OrgNode { x: number; y: number; layoutChildren: LayoutNode[]; }

const ORG_TREE: OrgNode[] = [{
  id: 'clients-pm', name: 'Clients PM', role: 'Orchestrator', title: 'agency.clients-pm',
  status: 'active',
  children: [
    { id: 'client-builder', name: 'Client Builder', role: 'Builder', title: 'agency.client-builder', status: 'running', children: [] },
    { id: 'client-evaluator', name: 'Client Evaluator', role: 'Evaluator', title: 'agency.client-evaluator', status: 'idle', children: [] },
  ],
}];

const STATUS_CFG: Record<string, { dot: string; label: string; pill: string; text: string }> = {
  running: { dot: '#4a9eff', label: 'Running', pill: 'rgba(74,158,255,0.12)', text: '#1d6eb5' },
  active:  { dot: '#78c257', label: 'Active',  pill: 'rgba(120,194,87,0.12)', text: '#4a8a2d' },
  idle:    { dot: '#fbbf24', label: 'Idle',     pill: 'rgba(251,191,36,0.12)', text: '#b45309' },
};

function subtreeWidth(node: OrgNode): number {
  if (node.children.length === 0) return CARD_W;
  const cW = node.children.reduce((s, c) => s + subtreeWidth(c), 0);
  return Math.max(CARD_W, cW + (node.children.length - 1) * GAP_X);
}

function layoutTree(node: OrgNode, x: number, y: number): LayoutNode {
  const totalW = subtreeWidth(node);
  const layoutChildren: LayoutNode[] = [];
  if (node.children.length > 0) {
    const cW = node.children.reduce((s, c) => s + subtreeWidth(c), 0);
    let cx = x + (totalW - cW - (node.children.length - 1) * GAP_X) / 2;
    for (const child of node.children) {
      const w = subtreeWidth(child);
      layoutChildren.push(layoutTree(child, cx, y + CARD_H + GAP_Y));
      cx += w + GAP_X;
    }
  }
  return { ...node, x: x + (totalW - CARD_W) / 2, y, layoutChildren };
}

function flatten(nodes: LayoutNode[]): LayoutNode[] {
  const r: LayoutNode[] = [];
  const walk = (n: LayoutNode) => { r.push(n); n.layoutChildren.forEach(walk); };
  nodes.forEach(walk);
  return r;
}

function collectEdges(nodes: LayoutNode[]) {
  const edges: { p: LayoutNode; c: LayoutNode }[] = [];
  const walk = (n: LayoutNode) => { for (const c of n.layoutChildren) { edges.push({ p: n, c }); walk(c); } };
  nodes.forEach(walk);
  return edges;
}

function AgentCard({ node }: { node: LayoutNode }) {
  const cfg = STATUS_CFG[node.status] ?? STATUS_CFG.idle;
  const initials = node.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div data-card className="absolute rounded-2xl transition-shadow hover:shadow-md"
      style={{ left: node.x, top: node.y, width: CARD_W, minHeight: CARD_H, backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
      {/* left accent */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg,#ff0069,#833ab4)' }} />
      <div className="px-4 py-3 pl-5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#ff0069,#833ab4)' }}>
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: cfg.dot }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-neutral-900 leading-tight">{node.name}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">{node.role}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[9px] font-mono text-neutral-400 truncate">{node.title}</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: cfg.pill, color: cfg.text }}>
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function OrgChartView() {
  const layout = useMemo(() => {
    let x = PAD;
    return ORG_TREE.map(r => { const node = layoutTree(r, x, PAD); x += subtreeWidth(r) + GAP_X; return node; });
  }, []);

  const allNodes = useMemo(() => flatten(layout), [layout]);
  const edges = useMemo(() => collectEdges(layout), [layout]);
  const bounds = useMemo(() => {
    let maxX = 0, maxY = 0;
    for (const n of allNodes) { maxX = Math.max(maxX, n.x + CARD_W); maxY = Math.max(maxY, n.y + CARD_H); }
    return { width: maxX + PAD, height: maxY + PAD };
  }, [allNodes]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const initialized = useRef(false);

  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: cW, clientHeight: cH } = containerRef.current;
    const fitZoom = Math.min((cW - 80) / bounds.width, (cH - 80) / bounds.height, 1.2);
    setZoom(fitZoom);
    setPan({ x: (cW - bounds.width * fitZoom) / 2, y: (cH - bounds.height * fitZoom) / 2 });
  }, [bounds]);

  useEffect(() => {
    if (initialized.current || !containerRef.current || allNodes.length === 0) return;
    initialized.current = true;
    fitView();
  }, [allNodes, fitView]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-card]')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragStart.current.panX + e.clientX - dragStart.current.x, y: dragStart.current.panY + e.clientY - dragStart.current.y });
  }, [dragging]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const newZoom = Math.min(Math.max(zoom * (e.deltaY < 0 ? 1.1 : 0.9), 0.3), 2.5);
    const s = newZoom / zoom;
    setPan({ x: mx - s * (mx - pan.x), y: my - s * (my - pan.y) });
    setZoom(newZoom);
  }, [zoom, pan]);

  const zoomBtn = (delta: number) => {
    setZoom(z => Math.min(Math.max(z * delta, 0.3), 2.5));
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(255,0,105,0.1),rgba(131,58,180,0.1))', border: '1px solid rgba(131,58,180,0.15)' }}>
            <Network size={14} style={{ color: '#833ab4' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Agent Network</p>
            <p className="text-[11px] text-neutral-400">{allNodes.length} agents · hub-and-spoke topology</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { Icon: ZoomIn, action: () => zoomBtn(1.2), title: 'Zoom in' },
            { Icon: ZoomOut, action: () => zoomBtn(0.8), title: 'Zoom out' },
            { Icon: Maximize2, action: fitView, title: 'Fit to screen' },
          ].map(({ Icon, action, title }) => (
            <button key={title} onClick={action} title={title}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <Icon size={12} />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
        style={{ height: 560, backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div ref={containerRef} className="w-full h-full relative overflow-hidden"
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)} onWheel={onWheel}>

          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff0069" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#833ab4" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              {edges.map(({ p, c }) => {
                const x1 = p.x + CARD_W / 2, y1 = p.y + CARD_H;
                const x2 = c.x + CARD_W / 2, y2 = c.y, midY = (y1 + y2) / 2;
                return (
                  <path key={`${p.id}-${c.id}`}
                    d={`M${x1} ${y1} C${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                    fill="none" stroke="url(#edgeGrad)" strokeWidth={1.5} strokeDasharray="4 3" />
                );
              })}
            </g>
          </svg>

          <div className="absolute inset-0" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            {allNodes.map(node => <AgentCard key={node.id} node={node} />)}
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div variants={fadeUp} className="flex items-center gap-4 px-1">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-[10px] text-neutral-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
            {cfg.label}
          </span>
        ))}
        <span className="text-[10px] text-neutral-400 ml-auto">Drag to pan · Scroll to zoom</span>
      </motion.div>
    </motion.div>
  );
}

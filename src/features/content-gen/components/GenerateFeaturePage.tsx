'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import { Sparkles } from 'lucide-react';
import type { Generator, Style } from './generate/types';
import { BriefBuilder } from './generate/BriefBuilder';
import { RecentJobsPanel } from './generate/RecentJobsPanel';
import { QueueTabContent } from './generate/QueueTabContent';
import { GalleryTabContent } from './generate/GalleryTabContent';

function StepNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold leading-none flex-shrink-0">
      {n}
    </span>
  );
}

export default function GenerateFeaturePage() {
  const [activeTab,       setActiveTab]       = useState('generate');
  const [activeFilter,    setActiveFilter]    = useState('all');
  const [selectedModelId, setSelectedModelId] = useState<Id<'models'> | null>(null);
  const [generator,       setGenerator]       = useState<Generator>('flux');
  const [style,           setStyle]           = useState<Style>('cinematic');
  const [brief,           setBrief]           = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  const models    = useQuery(api.models.getAll)          ?? [];
  const jobs      = useQuery(api.contentGen.getJobs, {}) ?? [];
  const stats     = useQuery(api.contentGen.getStats)    ?? { total: 0, generating: 0, ready: 0, sent: 0 };
  const createJob = useMutation(api.contentGen.createJob);
  const updateJob = useMutation(api.contentGen.updateJobStatus);
  const deleteJob = useMutation(api.contentGen.deleteJob);

  if (models.length > 0 && selectedModelId === null) setSelectedModelId(models[0]._id);

  const selectedModel = models.find(m => m._id === selectedModelId);
  const canGenerate   = !!brief.trim() && !!selectedModelId && !isSubmitting;
  const genEta        = generator === 'flux' ? 45 : generator === 'kling' ? 240 : 180;

  const filteredJobs = jobs.filter(j =>
    activeFilter === 'generating' ? j.status === 'generating' :
    activeFilter === 'done'       ? j.status === 'ready' || j.status === 'sent' : true
  );

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || !selectedModelId || !selectedModel) return;
    setIsSubmitting(true);
    const jobId = await createJob({ modelId: selectedModelId, brief: brief.trim(), generator, style, niche: selectedModel.niche });
    setBrief('');
    setIsSubmitting(false);
    setActiveTab('queue');
    setTimeout(async () => { await updateJob({ jobId, status: 'ready' }); }, genEta * 1000);
  }, [canGenerate, selectedModelId, selectedModel, brief, generator, style, genEta, createJob, updateJob]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(f => setReferenceImages(p => [...p, URL.createObjectURL(f)]));
    e.target.value = '';
  };

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Content Gen"
      stat={{ label: 'Jobs', value: stats.total }}
      searchPlaceholder="Search briefs, jobs..."
      actionLabel="Generate"
      actionIcon={<Sparkles size={14} />}
      onAction={handleGenerate}
      tabs={[
        { id: 'generate', label: 'Generate', icon: <StepNum n={1} /> },
        { id: 'queue',    label: 'Queue',    icon: <StepNum n={2} /> },
        { id: 'gallery',  label: 'Gallery',  icon: <StepNum n={3} /> },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      nextProduct={{ label: 'Agents', icon: <ProductIcon product="agents" size={16} />, href: '/isso/agents' }}
      filterChips={[
        { id: 'all',        label: 'All'        },
        { id: 'generating', label: 'Generating' },
        { id: 'done',       label: 'Done'       },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      {activeTab === 'generate' && (
        <div className="flex h-full min-h-0">
          <BriefBuilder
            models={models}
            selectedModelId={selectedModelId}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModelId}
            generator={generator}
            onChangeGenerator={setGenerator}
            style={style}
            onChangeStyle={setStyle}
            brief={brief}
            onChangeBrief={setBrief}
            referenceImages={referenceImages}
            onUploadImages={handleImageUpload}
            onRemoveImage={i => setReferenceImages(p => p.filter((_, idx) => idx !== i))}
            canGenerate={canGenerate}
            isSubmitting={isSubmitting}
            onGenerate={handleGenerate}
          />
          <RecentJobsPanel
            jobs={filteredJobs}
            models={models}
            generatingCount={stats.generating}
            onDismiss={id => deleteJob({ jobId: id })}
          />
        </div>
      )}
      {activeTab === 'queue' && (
        <QueueTabContent
          jobs={jobs}
          models={models}
          generatingCount={stats.generating}
          onDismiss={id => deleteJob({ jobId: id })}
        />
      )}
      {activeTab === 'gallery' && (
        <GalleryTabContent
          jobs={jobs}
          models={models}
          onApprove={id => updateJob({ jobId: id, status: 'ready' })}
          onSend={id => updateJob({ jobId: id, status: 'sent' })}
          onDismiss={id => deleteJob({ jobId: id })}
        />
      )}
    </ContentPageShell>
  );
}

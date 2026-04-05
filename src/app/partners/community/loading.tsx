export default function CommunityLoading() {
    return (
        <div className="min-h-screen bg-siso-bg-primary text-white">
            <div className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
                <HeroSkeleton />
                <div className="space-y-5">
                    <SectionSkeleton />
                    {[0, 1, 2].map((index) => (
                        <SectionSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function HeroSkeleton() {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner animate-pulse">
            <div className="h-4 w-32 rounded-full bg-white/10" />
            <div className="mt-4 h-10 w-3/5 rounded-full bg-white/15" />
            <div className="mt-3 h-4 w-2/5 rounded-full bg-white/10" />
        </div>
    );
}

function SectionSkeleton() {
    return (
        <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 text-white/70 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-white/10" />
                <div className="space-y-2">
                    <div className="h-3 w-24 rounded-full bg-white/15" />
                    <div className="h-2 w-48 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="mt-4 h-32 w-full rounded-xl bg-white/5" />
        </div>
    );
}

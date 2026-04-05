import { Waves } from "@/components/ui/wave-background";

export const metadata = {
  title: "Waves Background Demo",
};

export default function WavesDemoPage() {
  return (
    <div className="h-screen bg-black">
      <Waves className="h-full w-full" backgroundColor="#050505" strokeColor="#f8a75c" pointerSize={0.35} />
    </div>
  );
}

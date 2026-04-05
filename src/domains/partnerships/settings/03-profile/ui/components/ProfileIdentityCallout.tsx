import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfoButton } from "@/components/ui/info-button";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/navigation/menu/SettingsGroupCallout";
import { Camera, Image as ImageIcon, UserRound } from "lucide-react";

type Props = {
  status: string;
  onStatusChange: (value: string) => void;
  age: string;
  onAgeChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  bioCharactersLeft: number;
};

export function ProfileIdentityCallout({ status, onStatusChange, age, onAgeChange, bio, onBioChange, bioCharactersLeft }: Props) {
  return (
    <SettingsGroupCallout
      icon={<UserRound className="h-4 w-4" />}
      title="Profile"
      subtitle="Shape the story partners see when they tap your card."
      showChevron={false}
    >
      <div className="space-y-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Custom Status</h3>
            <InfoButton label="About custom status" content="A short, optional line that tells partners what you're focused on right now." />
          </div>
          <Input
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            placeholder="Let partners know what you're focused on"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Avatar</h3>
              <InfoButton label="About avatar" content="This image appears on your partner card and in messages. Use a clear, square image." />
            </div>
            <div className="flex gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-siso-orange">
              <button type="button" className="flex items-center gap-1">
                <Camera className="h-4 w-4" /> Change
              </button>
              <button type="button" className="text-siso-text-muted">Remove</button>
            </div>
          </div>
          <Avatar className="h-20 w-20 border-2 border-siso-orange/70">
            <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=SISOagency" alt="Profile avatar" loading="lazy" decoding="async" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Custom Background</h3>
            <InfoButton label="About custom background" content="Backdrop behind your profile card. Choose something subtle so text stays readable." />
          </div>
          <div className="rounded-xl border border-dashed border-siso-border/70 bg-siso-bg-primary/30 p-6 text-center text-xs text-siso-text-muted">
            <ImageIcon className="mx-auto mb-2 h-6 w-6 text-siso-text-muted" />
            Drop an image here or tap to upload a new scene.
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Age</h3>
            <InfoButton label="About age" content="Your age helps us personalize your experience. This information is kept private." />
          </div>
          <Input
            type="number"
            min="18"
            max="100"
            value={age}
            onChange={(event) => onAgeChange(event.target.value)}
            placeholder="Enter your age"
            className="h-11 rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-siso-text-bold">Bio</h3>
              <InfoButton label="About bio" content="Up to 200 characters. Share what you do best so partners know where you shine." />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-siso-text-muted">{bioCharactersLeft} left</p>
          </div>
          <Textarea
            value={bio}
            onChange={(event) => onBioChange(event.target.value.slice(0, 200))}
            rows={4}
            placeholder="Write something about yourself..."
            className="rounded-xl border-siso-border/70 bg-transparent text-sm text-siso-text-primary placeholder:text-siso-text-muted"
          />
          <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-siso-text-muted">
            <span>Save to update your public profile</span>
          </div>
        </section>

        <div className="mt-3 flex justify-end">
          <Button className="rounded-xl bg-siso-orange px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Save profile
          </Button>
        </div>
      </div>
    </SettingsGroupCallout>
  );
}

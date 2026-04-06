import { Video, Image, Layers, Globe } from 'lucide-react';
import type { ApprovalItem, ApprovalStatus, ContentType } from './types';

export const ITEMS: ApprovalItem[] = [
  {
    id: '1',
    contentType: 'Reel',
    account: '@abg.ricebunny',
    accountColor: '#ff0069',
    caption: "Monday grind starts early. No excuses, just results. The gym opens at 5am and I'm already there making moves before the world wakes up.",
    hashtags: ['#gymmotivation', '#gaybear', '#fitness', '#manila', '#earlybird'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 5, 2026',
    status: 'pending',
    thumbnailGradient: 'linear-gradient(135deg, #ff006914 0%, #fd1d1d14 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#ff0069' }} />,
  },
  {
    id: '2',
    contentType: 'Post',
    account: '@onlytylerrex',
    accountColor: '#fcaf45',
    caption: 'Post-workout glow. That feeling when everything just clicks into place. Consistency is the only hack you need.',
    hashtags: ['#postworkout', '#fitness', '#gymlife', '#results'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 4, 2026',
    status: 'pending',
    thumbnailGradient: 'linear-gradient(135deg, #fcaf4514 0%, #833ab414 100%)',
    thumbnailIcon: <Image className="w-6 h-6" style={{ color: '#fcaf45' }} />,
  },
  {
    id: '3',
    contentType: 'Carousel',
    account: '@rhinxrenx',
    accountColor: '#833ab4',
    caption: '5 ways to stay consistent with your fitness goals. Save this for your next reset week. Numbers 3 and 5 changed everything for me.',
    hashtags: ['#fitnessgoals', '#consistency', '#gymtips', '#motivation'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 4, 2026',
    status: 'approved',
    thumbnailGradient: 'linear-gradient(135deg, #833ab414 0%, #78c25714 100%)',
    thumbnailIcon: <Layers className="w-6 h-6" style={{ color: '#833ab4' }} />,
  },
  {
    id: '4',
    contentType: 'Story',
    account: '@ellamira',
    accountColor: '#78c257',
    caption: 'Chasing the golden hour. Some days the light is just perfect and you have to shoot. No plan, just vibes and a camera.',
    hashtags: ['#goldenhour', '#lifestyle', '#ootd', '#manilaph'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 3, 2026',
    status: 'revision',
    thumbnailGradient: 'linear-gradient(135deg, #78c25714 0%, #00f4e214 100%)',
    thumbnailIcon: <Globe className="w-6 h-6" style={{ color: '#78c257' }} />,
  },
  {
    id: '5',
    contentType: 'Reel',
    account: '@abg.ricebunny',
    accountColor: '#ff0069',
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy. The discipline is starting to show.',
    hashtags: ['#transformationtuesday', '#fitness', '#progress', '#gym'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 3, 2026',
    status: 'published',
    thumbnailGradient: 'linear-gradient(135deg, #ff006914 0%, #833ab414 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#ff0069' }} />,
  },
  {
    id: '6',
    contentType: 'Post',
    account: '@onlytylerrex',
    accountColor: '#fcaf45',
    caption: 'Rest day ≠ lazy day. Active recovery, mobility work, and a proper meal prep session. Recovery is where the growth happens.',
    hashtags: ['#restday', '#recovery', '#mobility', '#mealprep'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 2, 2026',
    status: 'published',
    thumbnailGradient: 'linear-gradient(135deg, #fcaf4514 0%, #ff006914 100%)',
    thumbnailIcon: <Image className="w-6 h-6" style={{ color: '#fcaf45' }} />,
  },
  {
    id: '7',
    contentType: 'Carousel',
    account: '@rhinxrenx',
    accountColor: '#833ab4',
    caption: 'What I eat in a day as a gym guy. Full transparency - no bullshit, no cheat meals, just real food that fuels real results.',
    hashtags: ['#whatieat', '#gymfood', '#nutrition', '#bodybuilding'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 1, 2026',
    status: 'approved',
    thumbnailGradient: 'linear-gradient(135deg, #833ab414 0%, #fd1d1d14 100%)',
    thumbnailIcon: <Layers className="w-6 h-6" style={{ color: '#833ab4' }} />,
  },
  {
    id: '8',
    contentType: 'Reel',
    account: '@ellamira',
    accountColor: '#78c257',
    caption: "Sunset shoot at the rooftop. When the city lights up and you've got the whole view to yourself. This is the lifestyle.",
    hashtags: ['#sunset', '#lifestyle', '#rooftop', '#manila', '#vibes'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Mar 31, 2026',
    status: 'revision',
    thumbnailGradient: 'linear-gradient(135deg, #78c25714 0%, #fcaf4514 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#78c257' }} />,
  },
];

export const ACCOUNTS = ['All Accounts', '@abg.ricebunny', '@onlytylerrex', '@rhinxrenx', '@ellamira'];

export const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',        color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.18)'   },
  approved:  { label: 'Approved',       color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.18)'   },
  revision:  { label: 'Needs Revision', color: '#ea580c', bg: 'rgba(234,88,12,0.08)',   border: 'rgba(234,88,12,0.18)'   },
  published: { label: 'Published',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.18)'  },
};

export const CONTENT_TYPE_ICON: Record<ContentType, React.ReactNode> = {
  Reel:     <Video size={11} />,
  Post:     <Image size={11} />,
  Story:    <Globe size={11} />,
  Carousel: <Layers size={11} />,
};

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

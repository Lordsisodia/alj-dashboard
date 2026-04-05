/**
 * Sample blog post data — extracted from HTML references:
 *   html/www_foreplay_co (23).html  (E45 podcast episode)
 *   html/scraped/blog-post-example.html  (How To Use The World's Largest Library of Ads)
 *
 * Each post includes: title, slug, category, author, date, featuredImage, body (HTML string).
 */

export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  authorLinkedIn?: string;
  date: string;
  minRead: number;
  featuredImage: string;
  /** HTML string rendered via dangerouslySetInnerHTML inside .blog-rtb */
  bodyHtml: string;
  relatedSlugs: string[];
}

const JACK_AVATAR =
  'https://cdn.prod.website-files.com/62a4f1b9ff17080082bbb71e/679252417b4e7f917c8e9842_T01VC6J4RBM-U081BE37V8T-7338e244e1a2-512.png';

export const SAMPLE_POSTS: BlogPostData[] = [
  // ─── Post 1 — E45 Podcast (from www_foreplay_co (23).html) ─────────────────
  {
    slug: 'e45-swiping-left-on-ads-like-tinder',
    title: 'E45: Swiping Left on Ads Like Tinder with John Gargiulo',
    description:
      'In this episode we talked to John Gargiulo, the founder of Airpost. Airpost makes new video ads every week for enterprise advertisers spending $1M or more a month on Facebook ads.',
    category: 'SAAS Operators Podcast',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorRole: 'Head of Marketing',
    authorLinkedIn: 'https://www.linkedin.com/in/jackdoesecom/',
    date: 'March 9, 2026',
    minRead: 10,
    featuredImage:
      'https://cdn.prod.website-files.com/62a4f1b9ff17080082bbb71e/69a21a4490a39a15291b61b7_E45%20thumb.png',
    bodyHtml: `
      <figure style="padding-bottom:56.206088992974244%" class="w-richtext-align-fullwidth w-richtext-figure-type-video">
        <div>
          <iframe allowfullscreen="true" frameborder="0" scrolling="no"
            src="https://www.youtube.com/embed/MO44rMCaSv8"
            title="E45: Swiping Left on Ads Like Tinder with John Gargiulo"></iframe>
        </div>
      </figure>
      <p>In this episode of the SAAS Operators Podcast, we talked to John Gargiulo, the co-founder and CEO of Airpost. His clients get new ads every week, some of them never open the product, and yet performance keeps improving.</p>
      <p>Airpost arms enterprise advertisers spending $1M+ a month on paid social with new video ads every week. Clients log in, tweak a clip, swap some copy, upload and go. And a lot of them just don't log in at all — they just use Slack.</p>
      <p>What is your product actually worth when nobody's looking at the screen? That's the question every SaaS founder should be sitting with right now.</p>
      <h2>The Exhaustion Nobody Talks About</h2>
      <p>There's this narrative that AI makes everything easier, and I bought it for a while. Then I actually started using these tools and my day got significantly harder.</p>
      <p>Here's what happens. The bullshit work disappears. Inbox scrolling, document reformatting, all the stuff that felt like productivity but was actually a break from thinking. Gone. What you're left with is 100% real decisions, all day, every day.</p>
      <p>Think about it like cooking. You've got six slow cooker stews going at the same time and they all keep getting stuck. You're running around the kitchen, chopping something here, stirring something there, and one just dies and there's onions sitting on the counter. But by the end of day you made eight stews by yourself that would've taken a whole team. You feel like a god and you also need to lay down for 3 hours.</p>
      <h2>Everyone Is The Bottleneck Now</h2>
      <p>If you're still the one doing the work, the workflow is wrong. The workflow is agents doing stuff and coming to you when they get stuck, which means everyone is now the bottleneck to their own agents.</p>
      <p>Hiring has basically stopped for the people on this podcast. Growing companies, and when people leave they're just leaving the seat empty. Amazon, Shopify, Microsoft are all showing the same thing: headcount shrinking while revenue climbs.</p>
      <h2>Direction Is The Only Job Left</h2>
      <p>I keep coming back to this 10-80-10 framework. 10% direction, 80% leverage, 10% evaluation. That ratio is looking more like 1-98-1. The human part keeps shrinking in volume while somehow mattering more.</p>
      <p>A design leader at Amazon said taste is the most important thing now. When he uses Claude Code he sets the bar, gives it inputs, the AI executes and he decides what good looks like.</p>
      <h2>The Orchestra Problem</h2>
      <p>Everyone has access to the same tools. The sheet music is free, the instruments are everywhere, and you can find really good violin players busking on street corners for $20 a day. The value is putting them together into a symphony and selling tickets.</p>
      <p>Airpost is a good example. If all they do is make content, some kid with Claude Code rebuilds them in a year. The moat is everything underneath — the taxonomy that maps what's working against angles, ICPs, creative types, and why it's working.</p>
      <h2>Per Seat Pricing Is On Borrowed Time</h2>
      <p>If every customer eventually demands an MCP, and they will, per seat pricing is dead. One agent does the work of 5 people and nobody's logging in. That's like charging per chair at a restaurant where everyone's ordering delivery.</p>
      <p>Some companies are moving toward percent of spend. You do well, we do well, free to try. Others are layering usage-based AI features on top of what they already charge. Both of these make way more sense than counting seats when half the seats are occupied by bots that never complain about the UI.</p>
      <h2>Where This Is Headed</h2>
      <p>The vision for Airpost is a CMO swiping left and right on ads like Tinder. Eventually the system learns her taste so well she stops swiping. And then companies are running thousands of ads finding niche audiences automatically and nobody's watching any of them.</p>
      <p>Build for the 98% that's going to be automated. Build your moat around the 1% that requires a human to look at something and say yes or no.</p>
      <p>Everyone has access to the same tools, the same agents, the same velocity. Pick a direction worth pointing at, or someone else's agent will pick one for you.</p>
    `,
    relatedSlugs: [
      'e44-3500-customers-zero-outbound',
      'how-to-use-the-worlds-largest-library-of-ads',
      'the-2026-super-bowl-ads',
    ],
  },

  // ─── Post 2 — How To Use The World's Largest Library of Ads (scraped) ───────
  {
    slug: 'how-to-use-the-worlds-largest-library-of-ads',
    title: "How To Use The World's Largest Library Of Ads To Do Creative Strategy For Your Brands",
    description: "This is how to use ISSO's Discovery product as a real creative strategy tool.",
    category: 'Ad Inspiration',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorRole: 'Head of Marketing',
    authorLinkedIn: 'https://www.linkedin.com/in/jackdoesecom/',
    date: 'December 30, 2025',
    minRead: 7,
    featuredImage:
      'https://cdn.prod.website-files.com/62a4f1b9ff17080082bbb71e/6952d2ca7adeb06040a5df45_Screenshot%202025-12-30%20031302.png',
    bodyHtml: `
      <p>ISSO Discovery gives you access to over 100M ads. Most people open it, scroll around for ten minutes, and close it. That's not creative strategy — that's window shopping.</p>
      <p>Here's how to use it as a real research tool.</p>
      <h2 id="start-in-discovery">Start In Discovery</h2>
      <p>Go to Discovery and search for your category. Not your brand — your category. If you sell protein powder, search "protein." If you sell running shoes, search "running shoes." You want to see the whole competitive landscape, not just what you already know.</p>
      <p>Start broad. You can always narrow later. What you're looking for at this stage is volume — how many ads are running, who's running the most, and what formats dominate.</p>
      <h2 id="stack-filters-instead-of-mindless-scrolling">Stack Filters Instead Of Mindless Scrolling</h2>
      <p>The mistake most people make is scrolling through results without a filter strategy. You'll spend 45 minutes and come away with nothing actionable.</p>
      <p>Instead, stack filters deliberately. Start with platform (Facebook, TikTok, YouTube — depending on where you actually run). Then layer in format. Video first. Image second. Static almost never.</p>
      <p>Then filter by active ads only. You don't want to see what used to work — you want to see what's working right now, today, with money behind it.</p>
      <h2 id="use-time-frames-and-sorting-to-stay-current">Use Time Frames And Sorting To Stay Current</h2>
      <p>Sort by "Most Recent" and set your time frame to the last 30 days. This is your real-time competitive intelligence feed.</p>
      <p>What changed in the last month? Any new messaging angles? Any new formats showing up? That's your research question. You're looking for drift — what's the industry moving toward that you haven't tested yet.</p>
      <p>Sort by "Most Seen" separately. These are the ads with the biggest spend behind them. If a brand is running the same ad for 90 days with massive reach, that ad is printing money. Understand why before you move on.</p>
      <h2 id="learn-from-specific-brands-and-experts">Learn From Specific Brands And Experts</h2>
      <p>Filter by brand once you've done your broad research. Go deep on the 3-5 competitors who matter most. Look at their full library. What's their hook strategy? Are they leading with pain or outcome? Are they UGC-heavy or polished?</p>
      <p>Then save the best ads to your Swipe File with notes on why they work. Not just "this is good" — be specific. "This hook creates curiosity without revealing the product. The CTA is benefit-first, not action-first."</p>
      <h2 id="how-to-use-this-in-practice">How To Use This In Practice</h2>
      <p>Here's the actual workflow:</p>
      <ol>
        <li>Spend 20 minutes in Discovery before any brief call</li>
        <li>Save 10-15 ads that represent different angles on your category</li>
        <li>On the call, walk through what's working in the market before pitching your own ideas</li>
        <li>Build briefs from what's working, not from what you think should work</li>
      </ol>
      <p>The brands that win on paid social aren't the most creative. They're the most informed. They know what's already converting and they iterate on that signal faster than everyone else.</p>
      <p>That's what 100M ads gives you. Not inspiration. Intelligence.</p>
    `,
    relatedSlugs: [
      'e45-swiping-left-on-ads-like-tinder',
      'the-2026-super-bowl-ads',
      'how-we-make-creative-briefs-with-ai',
    ],
  },

  // ─── Post 3 — The 2026 Super Bowl Ads ───────────────────────────────────────
  {
    slug: 'the-2026-super-bowl-ads',
    title: 'The 2026 Super Bowl Ads',
    description:
      'Super Bowl ads are the most expensive impressions in the world. Every brand that ran one this year spent more on 30 seconds than most businesses spend on marketing in a year.',
    category: 'Creative Strategy',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorRole: 'Head of Marketing',
    authorLinkedIn: 'https://www.linkedin.com/in/jackdoesecom/',
    date: 'February 10, 2026',
    minRead: 10,
    featuredImage:
      'https://cdn.prod.website-files.com/62a4f1b9ff17080082bbb71e/699c79256759e8e5e5d30ffa_Blog.png',
    bodyHtml: `
      <p>Super Bowl ads are the most expensive impressions in the world. Every brand that ran one this year spent more on 30 seconds than most businesses spend on marketing in a year. The best marketers treat it like a free research library built by the highest-paid creative teams in the world.</p>
      <p>Here's what we learned from the 2026 Super Bowl ads.</p>
      <h2>The Shift Away From Celebrity</h2>
      <p>2026 was the year brands finally started pulling back from the celebrity-as-concept formula. Previous years leaned hard on a famous face doing something unexpected. This year, the ads that tested best were the ones where the product did the talking.</p>
      <p>The brands that spent $8M on a spot and got measurable lift were the ones with a clear product story. The celebrities were set dressing. The hook was still the hook.</p>
      <h2>Humor Is Back But It's Different</h2>
      <p>The humor that worked in 2026 was earned, not performed. It came from a genuine insight about the product or the customer — not from a random juxtaposition or a celebrity acting goofy.</p>
      <p>The ads that made people laugh and then buy had two things: a real observation about something the customer actually experiences, and a product that solved it. The joke was the setup. The product was the punchline.</p>
      <h2>What DTC Brands Can Steal</h2>
      <p>You don't have $8M. But you have the same research library. Every ad that ran in the Super Bowl is in ISSO. You can study the best creative from the best-funded teams in advertising history, in real time, for free.</p>
      <p>The specific things to steal:</p>
      <ul>
        <li>The hook structure — how they get attention in the first two seconds</li>
        <li>The benefit sequencing — in what order they reveal what the product does</li>
        <li>The social proof mechanism — how they make the claim believable</li>
        <li>The CTA — what they ask you to do and how they frame it</li>
      </ul>
      <p>These are repeatable patterns. They work at $8M spend. They work at $800 spend. The mechanics are the same.</p>
      <h2>The Meta Insight</h2>
      <p>Every brand at the Super Bowl is trying to win the same thing: attention in a room full of people who are actively trying to be entertained. That's the highest-stakes version of what you're doing every day on paid social.</p>
      <p>Your audience is also trying to be entertained. Your competition for attention is also fierce. The only difference is the budget.</p>
      <p>Study these ads. Not for the celebrity cameos. For the craft.</p>
    `,
    relatedSlugs: [
      'how-to-use-the-worlds-largest-library-of-ads',
      'e45-swiping-left-on-ads-like-tinder',
      'how-we-make-creative-briefs-with-ai',
    ],
  },
];

/** Look up a post by slug. Returns undefined if not found. */
export function getPostBySlug(slug: string): BlogPostData | undefined {
  return SAMPLE_POSTS.find((p) => p.slug === slug);
}

/** Get related posts by their slugs (excludes missing slugs silently). */
export function getRelatedPosts(slugs: string[]): BlogPostData[] {
  return slugs
    .map((s) => SAMPLE_POSTS.find((p) => p.slug === s))
    .filter((p): p is BlogPostData => p !== undefined);
}

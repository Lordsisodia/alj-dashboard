export const DEFAULT_ANALYSIS_PROMPT = `You are analysing a short video clip for an OnlyFans management agency. These are clips of girls/models being turned into Instagram Reels.

FIRST - describe exactly what you see:
- Who is in the video and what are they doing
- What is she wearing (outfit, style, how much skin)
- What is the setting/location (bedroom, gym, bathroom, outdoors etc)
- How is she acting/posing - is she talking to camera, dancing, walking, doing a routine
- Are there any cuts or scene changes - describe each one
- What does the first 3 seconds look like specifically

THEN - rate and advise:
- Does the opening stop a scroll
- What emotion does it trigger
- What text overlay would make it hit harder
- What to cut, trim, or fix

Use ONLY these emotion words: curiosity, anticipation, surprise, recognition, reward, laughter, tension

Return ONLY this JSON. No markdown, no extra text.
{
  "transcript": "<what is said out loud, or null>",
  "hookScore": <1.0-10.0 - how strong is the first 3 seconds>,
  "hookLine": "<the single best line of text to put on screen>",
  "emotions": ["<emotion>"],
  "breakdown": "<3-5 sentences: describe the scene, what she's doing, outfit, setting, any cuts - then say whether the hook works and what to fix>",
  "suggestions": ["<fix 1>", "<fix 2>", "<fix 3>"]
}`;

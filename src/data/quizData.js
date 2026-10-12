export const QUIZ_QUESTIONS = [
  {
    q: "Your friend's contract earns something today. What do you get for each level?",
    opts: ["2% of what the contract earns that day", "2% of the purchase price", "42% of what it earns"],
    ans: 0,
    why: "Two percent of what the contract earns that day. Never a share of the purchase price.",
  },
  {
    q: "Everest is the top rank. On how many levels is it paid?",
    opts: ["7", "21", "42"],
    ans: 1,
    why: "Three levels per rank: Fuji 3, Kilimanjaro 6 … Everest 21.",
  },
  {
    q: "What is the daily cap at Fuji, the first rank?",
    opts: ["1,000 USDT", "7,000 USDT", "There is no cap"],
    ans: 0,
    why: "The caps go from 1,000 USDT at Fuji to 7,000 USDT at Everest. They apply to the base matrix; the differential has no cap.",
  },
  {
    q: "At Fuji, how much of your volume can one single line count for?",
    opts: ["Half, at most", "A fifth", "All of it — one line is enough"],
    ans: 0,
    why: "Half at Fuji and Kilimanjaro, a third at Matterhorn and Denali, a quarter at Rainier, a fifth at K-2 and Everest. Build wide.",
  },
  {
    q: "What is the most a module can give back?",
    opts: ["2× its price, price included (2.2× for a Believer)", "Unlimited, as long as it runs", "Only the price back"],
    ans: 0,
    why: "A module ends at two times its price, price included. A Believer, with Auto-Rebuy on for the whole life, ends at 2.2×.",
  },
  {
    q: "Which sentence goes with every conversation?",
    opts: ["The engine never has a zero day", "Most members earn no commission at all; results and rewards are not guaranteed", "A module pays every day, no matter what"],
    ans: 1,
    why: "The disclosure line. Every figure is an illustration at the engine's average daily result.",
  },
];

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어 · Korean" },
  { value: "ja", label: "日本語 · Japanese" },
  { value: "zh-Hans", label: "简体中文 · Chinese (Simplified, Mandarin)" },
  { value: "zh-Hant", label: "繁體中文 · Chinese (Traditional, for Cantonese readers)" },
  { value: "es", label: "Español · Spanish" },
  { value: "pt", label: "Português · Portuguese" },
  { value: "fr", label: "Français · French" },
  { value: "it", label: "Italiano · Italian" },
  { value: "hu", label: "Magyar · Hungarian" },
  { value: "ru", label: "Русский · Russian" },
  { value: "af", label: "Afrikaans · Afrikaans" },
  { value: "ms", label: "Bahasa Melayu · Malay (Malaysia & Singapore)" },
  { value: "id", label: "Bahasa Indonesia · Indonesian" },
  { value: "th", label: "ไทย · Thai" },
  { value: "hi", label: "हिन्दी · Hindi" },
  { value: "bn", label: "বাংলা · Bengali" },
  { value: "ar", label: "العربية · Arabic" },
  { value: "ur", label: "اردو · Urdu" },
  { value: "uk", label: "Українська · Ukrainian" },
];


export interface Sender {
  name: string;
  count: number;
  sizeMb: number;
  status: "nuke" | "review" | "keep";
  category: "platform" | "marketplace" | "newsletter" | "work" | "personal";
  domain: string;
}

export const TOTAL_EMAILS = 9420;
export const INDEXED_EMAILS = 8136;

// Snapshot from SQLite index — March 10, 2026
export const INITIAL_SENDERS: Sender[] = [
  {name:"LinkedIn",count:1035,sizeMb:92.3,status:"nuke",category:"platform",domain:"linkedin.com"},
  {name:"Flippa",count:437,sizeMb:33.3,status:"nuke",category:"marketplace",domain:"flippa.com"},
  {name:"Bluehost",count:348,sizeMb:10.1,status:"nuke",category:"platform",domain:"bluehost.com"},
  {name:"Upwork",count:282,sizeMb:8.8,status:"nuke",category:"platform",domain:"upwork.com"},
  {name:"Empire Flippers",count:237,sizeMb:16.5,status:"nuke",category:"marketplace",domain:"empireflippers.com"},
  {name:"Substack: Pragmatic Engineer",count:0,sizeMb:0,status:"nuke",category:"newsletter",domain:"pragmaticengineer@substack.com"},
  {name:"Motion Invest",count:187,sizeMb:14.1,status:"nuke",category:"marketplace",domain:"motioninvest.com"},
  {name:"egghead.io",count:179,sizeMb:6.4,status:"nuke",category:"platform",domain:"egghead.io"},
  {name:"beehiiv: That Startup Guy",count:146,sizeMb:15.6,status:"review",category:"newsletter",domain:"thatstartupguy@mail.beehiiv.com"},  {name:"Substack: Polymathic Engineer",count:128,sizeMb:12.7,status:"nuke",category:"newsletter",domain:"francofernando@substack.com"},
  {name:"Fundrise",count:126,sizeMb:7.2,status:"nuke",category:"platform",domain:"fundrise.com"},
  {name:"beehiiv: Richard Patey",count:117,sizeMb:9.4,status:"review",category:"newsletter",domain:"invest@mail.beehiiv.com"},
  {name:"Medium",count:109,sizeMb:6.8,status:"nuke",category:"platform",domain:"medium.com"},
  {name:"Hostinger",count:101,sizeMb:4.1,status:"nuke",category:"platform",domain:"hostinger.com"},
  {name:"A.Team",count:97,sizeMb:3.0,status:"nuke",category:"platform",domain:"a.team"},
  {name:"BlogVault",count:90,sizeMb:1.0,status:"nuke",category:"platform",domain:"blogvault.net"},
  {name:"Microns",count:89,sizeMb:7.9,status:"nuke",category:"marketplace",domain:"microns.io"},
  {name:"MentorCruise",count:88,sizeMb:3.9,status:"nuke",category:"platform",domain:"mentorcruise.com"},
  {name:"This Week In React",count:87,sizeMb:9.7,status:"nuke",category:"newsletter",domain:"thisweekinreact.com"},
  {name:"Substack: Justin Welsh",count:82,sizeMb:6.8,status:"nuke",category:"newsletter",domain:"justinwelsh@substack.com"},
  {name:"ClimateDraft",count:82,sizeMb:10.2,status:"nuke",category:"newsletter",domain:"climatedraft.org"},
  {name:"Acquire.com",count:78,sizeMb:5.3,status:"nuke",category:"marketplace",domain:"acquire.com"},
  {name:"Modern Health",count:74,sizeMb:2.0,status:"nuke",category:"platform",domain:"modernhealth.com"},
  {name:"Justin Welsh (direct)",count:73,sizeMb:4.8,status:"nuke",category:"newsletter",domain:"justinwelsh.me"},
  {name:"Investors Club",count:73,sizeMb:3.5,status:"nuke",category:"marketplace",domain:"investors.club"},
  {name:"Wave Apps: Marketing",count:72,sizeMb:4.7,status:"nuke",category:"platform",domain:"welcome@waveapps.com"},
  {name:"WP Engine",count:65,sizeMb:3.9,status:"review",category:"platform",domain:"wpengine.com"},
  {name:"Amazing CTO",count:64,sizeMb:1.5,status:"review",category:"newsletter",domain:"amazingcto.com"},
  {name:"Udacity",count:59,sizeMb:3.9,status:"nuke",category:"platform",domain:"udacity.com"},
  {name:"Nano Flips",count:56,sizeMb:2.2,status:"review",category:"marketplace",domain:"nanoflips.com"},
  {name:"Niche Investor",count:55,sizeMb:4.4,status:"review",category:"newsletter",domain:"nicheinvestor.com"},
  {name:"Substack: Platform emails",count:49,sizeMb:3.2,status:"nuke",category:"platform",domain:"no-reply@substack.com"},
  {name:"Winning Agent",count:45,sizeMb:9.5,status:"nuke",category:"platform",domain:"winningagent.com"},
  {name:"SF Climate Week",count:34,sizeMb:2.1,status:"nuke",category:"newsletter",domain:"sfclimateweek.org"},
  {name:"Climatebase",count:34,sizeMb:1.3,status:"nuke",category:"newsletter",domain:"climatebase.org"},  {name:"Advantech",count:29,sizeMb:1.2,status:"review",category:"platform",domain:"advantech.com"},
  {name:"Blockpit",count:23,sizeMb:1.8,status:"review",category:"platform",domain:"blockpit.io"},
  {name:"BlockFi",count:1,sizeMb:0.04,status:"nuke",category:"platform",domain:"blockfi.com"},
  {name:"Windsurf",count:21,sizeMb:0.6,status:"review",category:"platform",domain:"windsurf.ai"},
  {name:"Replit",count:22,sizeMb:0.8,status:"review",category:"platform",domain:"replit.com"},
  {name:"beehiiv: Null Pointer Club",count:19,sizeMb:1.2,status:"review",category:"newsletter",domain:"nullpointerclub@mail.beehiiv.com"},
  {name:"beehiiv: Climatebase",count:16,sizeMb:1.7,status:"nuke",category:"newsletter",domain:"climatebase@mail.beehiiv.com"},
  {name:"Indie Hackers",count:7,sizeMb:0.4,status:"review",category:"newsletter",domain:"indiehackers.com"},
  {name:"AlgoExpert",count:7,sizeMb:0.1,status:"nuke",category:"platform",domain:"algoexpert.io"},
  {name:"Substack: Dan Abramov",count:5,sizeMb:0.3,status:"review",category:"newsletter",domain:"danabramov@substack.com"},
  {name:"Substack: AI Daily",count:4,sizeMb:0.4,status:"review",category:"newsletter",domain:"joinaidaily@substack.com"},
  {name:"beehiiv: Part Time Tech",count:4,sizeMb:0.3,status:"review",category:"newsletter",domain:"parttimetech@mail.beehiiv.com"},
  {name:"Kraken",count:4,sizeMb:0.3,status:"review",category:"platform",domain:"kraken.com"},
  {name:"TEKsystems / Allegis",count:314,sizeMb:94.9,status:"keep",category:"work",domain:"teksystems.com"},
  {name:"TaxDome / CPA Dude",count:221,sizeMb:8.4,status:"keep",category:"work",domain:"taxdome.com"},
  {name:"InfoMagnus / Rinat",count:193,sizeMb:14.3,status:"keep",category:"work",domain:"infomagnus.com"},
  {name:"nick@lucidsolutions (self)",count:464,sizeMb:94.1,status:"keep",category:"personal",domain:"lucidsolutions.io"},
  {name:"nick@hindiemedia (self)",count:74,sizeMb:9.0,status:"keep",category:"personal",domain:"hindiemedia.com"},
  {name:"nick@neborecords (self)",count:17,sizeMb:15.3,status:"keep",category:"personal",domain:"neborecords.com"},
  {name:"Google",count:131,sizeMb:6.6,status:"keep",category:"work",domain:"google.com"},
  {name:"Corey Peterson",count:104,sizeMb:120.8,status:"keep",category:"personal",domain:"petersonhomecenter.com"},
  {name:"Relay Financial",count:118,sizeMb:4.2,status:"keep",category:"work",domain:"relayfi.com"},
  {name:"PaperlessEmployee",count:87,sizeMb:0.5,status:"keep",category:"work",domain:"paperlessemployee.com"},
  {name:"Amazon / KDP",count:58,sizeMb:2.9,status:"keep",category:"work",domain:"amazon.com"},
  {name:"Wave Apps: Transactional",count:63,sizeMb:3.2,status:"keep",category:"work",domain:"noreply@waveapps.com"},
  {name:"GitHub",count:52,sizeMb:0.9,status:"keep",category:"work",domain:"github.com"},  {name:"Fidelity",count:66,sizeMb:2.4,status:"keep",category:"work",domain:"fidelity.com"},
  {name:"Chase",count:48,sizeMb:2.1,status:"keep",category:"work",domain:"chase.com"},
  {name:"TrueBooks CPA",count:50,sizeMb:1.4,status:"keep",category:"work",domain:"truebookscpa.com"},
  {name:"Anthropic",count:22,sizeMb:1.5,status:"keep",category:"work",domain:"anthropic.com"},
  {name:"SetHabits (own)",count:13,sizeMb:0.1,status:"keep",category:"personal",domain:"sethabits.com"},
  {name:"Allegis Learning",count:36,sizeMb:0.2,status:"keep",category:"work",domain:"litmos.com"},
  {name:"Vercel",count:34,sizeMb:1.5,status:"keep",category:"work",domain:"vercel.com"},
  {name:"beehiiv: Acquire The Web",count:91,sizeMb:9.4,status:"keep",category:"newsletter",domain:"acquire@mail.beehiiv.com"},
  {name:"Fiverr",count:17,sizeMb:0.5,status:"review",category:"platform",domain:"fiverr.com"},
];

export const CATEGORIES = {
  platform: { label: "Platform", icon: "⚙️" },
  marketplace: { label: "Marketplace", icon: "🏪" },
  newsletter: { label: "Newsletter", icon: "📰" },
  work: { label: "Work", icon: "💼" },
  personal: { label: "Personal", icon: "👤" },
} as const;
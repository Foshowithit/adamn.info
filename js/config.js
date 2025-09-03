// Configuration data for Adam Hub
const CONFIG = {
  profile: {
    name: "Adam N.",
    nickname: "Hoss",
    tagline: "Wireless Tower Construction | DeFi Advisor | AI Builder",
    bio: "Building AI tools, automated systems and DeFi trading intelligence.",
    avatar: "/images/profile.jpg",
    location: "Plymouth, NH",
    timezone: "EST"
  },
  
  quickLinks: [
    {
      id: "twitter",
      title: "Twitter / X",
      url: "https://x.com/hog_crankr",
      icon: "twitter",
      featured: true,
      color: "#6B7280"
    },
    {
      id: "telegram",
      title: "Telegram",
      url: "https://t.me/hog_cranker",
      icon: "send",
      featured: true,
      color: "#9CA3AF"
    }
  ],
  
  projects: [
    {
      id: "simple-task-raiders",
      title: "Simple Task Raiders",
      description: "Human bots at $10/hour for tasks automation can't handle. Click work, captchas, data entry, and complex workflows.",
      image: "/images/projects/task-raiders.jpg",
      link: "https://simpletaskraiders.com",
      status: "active",
      tags: ["Service", "Growth", "Automation"],
      featured: true
    },
    {
      id: "tower-talent",
      title: "Tower Talent",
      description: "Job marketplace and talent matching for tower climbers and fiber technicians.",
      image: "/images/projects/tower-talent.jpg",
      link: "https://frontend-flax-eight-82.vercel.app/",
      status: "completed",
      tags: ["Jobs", "Telecom", "Marketplace"],
      featured: true
    },
    {
      id: "nineveh90",
      title: "Nineveh90",
      description: "Biblical prophecy tracking and theological analysis of current world events.",
      image: "/images/projects/nineveh90.jpg",
      link: "https://nineveh90.website/",
      status: "active",
      tags: ["Faith", "Prophecy", "Analysis"],
      featured: true
    }
  ],
  
  tools: [
    {
      id: "claude-code",
      title: "Claude Code",
      description: "The best AI coding assistant. I use this daily for all development work.",
      image: "/images/tools/claude-code.jpg",
      link: "https://claude.ai/code?ref=adamn",
      category: "AI Tools",
      price: "$20/mo",
      featured: true
    },
    {
      id: "vercel",
      title: "Vercel",
      description: "Deploy fast. Scale instantly. Host everything. Best platform for Next.js apps.",
      image: "/images/tools/vercel.jpg",
      link: "https://vercel.com?ref=adamn",
      category: "Hosting",
      price: "Free tier",
      featured: true
    },
    {
      id: "phantom-wallet",
      title: "Phantom Wallet",
      description: "The smoothest Solana wallet experience. Essential for DeFi and NFT trading.",
      image: "/images/tools/phantom.jpg",
      link: "https://phantom.app?ref=adamn",
      category: "Crypto",
      price: "Free",
      featured: true
    },
    {
      id: "jupiter",
      title: "Jupiter Exchange",
      description: "Best prices, best routes. The aggregator I use for all Solana trading.",
      image: "/images/tools/jupiter.jpg",
      link: "https://jup.ag?ref=adamn",
      category: "DeFi",
      price: "Free",
      featured: false
    },
    {
      id: "padre",
      title: "Padre",
      description: "Advanced trading platform with professional tools and analytics for DeFi.",
      image: "/images/tools/padre.jpg",
      link: "https://trade.padre.gg/rk/hog_crankr",
      category: "DeFi",
      price: "Free",
      featured: false
    },
    {
      id: "gmgn",
      title: "GMGN",
      description: "Real-time on-chain analytics and meme coin discovery platform.",
      image: "/images/tools/gmgn.jpg",
      link: "https://gmgn.ai/r/6x8h0RLj",
      category: "DeFi",
      price: "Free",
      featured: false
    },
    {
      id: "railway",
      title: "Railway",
      description: "Simple cloud deployments. Great for APIs and backend services.",
      image: "/images/tools/railway.jpg",
      link: "https://railway.app?ref=adamn",
      category: "Hosting",
      price: "$5/mo",
      featured: false
    },
    {
      id: "thunder-compute",
      title: "Thunder Compute",
      description: "High-performance cloud compute for AI workloads and intensive applications.",
      image: "/images/tools/thunder-compute.jpg",
      link: "https://www.thundercompute.com/?ref=XiLYz3BcCWTpwhpmYDf0vAouEry2",
      category: "Hosting",
      price: "Variable",
      featured: false
    }
  ],
  
  supportOrganizations: [
    {
      id: "climber-protection-group",
      title: "Climber Protection Group",
      description: "Fighting industry exploitation and protecting tower workers' rights and safety.",
      url: "https://climberprotectiongroup.org/industry-exploitation",
      icon: "shield",
      featured: true,
      color: "#6B7280"
    }
  ],
  
  analytics: {
    enabled: true,
    trackClicks: true,
    provider: "google-analytics",
    id: "GA_MEASUREMENT_ID"
  },
  
  seo: {
    title: "Adam Normandin - Fiber Tech, Crypto Trader, AI Builder",
    description: "Tower climber turned trader and AI builder. Follow my projects, tools, and insights on crypto, faith, and technology.",
    keywords: ["Adam Normandin", "fiber technician", "crypto trading", "AI automation", "Solana", "tower climbing"],
    url: "https://adamn.dev",
    image: "/images/og-image.jpg"
  }
};
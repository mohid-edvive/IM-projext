export interface Asset {
  id: string;
  ticker: string;
  name: string;
  description: string;
  category: 'stocks' | 'commodities' | 'crypto' | 'etfs' | 'indices';
  sector?: string;
  unlockedByLesson: string;
}

export const assets: Asset[] = [
  // ETFs
  { id: "SPY", ticker: "SPY", name: "S&P 500 ETF", description: "Tracks the 500 largest US companies. The most popular way to invest in the overall US stock market.", category: "etfs", unlockedByLesson: "1-1" },
  { id: "QQQ", ticker: "QQQ", name: "NASDAQ 100 ETF", description: "Tracks the 100 largest non-financial companies on the NASDAQ exchange — heavily weighted toward tech giants like Apple, Microsoft, and Google.", category: "etfs", unlockedByLesson: "8-1" },
  { id: "VTI", ticker: "VTI", name: "Total US Market ETF", description: "Covers the entire US stock market — large, mid, and small companies. A single fund for broad US exposure.", category: "etfs", unlockedByLesson: "8-1" },
  { id: "IWM", ticker: "IWM", name: "Russell 2000 ETF", description: "Tracks 2,000 small US companies. Small-caps are riskier but can grow faster than large-caps.", category: "etfs", unlockedByLesson: "8-1" },
  { id: "TLT", ticker: "TLT", name: "20+ Year Treasury ETF", description: "Tracks long-term US government bonds. Considered very safe but sensitive to interest rate changes.", category: "etfs", unlockedByLesson: "8-1" },
  { id: "GLD", ticker: "GLD", name: "Gold ETF", description: "Tracks the price of physical gold. A popular 'safe haven' during market uncertainty.", category: "etfs", unlockedByLesson: "3-1" },
  { id: "VXX", ticker: "VXX", name: "VIX Short-Term Futures", description: "Tracks market volatility (the 'fear index'). Goes up when markets are panicking.", category: "etfs", unlockedByLesson: "10-1" },
  { id: "XLE", ticker: "XLE", name: "Energy Select Sector", description: "Tracks major US energy companies like ExxonMobil and Chevron. Moves with oil prices.", category: "etfs", unlockedByLesson: "9-1" },
  { id: "XLF", ticker: "XLF", name: "Financial Select Sector", description: "Tracks major US banks and financial firms like JPMorgan and Goldman Sachs.", category: "etfs", unlockedByLesson: "9-1" },
  { id: "ARKK", ticker: "ARKK", name: "ARK Innovation ETF", description: "Actively managed fund focused on disruptive innovation — AI, genomics, fintech. High risk, high reward.", category: "etfs", unlockedByLesson: "9-1" },

  // Stocks - Tech
  { id: "AAPL", ticker: "AAPL", name: "Apple", description: "World's most valuable company. Makes iPhones, Macs, and services like Apple Music and iCloud.", category: "stocks", sector: "Tech", unlockedByLesson: "2-1" },
  { id: "MSFT", ticker: "MSFT", name: "Microsoft", description: "Software giant behind Windows, Office 365, Azure cloud, and Xbox. Major AI investor.", category: "stocks", sector: "Tech", unlockedByLesson: "2-1" },
  { id: "NVDA", ticker: "NVDA", name: "NVIDIA", description: "Makes GPUs (graphics chips) that power AI, gaming, and data centers. The backbone of the AI revolution.", category: "stocks", sector: "Tech", unlockedByLesson: "5-1" },
  { id: "GOOGL", ticker: "GOOGL", name: "Alphabet (Google)", description: "Parent company of Google — dominates search, ads, YouTube, and cloud computing.", category: "stocks", sector: "Tech", unlockedByLesson: "5-1" },
  { id: "META", ticker: "META", name: "Meta Platforms", description: "Owns Facebook, Instagram, and WhatsApp. Also investing heavily in VR/metaverse.", category: "stocks", sector: "Tech", unlockedByLesson: "9-1" },
  { id: "AMZN", ticker: "AMZN", name: "Amazon", description: "E-commerce giant that also runs AWS, the world's largest cloud computing platform.", category: "stocks", sector: "Tech", unlockedByLesson: "4-1" },
  { id: "TSLA", ticker: "TSLA", name: "Tesla", description: "Electric vehicle maker led by Elon Musk. Also makes solar panels and energy storage.", category: "stocks", sector: "Tech", unlockedByLesson: "4-1" },
  { id: "AMD", ticker: "AMD", name: "AMD", description: "Makes CPUs and GPUs competing with Intel and NVIDIA. Growing in data center and AI chips.", category: "stocks", sector: "Tech", unlockedByLesson: "9-1" },
  { id: "INTC", ticker: "INTC", name: "Intel", description: "Historic chip maker struggling to compete. Building new fabs to regain manufacturing lead.", category: "stocks", sector: "Tech", unlockedByLesson: "9-1" },
  { id: "QCOM", ticker: "QCOM", name: "Qualcomm", description: "Makes Snapdragon chips for smartphones and 5G modems. Powers most Android phones.", category: "stocks", sector: "Tech", unlockedByLesson: "9-1" },

  // Stocks - Finance
  { id: "JPM", ticker: "JPM", name: "JPMorgan Chase", description: "America's largest bank by assets. Investment banking, consumer banking, and asset management.", category: "stocks", sector: "Finance", unlockedByLesson: "9-1" },
  { id: "GS", ticker: "GS", name: "Goldman Sachs", description: "Elite investment bank known for trading, M&A advisory, and wealth management.", category: "stocks", sector: "Finance", unlockedByLesson: "9-1" },
  { id: "V", ticker: "V", name: "Visa", description: "World's largest payment network. Processes billions of card transactions globally.", category: "stocks", sector: "Finance", unlockedByLesson: "9-1" },
  { id: "MA", ticker: "MA", name: "Mastercard", description: "Second-largest payment network. Earns fees every time someone swipes a Mastercard.", category: "stocks", sector: "Finance", unlockedByLesson: "9-1" },
  { id: "BLK", ticker: "BLK", name: "BlackRock", description: "World's largest asset manager (~$10T under management). Created the iShares ETF family.", category: "stocks", sector: "Finance", unlockedByLesson: "9-1" },

  // Stocks - Healthcare
  { id: "JNJ", ticker: "JNJ", name: "Johnson & Johnson", description: "Pharma and consumer health giant. Makes medicines, medical devices, and household brands.", category: "stocks", sector: "Healthcare", unlockedByLesson: "9-1" },
  { id: "PFE", ticker: "PFE", name: "Pfizer", description: "Major pharma company known for vaccines and blockbuster drugs. Made the COVID-19 vaccine.", category: "stocks", sector: "Healthcare", unlockedByLesson: "9-1" },
  { id: "UNH", ticker: "UNH", name: "UnitedHealth", description: "Largest US health insurer. Also runs Optum, a massive healthcare services business.", category: "stocks", sector: "Healthcare", unlockedByLesson: "9-1" },

  // Stocks - Energy
  { id: "XOM", ticker: "XOM", name: "ExxonMobil", description: "World's largest publicly traded oil & gas company. Revenue tied directly to oil prices.", category: "stocks", sector: "Energy", unlockedByLesson: "9-1" },
  { id: "CVX", ticker: "CVX", name: "Chevron", description: "Major integrated oil company. Explores, produces, and refines petroleum worldwide.", category: "stocks", sector: "Energy", unlockedByLesson: "9-1" },

  // Stocks - Consumer
  { id: "WMT", ticker: "WMT", name: "Walmart", description: "World's largest retailer by revenue. Operates 10,000+ stores and a growing e-commerce business.", category: "stocks", sector: "Consumer", unlockedByLesson: "9-1" },
  { id: "NKE", ticker: "NKE", name: "Nike", description: "World's largest athletic brand. Sells shoes, apparel, and equipment globally.", category: "stocks", sector: "Consumer", unlockedByLesson: "9-1" },
  { id: "KO", ticker: "KO", name: "Coca-Cola", description: "Iconic beverage company. Warren Buffett's favorite stock — known for steady dividends.", category: "stocks", sector: "Consumer", unlockedByLesson: "9-1" },
  { id: "DIS", ticker: "DIS", name: "Disney", description: "Entertainment empire — theme parks, movies (Marvel, Star Wars, Pixar), and Disney+ streaming.", category: "stocks", sector: "Consumer", unlockedByLesson: "9-1" },

  // Commodities
  { id: "GC=F", ticker: "GC=F", name: "Gold", description: "Precious metal used as a store of value for thousands of years. Classic inflation hedge.", category: "commodities", unlockedByLesson: "3-1" },
  { id: "SI=F", ticker: "SI=F", name: "Silver", description: "Precious metal with industrial uses (electronics, solar panels) and investment demand.", category: "commodities", unlockedByLesson: "3-1" },
  { id: "CL=F", ticker: "CL=F", name: "Oil (WTI)", description: "West Texas Intermediate crude oil — the US benchmark. Drives energy costs globally.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "HG=F", ticker: "HG=F", name: "Copper", description: "Industrial metal essential for construction and electronics. Called 'Dr. Copper' because it predicts economic health.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "ZW=F", ticker: "ZW=F", name: "Wheat", description: "Staple food commodity. Prices affected by weather, geopolitics, and global demand.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "NG=F", ticker: "NG=F", name: "Natural Gas", description: "Used for heating, electricity, and industry. Extremely volatile — prices can double in weeks.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "PL=F", ticker: "PL=F", name: "Platinum", description: "Rare precious metal used in catalytic converters and jewelry. Rarer than gold.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "ZC=F", ticker: "ZC=F", name: "Corn", description: "Major crop used for food, animal feed, and ethanol fuel. Traded heavily on futures markets.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "KC=F", ticker: "KC=F", name: "Coffee", description: "World's second-most traded commodity after oil. Prices driven by weather in Brazil and Vietnam.", category: "commodities", unlockedByLesson: "6-1" },
  { id: "CT=F", ticker: "CT=F", name: "Cotton", description: "Soft commodity used in textiles. Prices affected by weather, trade policies, and fashion demand.", category: "commodities", unlockedByLesson: "6-1" },

  // Crypto
  { id: "BTC-USD", ticker: "BTC-USD", name: "Bitcoin", description: "The original cryptocurrency. Digital 'gold' with a fixed supply of 21 million coins.", category: "crypto", unlockedByLesson: "7-1" },
  { id: "ETH-USD", ticker: "ETH-USD", name: "Ethereum", description: "Programmable blockchain that runs smart contracts and DeFi apps. Powers most NFTs.", category: "crypto", unlockedByLesson: "7-1" },
  { id: "SOL-USD", ticker: "SOL-USD", name: "Solana", description: "High-speed blockchain competing with Ethereum. Known for fast, cheap transactions.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "BNB-USD", ticker: "BNB-USD", name: "BNB", description: "Token of the Binance exchange — the world's largest crypto exchange by volume.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "XRP-USD", ticker: "XRP-USD", name: "XRP", description: "Designed for fast cross-border payments. Used by banks and financial institutions.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "ADA-USD", ticker: "ADA-USD", name: "Cardano", description: "Research-driven blockchain focused on sustainability and peer-reviewed development.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "AVAX-USD", ticker: "AVAX-USD", name: "Avalanche", description: "Fast blockchain platform for DeFi and enterprise applications. Sub-second finality.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "DOT-USD", ticker: "DOT-USD", name: "Polkadot", description: "Connects different blockchains together. Enables cross-chain communication.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "LINK-USD", ticker: "LINK-USD", name: "Chainlink", description: "Provides real-world data to smart contracts. The leading blockchain 'oracle' network.", category: "crypto", unlockedByLesson: "10-1" },
  { id: "DOGE-USD", ticker: "DOGE-USD", name: "Dogecoin", description: "Meme coin that became mainstream. Started as a joke but has a large community.", category: "crypto", unlockedByLesson: "10-1" },
];

export const getAssetById = (id: string) => assets.find(a => a.id === id);
export const getAssetsByCategory = (cat: Asset['category']) => assets.filter(a => a.category === cat);

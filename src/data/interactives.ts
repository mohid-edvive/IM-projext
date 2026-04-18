// Interactive blocks mapped by lesson ID
// Each lesson gets contextual interactive elements

export interface InteractiveBlock {
  type: "callout" | "calculator" | "scenario" | "fact" | "key_takeaway" | "matching" | "slider_challenge" | "chart_example";
  // Position: after which paragraph (0-indexed) to insert this block
  afterParagraph: number;
  data: Record<string, any>;
}

export const lessonInteractives: Record<string, InteractiveBlock[]> = {
  "1-1": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "lightbulb",
        title: "Think of it this way",
        text: "If Apple is worth $3 trillion and has about 15.6 billion shares, each share represents roughly $192 of the company. You own that slice!",
      },
    },
    {
      type: "calculator",
      afterParagraph: 2,
      data: {
        title: "Try It: Calculate Your Ownership",
        description: "If you buy shares of a company, how much of it do you own?",
        inputs: [
          { label: "Company total shares", key: "totalShares", default: 1000000 },
          { label: "Shares you buy", key: "yourShares", default: 100 },
        ],
        formula: "(yourShares / totalShares) * 100",
        resultLabel: "You own",
        resultSuffix: "% of the company",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Quick Scenario",
        situation: "You bought 10 shares of a pizza restaurant at $20 each. The restaurant starts delivering pizzas and revenue doubles. The stock price rises to $35.",
        question: "What is your profit?",
        options: [
          { text: "$150 (You made $15 per share × 10 shares)", correct: true },
          { text: "$350 (The new total value)", correct: false },
          { text: "$200 (Your original investment)", correct: false },
        ],
        explanation: "You invested $200 (10 × $20) and now have $350 (10 × $35). Profit = $350 - $200 = $150.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 5,
      data: {
        points: [
          "A stock = ownership in a real company",
          "Stock prices reflect what people think the company is worth",
          "Companies sell stocks through IPOs to raise money",
          "Your share gains or loses value as the company does",
        ],
      },
    },
  ],
  "1-2": [
    {
      type: "fact",
      afterParagraph: 0,
      data: {
        icon: "landmark",
        text: "The NYSE was founded in 1792 when 24 brokers signed an agreement under a buttonwood tree on Wall Street. It's now the largest stock exchange in the world by market cap.",
      },
    },
    {
      type: "matching",
      afterParagraph: 2,
      data: {
        title: "Match the Terms",
        pairs: [
          { term: "Bid", definition: "Price buyers are willing to pay" },
          { term: "Ask", definition: "Price sellers want to receive" },
          { term: "Spread", definition: "Difference between bid and ask" },
          { term: "Market Maker", definition: "Firm that matches buy/sell orders" },
        ],
      },
    },
    {
      type: "slider_challenge",
      afterParagraph: 3,
      data: {
        title: "The Spread Challenge",
        description: "A stock has a bid of $99.50 and an ask of $100.50. How much is the spread?",
        min: 0,
        max: 5,
        step: 0.1,
        correctValue: 1.0,
        tolerance: 0.1,
        unit: "$",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Stock exchanges are digital marketplaces matching buyers and sellers",
          "The spread is the cost of trading — smaller is better",
          "Modern trades execute in milliseconds",
          "Price changes every time a trade happens",
        ],
      },
    },
  ],
  "1-3": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "bar-chart",
        title: "The Four Forces",
        text: "Every stock price movement can be traced to: Earnings, News, Sentiment, or Supply & Demand. Learning to identify which force is driving a move is a superpower.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "Identify the Force",
        situation: "Tesla's stock jumps 12% after Elon Musk tweets 'Something exciting coming next week'",
        question: "Which force is primarily driving this price move?",
        options: [
          { text: "Earnings — the company reported profits", correct: false },
          { text: "News/Sentiment — the tweet created excitement and anticipation", correct: true },
          { text: "Supply & Demand — more shares were issued", correct: false },
        ],
        explanation: "This is sentiment-driven. No actual earnings or fundamental change occurred — just anticipation from a tweet. This is why sentiment can be dangerous.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 4,
      data: {
        title: "Real-World Scenario",
        situation: "Company XYZ reports earnings of $2.50/share. Analysts expected $2.00/share. The stock drops 5%.",
        question: "How is this possible if earnings beat expectations?",
        options: [
          { text: "The market already priced in even higher earnings", correct: true },
          { text: "Good earnings always cause drops", correct: false },
          { text: "Analysts are always wrong", correct: false },
        ],
        explanation: "Markets are forward-looking. If traders expected $3.00 despite analysts saying $2.00, then $2.50 is actually a disappointment. This is called 'buy the rumor, sell the news.'",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 5,
      data: {
        points: [
          "Earnings are the strongest fundamental driver of stock prices",
          "Sentiment can push prices far beyond fundamental value",
          "News creates short-term volatility, fundamentals drive long-term",
          "Expectations matter more than absolute numbers",
        ],
      },
    },
  ],
  "1-4": [
    {
      type: "calculator",
      afterParagraph: 1,
      data: {
        title: "Compound Growth Calculator",
        description: "See how index fund investing grows over time with compound returns.",
        inputs: [
          { label: "Starting investment ($)", key: "principal", default: 10000 },
          { label: "Annual return (%)", key: "rate", default: 10 },
          { label: "Years", key: "years", default: 20 },
        ],
        formula: "principal * Math.pow(1 + rate/100, years)",
        resultLabel: "Future value",
        resultPrefix: "$",
      },
    },
    {
      type: "fact",
      afterParagraph: 2,
      data: {
        icon: "trophy",
        text: "Warren Buffett bet $1 million that an S&P 500 index fund would beat a collection of hedge funds over 10 years. He won. The index returned 125.8% vs the hedge funds' 36%.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "The Diversification Effect",
        situation: "You put all $10,000 into one company. That company's product fails and the stock drops 80%. Your portfolio is now worth $2,000.",
        question: "What if you'd invested in an index fund of 500 companies instead?",
        options: [
          { text: "You'd still lose 80% — indexes crash too", correct: false },
          { text: "One company failing barely moves a 500-company index — maybe 0.1% impact", correct: true },
          { text: "Index funds can't lose money", correct: false },
        ],
        explanation: "If one of 500 companies drops 80%, and it's 0.5% of the index, the total impact is just 0.4%. That's the power of diversification.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Index funds give instant diversification across hundreds of companies",
          "Most professionals can't beat the index long-term",
          "Compound returns make even modest growth powerful over decades",
          "Warren Buffett recommends index funds for most people",
        ],
      },
    },
  ],
  "1-5": [
    {
      type: "chart_example",
      afterParagraph: 0,
      data: {
        title: "Reading a Real Chart",
        assetId: "SPY",
        annotation: "This is the S&P 500 (SPY). Notice the sharp drop in early 2020 (COVID crash) and the recovery. The overall trend over 7 years is upward despite short-term drops.",
      },
    },
    {
      type: "callout",
      afterParagraph: 2,
      data: {
        icon: "flame",
        title: "Candlestick Basics",
        text: "Green candle = price went UP (closed higher than it opened). Red candle = price went DOWN. The thin lines (wicks) show the highest and lowest prices during that period.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Line charts show the big picture trend",
          "Candlesticks reveal more detail about each time period",
          "Volume confirms the strength of price moves",
          "Charts show the past — don't use them to predict the future",
        ],
      },
    },
  ],
  "2-1": [
    {
      type: "matching",
      afterParagraph: 2,
      data: {
        title: "Match the Account Type",
        pairs: [
          { term: "Taxable Brokerage", definition: "Basic account, pay taxes on profits" },
          { term: "Traditional IRA", definition: "Tax-deferred retirement account" },
          { term: "Roth IRA", definition: "Tax-free growth, funded with after-tax money" },
          { term: "401(k)", definition: "Employer-sponsored retirement account" },
        ],
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Choose Your Broker",
        situation: "You're a beginner with $500 to start investing. You plan to buy index funds and hold them long-term.",
        question: "What should you prioritize in a brokerage?",
        options: [
          { text: "Zero commissions and no account minimum — keep costs low", correct: true },
          { text: "Advanced charting tools and options trading", correct: false },
          { text: "The one with the flashiest app design", correct: false },
        ],
        explanation: "As a beginner with a small account, minimizing costs is key. Advanced tools don't help if you're just buying and holding index funds.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "A brokerage connects you to the stock market",
          "Most major brokerages now offer commission-free trading",
          "Choose based on fees, simplicity, and the assets you need",
          "Your brokerage holds and tracks your investments",
        ],
      },
    },
  ],
  "2-2": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "shopping-cart",
        title: "Shopping Analogy",
        text: "Market order = 'I'll buy it now at whatever price.' Limit order = 'I'll only buy it if it's on sale at this price or lower.' Both have their place!",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "Which Order Type?",
        situation: "You want to buy Apple stock. It's currently at $185. You think $180 would be a great price but you're patient.",
        question: "What order should you place?",
        options: [
          { text: "Market order at $185 — get it now", correct: false },
          { text: "Limit order at $180 — wait for your price", correct: true },
          { text: "It doesn't matter — order types are the same", correct: false },
        ],
        explanation: "A limit order at $180 means you only buy if the price drops to $180. You might miss out if it never drops, but you save $5/share if it does.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Market orders execute instantly at current price",
          "Limit orders only execute at your specified price or better",
          "Use market orders for liquid stocks; limit orders for precision",
          "Large orders on low-volume stocks should always use limits",
        ],
      },
    },
  ],
  "2-3": [
    {
      type: "calculator",
      afterParagraph: 2,
      data: {
        title: "Calculate Your Long Position Return",
        description: "Enter your buy and sell details to see your return.",
        inputs: [
          { label: "Buy price ($)", key: "buyPrice", default: 150 },
          { label: "Sell price ($)", key: "sellPrice", default: 180 },
          { label: "Number of shares", key: "shares", default: 10 },
        ],
        formula: "(sellPrice - buyPrice) * shares",
        resultLabel: "Your profit",
        resultPrefix: "$",
      },
    },
    {
      type: "fact",
      afterParagraph: 3,
      data: {
        icon: "calendar",
        text: "If you invested $10,000 in the S&P 500 in 2000 and held through two crashes (2001 and 2008), by 2024 you'd have over $60,000. Patience wins.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Going long = buying and holding, expecting price to rise",
          "Most investors are long investors — it's the natural approach",
          "Markets go up ~75% of years historically",
          "Time in the market beats timing the market",
        ],
      },
    },
  ],
  "2-4": [
    {
      type: "calculator",
      afterParagraph: 1,
      data: {
        title: "Fee Impact Calculator",
        description: "See how trading fees eat into your returns over time.",
        inputs: [
          { label: "Fee per trade ($)", key: "fee", default: 5 },
          { label: "Trades per year", key: "trades", default: 100 },
          { label: "Years", key: "years", default: 10 },
        ],
        formula: "fee * trades * years",
        resultLabel: "Total fees paid",
        resultPrefix: "$",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "The Hidden Cost",
        situation: "Fund A charges 0.03% per year. Fund B charges 0.80% per year. Both track the same index. You invest $50,000 for 30 years.",
        question: "What's the approximate difference in fees?",
        options: [
          { text: "A few hundred dollars", correct: false },
          { text: "About $5,000", correct: false },
          { text: "Over $40,000 in fees and lost compounding", correct: true },
        ],
        explanation: "At 0.03% on $50K over 30 years: ~$500 total. At 0.80%: ~$42,000. That's $41,500 lost to fees — money that could have been compounding!",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Even small fees compound into massive amounts over time",
          "Always check expense ratios before buying funds",
          "Commission-free trading saved investors billions",
          "The cheapest investment often outperforms the expensive one",
        ],
      },
    },
  ],
  // ————— Chapter 3: Understanding Risk —————
  "3-1": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "alert-triangle",
        title: "Risk ≠ Danger",
        text: "In investing, risk doesn't mean you'll lose money. It means the outcome is uncertain. Higher risk = wider range of possible outcomes, both good AND bad.",
      },
    },
    {
      type: "calculator",
      afterParagraph: 2,
      data: {
        title: "Risk vs. Reward Calculator",
        description: "Compare what you could gain vs. what you could lose on a risky investment.",
        inputs: [
          { label: "Investment ($)", key: "investment", default: 1000 },
          { label: "Best case return (%)", key: "bestCase", default: 40 },
          { label: "Worst case loss (%)", key: "worstCase", default: 25 },
        ],
        formula: "(investment * bestCase / 100) - (investment * worstCase / 100)",
        resultLabel: "Risk/Reward spread",
        resultPrefix: "$",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Risk Assessment",
        situation: "Investment A returns 5% guaranteed. Investment B has a 50% chance of returning 15% and a 50% chance of losing 5%.",
        question: "Which has a higher expected return?",
        options: [
          { text: "Investment A (5% guaranteed)", correct: false },
          { text: "Investment B (expected: 0.5×15% + 0.5×(-5%) = 5%, same but riskier)", correct: true },
          { text: "They're identical in every way", correct: false },
        ],
        explanation: "Both have a 5% expected return, but B is riskier because outcomes vary. Risk is about variance, not just averages. You'd need a higher expected return from B to justify the uncertainty.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 5,
      data: {
        points: [
          "Risk = uncertainty of outcome, not guaranteed loss",
          "Higher risk should come with higher expected reward",
          "Your personal risk tolerance depends on time horizon and goals",
          "Understanding risk is the foundation of smart investing",
        ],
      },
    },
  ],
  "3-2": [
    {
      type: "fact",
      afterParagraph: 0,
      data: {
        icon: "trending-down",
        text: "The S&P 500's average daily move is about 0.75%. But during the 2020 COVID crash, it moved 10%+ in a single day. That's volatility — the magnitude of price swings.",
      },
    },
    {
      type: "slider_challenge",
      afterParagraph: 2,
      data: {
        title: "Guess the Volatility",
        description: "Bitcoin's annualized volatility is roughly how many percent? (Hint: S&P 500 is about 15%)",
        min: 10,
        max: 120,
        step: 5,
        correctValue: 70,
        tolerance: 15,
        unit: "",
      },
    },
    {
      type: "matching",
      afterParagraph: 3,
      data: {
        title: "Match Volatility Levels",
        pairs: [
          { term: "Treasury Bills", definition: "Very low volatility (~1%)" },
          { term: "S&P 500 Index", definition: "Moderate volatility (~15%)" },
          { term: "Individual Tech Stock", definition: "High volatility (~35%)" },
          { term: "Bitcoin", definition: "Very high volatility (~70%)" },
        ],
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Volatility measures how much prices swing up and down",
          "Higher volatility = bigger potential gains AND losses",
          "Volatility is not the same as risk — it's one component of risk",
          "Long-term investors can tolerate more volatility than short-term",
        ],
      },
    },
  ],
  "3-3": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "egg",
        title: "The Egg Basket Rule",
        text: "Don't put all your eggs in one basket. If you own 20 stocks across different industries, one company failing only hurts 5% of your portfolio instead of 100%.",
      },
    },
    {
      type: "calculator",
      afterParagraph: 2,
      data: {
        title: "Diversification Impact Calculator",
        description: "See how diversification reduces the impact of a single stock crash.",
        inputs: [
          { label: "Portfolio value ($)", key: "portfolio", default: 10000 },
          { label: "Number of equal positions", key: "positions", default: 10 },
          { label: "One stock drops (%)", key: "drop", default: 80 },
        ],
        formula: "portfolio * (drop / 100) / positions",
        resultLabel: "Portfolio loss",
        resultPrefix: "$",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Diversification Dilemma",
        situation: "You have $10,000. Portfolio A: 100% in Apple. Portfolio B: 20% each in Apple, Google, Amazon, Microsoft, and a bond fund.",
        question: "If Apple drops 30%, how much does each portfolio lose?",
        options: [
          { text: "A loses $3,000, B loses $600", correct: true },
          { text: "Both lose the same amount", correct: false },
          { text: "A loses $3,000, B loses $3,000 too because they're correlated", correct: false },
        ],
        explanation: "Portfolio A: $10,000 × 30% = $3,000 loss. Portfolio B: $2,000 (Apple portion) × 30% = $600 loss. That's the power of diversification!",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 5,
      data: {
        points: [
          "Diversification reduces risk without necessarily reducing returns",
          "Spread across asset classes, sectors, AND geographies",
          "Over-diversification can dilute returns — 20-30 stocks is a sweet spot",
          "Index funds give instant diversification",
        ],
      },
    },
  ],
  "3-4": [
    {
      type: "matching",
      afterParagraph: 1,
      data: {
        title: "Match Asset to Risk Level",
        pairs: [
          { term: "Government Bonds", definition: "Low risk, low return (2-4%)" },
          { term: "Blue Chip Stocks", definition: "Moderate risk, moderate return (8-12%)" },
          { term: "Small Cap Stocks", definition: "High risk, higher return potential (10-15%)" },
          { term: "Cryptocurrency", definition: "Very high risk, speculative return" },
        ],
      },
    },
    {
      type: "chart_example",
      afterParagraph: 2,
      data: {
        title: "Safe vs. Risky: Compare the Ride",
        assetId: "BTC",
        annotation: "Notice how Bitcoin swings wildly compared to traditional assets. A 50% drop followed by a 200% gain is common. Could you stomach this? Your answer determines your risk tolerance.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Asset Allocation Decision",
        situation: "You're 25 years old with a stable job, no debt, and a 30-year investment horizon. You have $5,000 to invest.",
        question: "What allocation makes the most sense?",
        options: [
          { text: "100% bonds — safety first", correct: false },
          { text: "80% stocks, 20% bonds — aggressive but smart for your age", correct: true },
          { text: "100% crypto — maximize potential gains", correct: false },
        ],
        explanation: "At 25 with 30 years ahead, you can afford higher volatility. 80/20 stocks-to-bonds captures growth while having a buffer. 100% crypto is gambling, not investing.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Safe assets: bonds, treasuries, money market — low return, low volatility",
          "Risky assets: stocks, crypto, commodities — higher return potential",
          "Your mix should match your age, goals, and risk tolerance",
          "As you age, gradually shift from risky to safe assets",
        ],
      },
    },
  ],
  "3-5": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "scan",
        title: "Know Yourself First",
        text: "Before picking investments, ask: How would I react if my portfolio dropped 30% tomorrow? If the answer is 'panic sell,' you need less risk.",
      },
    },
    {
      type: "slider_challenge",
      afterParagraph: 2,
      data: {
        title: "Your Risk Score",
        description: "On a scale of 1-10, rate your comfort with seeing your portfolio drop 20% in a month (1 = terrified, 10 = unfazed):",
        min: 1,
        max: 10,
        step: 1,
        correctValue: 7,
        tolerance: 3,
        unit: "",
      },
    },
    {
      type: "calculator",
      afterParagraph: 3,
      data: {
        title: "Age-Based Allocation Rule",
        description: "A classic rule: hold your age in bonds, the rest in stocks. Enter your age to see.",
        inputs: [
          { label: "Your age", key: "age", default: 25 },
        ],
        formula: "100 - age",
        resultLabel: "Suggested stock %",
        resultSuffix: "% stocks",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Risk tolerance is personal — there's no one-size-fits-all",
          "Time horizon is the #1 factor: longer = more risk capacity",
          "Test yourself with small amounts before going big",
          "Revisit your risk tolerance annually as life changes",
        ],
      },
    },
  ],

  // ————— Chapter 4: Reading the Market —————
  "4-1": [
    {
      type: "fact",
      afterParagraph: 0,
      data: {
        icon: "trending-up",
        text: "The longest bull market in U.S. history lasted from March 2009 to February 2020 — nearly 11 years. The S&P 500 gained over 400% during that period.",
      },
    },
    {
      type: "matching",
      afterParagraph: 2,
      data: {
        title: "Bull vs. Bear Terminology",
        pairs: [
          { term: "Bull Market", definition: "Prices rising 20%+ from recent low" },
          { term: "Bear Market", definition: "Prices falling 20%+ from recent high" },
          { term: "Correction", definition: "A 10-20% decline from recent peak" },
          { term: "Rally", definition: "A sharp short-term price increase" },
        ],
      },
    },
    {
      type: "chart_example",
      afterParagraph: 3,
      data: {
        title: "Spot the Bull and Bear",
        assetId: "SPY",
        annotation: "Look at the chart: the long uptrend from 2020-2021 is a bull market. The dips in early 2020 and 2022 are bear markets/corrections. Markets always cycle between the two.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Bull markets last longer than bear markets on average",
          "Bear markets are scary but create the best buying opportunities",
          "Nobody can consistently predict when markets will turn",
          "Stay invested through both — time heals market wounds",
        ],
      },
    },
  ],
  "4-2": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "refresh-cw",
        title: "Markets Are Cyclical",
        text: "Markets follow a repeating pattern: Expansion → Peak → Contraction → Trough → Expansion. Understanding where we are in the cycle helps you make better decisions.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "Cycle Identification",
        situation: "Unemployment is rising, companies are cutting earnings forecasts, and the Fed is cutting interest rates aggressively.",
        question: "Where are we in the market cycle?",
        options: [
          { text: "Expansion — things are growing", correct: false },
          { text: "Contraction/Recession — the economy is shrinking", correct: true },
          { text: "Peak — things can't get better", correct: false },
        ],
        explanation: "Rising unemployment + earnings cuts + emergency rate cuts = contraction. This is actually when smart investors start buying, because markets look ahead to recovery.",
      },
    },
    {
      type: "fact",
      afterParagraph: 3,
      data: {
        icon: "bar-chart",
        text: "Since 1945, the average recession has lasted 10 months, while the average expansion has lasted 64 months. The economy spends about 6× more time growing than shrinking.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Market cycles repeat but vary in length and intensity",
          "The stock market leads the economy by 6-9 months",
          "Recessions are normal — they happen every 5-10 years",
          "The best time to invest is often when it feels the scariest",
        ],
      },
    },
  ],
  "4-3": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "alert-circle",
        title: "The Fear & Greed Spectrum",
        text: "When CNN's Fear & Greed Index hits 'Extreme Fear,' markets have historically been near a bottom. 'Extreme Greed' often signals a top. Be fearful when others are greedy.",
      },
    },
    {
      type: "slider_challenge",
      afterParagraph: 2,
      data: {
        title: "Sentiment Gauge",
        description: "If 80% of investors are bullish, what does contrarian theory suggest? Rate the market risk (1=low, 10=high):",
        min: 1,
        max: 10,
        step: 1,
        correctValue: 8,
        tolerance: 1,
        unit: "",
      },
    },
    {
      type: "scenario",
      afterParagraph: 3,
      data: {
        title: "Reading the Crowd",
        situation: "Your Uber driver, barber, and grandma are all talking about buying crypto. Prices have gone up 500% in 6 months. Social media is full of 'to the moon' posts.",
        question: "What does this level of mainstream excitement usually signal?",
        options: [
          { text: "It's still early — buy more!", correct: false },
          { text: "We're likely near a top — extreme sentiment = danger", correct: true },
          { text: "Sentiment doesn't matter — just look at the charts", correct: false },
        ],
        explanation: "When everyone is bullish and prices have already surged, there are few buyers left. This is the classic 'shoe-shine boy' indicator — when everyone is in, there's no one left to push prices higher.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Market sentiment swings between fear and greed",
          "Extreme sentiment often signals a reversal is coming",
          "Contrarian investing = doing the opposite of the crowd",
          "Sentiment indicators: VIX, put/call ratios, surveys",
        ],
      },
    },
  ],
  "4-4": [
    {
      type: "calculator",
      afterParagraph: 1,
      data: {
        title: "Earnings Per Share Calculator",
        description: "Calculate a company's EPS from its financials.",
        inputs: [
          { label: "Net income ($M)", key: "netIncome", default: 500 },
          { label: "Shares outstanding (M)", key: "shares", default: 100 },
        ],
        formula: "netIncome / shares",
        resultLabel: "EPS",
        resultPrefix: "$",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "Earnings Surprise",
        situation: "Company ABC reports EPS of $3.50. Analysts expected $3.20. The stock jumps 8% after hours.",
        question: "Why did the stock jump?",
        options: [
          { text: "Because $3.50 is a lot of money", correct: false },
          { text: "Because it BEAT expectations — the surprise matters more than the number", correct: true },
          { text: "Because stocks always go up after earnings", correct: false },
        ],
        explanation: "Markets price in expectations before earnings. When actual results exceed expectations, it's a positive surprise. The 'beat' of $0.30 above estimates drove the jump.",
      },
    },
    {
      type: "matching",
      afterParagraph: 3,
      data: {
        title: "Earnings Report Components",
        pairs: [
          { term: "Revenue", definition: "Total money earned from sales" },
          { term: "Net Income", definition: "Profit after all expenses and taxes" },
          { term: "EPS", definition: "Earnings divided by shares outstanding" },
          { term: "Guidance", definition: "Company's forecast for future quarters" },
        ],
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Earnings reports come out quarterly — they move stocks dramatically",
          "EPS beats/misses vs expectations drive the stock reaction",
          "Forward guidance often matters more than current results",
          "Learn to read the basics: revenue, net income, EPS, guidance",
        ],
      },
    },
  ],
  "4-5": [
    {
      type: "calculator",
      afterParagraph: 1,
      data: {
        title: "P/E Ratio Calculator",
        description: "Calculate how 'expensive' a stock is relative to its earnings.",
        inputs: [
          { label: "Stock price ($)", key: "price", default: 150 },
          { label: "Earnings per share ($)", key: "eps", default: 6 },
        ],
        formula: "price / eps",
        resultLabel: "P/E Ratio",
        resultPrefix: "",
        resultSuffix: "x",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "Expensive or Cheap?",
        situation: "Stock A has a P/E of 10. Stock B has a P/E of 50. Both are in the same industry.",
        question: "Which statement is most accurate?",
        options: [
          { text: "Stock A is always the better buy — lower P/E = better value", correct: false },
          { text: "Stock B might justify its P/E if it's growing much faster", correct: true },
          { text: "P/E doesn't matter for investing decisions", correct: false },
        ],
        explanation: "A high P/E might mean the stock is overvalued OR that investors expect rapid growth. Amazon traded at 100+ P/E for years because of massive growth. Always compare P/E within industries and consider growth rates.",
      },
    },
    {
      type: "fact",
      afterParagraph: 3,
      data: {
        icon: "line-chart",
        text: "The S&P 500's average historical P/E is about 16x. During the dot-com bubble, it hit 44x. During the 2009 crash, it dropped to 10x. The P/E ratio tells you whether the market is historically expensive or cheap.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "P/E = Price ÷ Earnings per Share — measures how 'expensive' a stock is",
          "Low P/E can mean undervalued OR declining company",
          "High P/E can mean overvalued OR high-growth company",
          "Always compare P/E within the same industry",
        ],
      },
    },
  ],

  // ————— Chapter 5: Your Brain Is the Enemy —————
  "5-1": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "brain",
        title: "The Pain-Gain Asymmetry",
        text: "Psychologist Daniel Kahneman proved that losses feel 2.25x more painful than equivalent gains feel good. This is hardwired — and it sabotages your investing.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 1,
      data: {
        title: "Loss Aversion in Action",
        situation: "You bought a stock at $100. It drops to $70. You believe the company's fundamentals are broken and it will keep falling.",
        question: "What do most people do vs. what they should do?",
        options: [
          { text: "Hold and hope — 'it'll come back' (what most do, often wrong)", correct: false },
          { text: "Sell and redeploy the money — cut your losses (the rational choice)", correct: true },
          { text: "Buy more to average down", correct: false },
        ],
        explanation: "Loss aversion makes us hold losers hoping to 'break even.' But if fundamentals are broken, holding is just losing more slowly. Selling and reinvesting in a better opportunity is the rational move.",
      },
    },
    {
      type: "slider_challenge",
      afterParagraph: 2,
      data: {
        title: "How Much Does Losing Hurt?",
        description: "Research shows losses feel X times more painful than equivalent gains feel good. What's the multiplier?",
        min: 1,
        max: 5,
        step: 0.25,
        correctValue: 2.25,
        tolerance: 0.5,
        unit: "",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 3,
      data: {
        points: [
          "Loss aversion is biological — you can't eliminate it, only manage it",
          "Set stop-losses before you buy to remove emotion from selling",
          "Don't check your portfolio daily — it amplifies loss aversion",
          "Ask: 'Would I buy this stock today at this price?' If no, sell it.",
        ],
      },
    },
  ],
  "5-2": [
    {
      type: "chart_example",
      afterParagraph: 0,
      data: {
        title: "The COVID Crash and Recovery",
        assetId: "SPY",
        annotation: "The S&P 500 dropped 34% in March 2020. Investors who panic sold locked in huge losses. Those who held recovered within 5 months and went on to new all-time highs.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 1,
      data: {
        title: "Panic Selling Decision",
        situation: "It's March 2020. Markets dropped 30% in 3 weeks. Headlines say 'WORST CRASH SINCE 2008.' Your $50,000 portfolio is now worth $35,000. Your palms are sweating.",
        question: "What should you do?",
        options: [
          { text: "Sell everything — protect what's left", correct: false },
          { text: "Do nothing — stick to your plan and ride it out", correct: true },
          { text: "Move everything to gold", correct: false },
        ],
        explanation: "Every major crash in history has been followed by a recovery. The S&P 500 recovered its COVID losses by August 2020 — just 5 months later. Panic sellers missed the fastest recovery in market history.",
      },
    },
    {
      type: "fact",
      afterParagraph: 2,
      data: {
        icon: "bar-chart",
        text: "If you missed just the 10 best days in the market over 20 years (2003-2023), your returns would drop from 9.8% annually to just 5.6%. Most of those best days happened right after the worst days.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 3,
      data: {
        points: [
          "Panic selling = locking in losses permanently",
          "The best days often come immediately after the worst days",
          "Have a written investment plan — follow it during crashes",
          "Turn off financial news during crashes if it makes you emotional",
        ],
      },
    },
  ],
  "5-3": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "rocket",
        title: "The FOMO Trap",
        text: "By the time something is trending on social media, early investors have already made their money. You're not early — you're the exit liquidity.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 1,
      data: {
        title: "The FOMO Test",
        situation: "A meme coin has gone up 1,000% in a week. Your friends made huge gains and are posting screenshots. You feel like you're missing out.",
        question: "What's the smartest response?",
        options: [
          { text: "Buy in now — it could go up another 1,000%", correct: false },
          { text: "FOMO is a signal to be cautious — parabolic rises usually crash", correct: true },
          { text: "Buy just a little to feel included", correct: false },
        ],
        explanation: "Assets that rise 1,000% in a week almost always crash. The pattern: early insiders buy → hype builds → mainstream buys at the top → insiders sell → crash. Don't be the last buyer.",
      },
    },
    {
      type: "matching",
      afterParagraph: 2,
      data: {
        title: "FOMO Red Flags",
        pairs: [
          { term: "Everyone's talking about it", definition: "You're probably late to the trade" },
          { term: "Guaranteed returns promised", definition: "Classic scam indicator" },
          { term: "Price up 500%+ recently", definition: "Most upside is already captured" },
          { term: "Celebrity endorsement", definition: "They're paid to promote, not invest" },
        ],
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 3,
      data: {
        points: [
          "FOMO leads to buying at the top and selling at the bottom",
          "If everyone is talking about it, you're probably too late",
          "Have a pre-set investment plan so emotions don't drive decisions",
          "Missing an opportunity costs nothing — losing money costs everything",
        ],
      },
    },
  ],
  "5-4": [
    {
      type: "callout",
      afterParagraph: 0,
      data: {
        icon: "search",
        title: "The Echo Chamber Effect",
        text: "If you only follow people who agree with your stock picks, you'll never see the bear case until it's too late. Seek out critics, not cheerleaders.",
      },
    },
    {
      type: "scenario",
      afterParagraph: 1,
      data: {
        title: "Confirmation Bias Test",
        situation: "You own Tesla stock and love the company. You see three articles: 'Tesla will dominate EVs,' 'Tesla's valuation is insane,' and 'Tesla earnings beat estimates.'",
        question: "Which article will most people with confirmation bias read?",
        options: [
          { text: "The bearish one — 'Tesla's valuation is insane'", correct: false },
          { text: "The two bullish ones — they confirm what you already believe", correct: true },
          { text: "All three equally", correct: false },
        ],
        explanation: "Confirmation bias makes us gravitate toward information that supports our existing beliefs. The cure: deliberately read the bear case for every stock you own.",
      },
    },
    {
      type: "fact",
      afterParagraph: 2,
      data: {
        icon: "flask",
        text: "Studies show investors spend 36% more time reading analysis that agrees with their position than analysis that challenges it. This blind spot costs the average investor 2-3% in annual returns.",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 3,
      data: {
        points: [
          "Confirmation bias = seeking info that confirms your beliefs",
          "Always read the bear case before buying any stock",
          "Follow at least one analyst who disagrees with your thesis",
          "Ask yourself: 'What would make me wrong?'",
        ],
      },
    },
  ],
  "5-5": [
    {
      type: "calculator",
      afterParagraph: 1,
      data: {
        title: "True Cost of Overtrading",
        description: "Calculate how much frequent trading actually costs you.",
        inputs: [
          { label: "Spread cost per trade ($)", key: "spread", default: 0.5 },
          { label: "Trades per month", key: "monthly", default: 30 },
          { label: "Portfolio value ($)", key: "portfolio", default: 10000 },
        ],
        formula: "(spread * monthly * 12) / portfolio * 100",
        resultLabel: "Annual cost",
        resultSuffix: "% of portfolio",
      },
    },
    {
      type: "scenario",
      afterParagraph: 2,
      data: {
        title: "The Trading Trap",
        situation: "Trader A makes 200 trades per year with a 52% win rate. Trader B makes 10 trades per year with a 60% win rate. Each trade costs $1 in spread.",
        question: "Who likely makes more money?",
        options: [
          { text: "Trader A — more trades = more opportunities", correct: false },
          { text: "Trader B — fewer, higher-quality trades with lower costs", correct: true },
          { text: "They make the same — win rate is what matters", correct: false },
        ],
        explanation: "Trader A pays $200/year in spreads and wins only slightly more than half. Trader B pays $10/year and has a much stronger edge. Quality over quantity.",
      },
    },
    {
      type: "fact",
      afterParagraph: 3,
      data: {
        icon: "trending-down",
        text: "A UC Davis study of 66,465 households found that the most active traders earned 6.5% less per year than the least active. The study's title? 'Trading Is Hazardous to Your Wealth.'",
      },
    },
    {
      type: "key_takeaway",
      afterParagraph: 4,
      data: {
        points: [
          "Overtrading is one of the biggest wealth destroyers for retail investors",
          "Every trade has hidden costs: spread, slippage, taxes, opportunity cost",
          "Set a maximum trade frequency and stick to it",
          "The best investors often do the least trading",
        ],
      },
    },
  ],
};

// Default interactives for lessons without specific ones
export function getInteractivesForLesson(lessonId: string): InteractiveBlock[] {
  return lessonInteractives[lessonId] || [];
}

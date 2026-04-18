export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  weight: number;
  difficulty: string;
}

export interface Lesson {
  id: string;
  chapterId: number;
  chapterName: string;
  lessonNumber: number;
  title: string;
  content: string;
  assetToUnlock: string[];
  baseReward: number;
  quiz: QuizQuestion[];
}

export interface Chapter {
  id: number;
  name: string;
  color: string;
  icon: string;
  baseReward: number;
  totalReward: number;
  lessons: Lesson[];
}

const weights = [1, 1, 1.5, 1.5, 2, 3];
const difficulties = ["1 pt", "1 pt", "1.5 pts", "1.5 pts", "2 pts", "3 pts"];

function makeQuiz(lessonId: string, questions: Omit<QuizQuestion, 'id' | 'weight' | 'difficulty'>[]): QuizQuestion[] {
  return questions.map((q, i) => ({
    ...q,
    id: `${lessonId}-q${i + 1}`,
    weight: weights[i],
    difficulty: difficulties[i],
  }));
}

// Full content for Ch1-3, concise for Ch4-10
const chaptersData: Chapter[] = [
  {
    id: 1,
    name: "What Is the Stock Market?",
    color: "hsl(160, 84%, 44%)",
    icon: "trending-up",
    baseReward: 100,
    totalReward: 500,
    lessons: [
      {
        id: "1-1",
        chapterId: 1,
        chapterName: "What Is the Stock Market?",
        lessonNumber: 1,
        title: "What Is a Stock?",
        content: `When you buy a stock, you're buying a tiny piece of a real company. Imagine Apple — worth over $3 trillion. If you buy one share of Apple, you literally own a fraction of the company that makes iPhones, MacBooks, and AirPods.\n\nCompanies sell stocks to raise money. Instead of borrowing from a bank, they offer shares to the public. This is called an Initial Public Offering (IPO). In return, you get ownership — and if the company grows, your share becomes more valuable.\n\n**Key concept:** A stock represents ownership. When the company does well, your stock price tends to go up. When it struggles, the price tends to go down.\n\nThink of it like buying a slice of a pizza restaurant. If the restaurant starts selling more pizza, your slice becomes more valuable. If it loses customers, your slice loses value.\n\nThe stock market is where millions of people buy and sell these ownership slices every day. The price of a stock changes constantly based on how many people want to buy it versus how many want to sell it.\n\n**Why does this matter?** Because understanding stocks is the foundation of investing. Every ETF, every mutual fund, every portfolio is built on this one idea: owning a piece of something that grows.`,
        assetToUnlock: ["SPY"],
        baseReward: 100,
        quiz: makeQuiz("1-1", [
          { question: "What does owning a stock mean?", options: ["You loaned money to a company", "You own a small piece of the company", "You work for the company", "You owe money to the company"], correctIndex: 1 },
          { question: "Why do companies sell stocks?", options: ["To pay taxes", "To raise money from the public", "Because the government requires it", "To lower their stock price"], correctIndex: 1 },
          { question: "If Apple's stock price goes up, what happened?", options: ["Apple borrowed more money", "More people want to sell than buy", "More people want to buy than sell", "The CEO got fired"], correctIndex: 2 },
          { question: "What is an IPO?", options: ["A type of stock chart", "When a company first sells its stock to the public", "A government regulation", "A way to short sell stocks"], correctIndex: 1 },
          { question: "Why might owning stocks be risky?", options: ["Stocks always go up", "Companies can lose value, making your shares worth less", "You have to work for the company", "Stocks are guaranteed by the government"], correctIndex: 1 },
          { question: "You buy a stock at $50. The company reports terrible earnings and the stock drops to $30. What is the smartest way to think about this?", options: ["Sell immediately — it's going to zero", "Buy more because it's cheaper now", "Evaluate why it dropped and whether the long-term value has changed", "Ignore it completely"], correctIndex: 2 },
        ]),
      },
      {
        id: "1-2", chapterId: 1, chapterName: "What Is the Stock Market?", lessonNumber: 2,
        title: "How a Stock Exchange Works",
        content: `A stock exchange is like a massive digital auction house. Buyers say "I'll pay $150 for this stock" and sellers say "I'll sell for $151." When they agree, a trade happens.\n\nThe difference between what buyers are willing to pay (the bid) and what sellers want (the ask) is called the spread. On popular stocks like Apple, this spread is just a few cents. On tiny companies, it could be much wider.\n\nMajor exchanges include the NYSE (New York Stock Exchange) and NASDAQ. The NYSE is over 230 years old and trades on a physical floor. NASDAQ is fully electronic.\n\n**How a trade happens:** You click "buy" in your brokerage app. Your order goes to the exchange. A market maker matches your buy order with someone else's sell order. The trade settles, and the stock is now yours. All of this happens in milliseconds.\n\nMillions of trades happen every single day. The constant buying and selling is what creates the price you see on a stock chart. It's not a fixed number — it's a living, breathing reflection of what everyone in the world thinks that company is worth right now.`,
        assetToUnlock: [],
        baseReward: 100,
        quiz: makeQuiz("1-2", [
          { question: "What is a stock exchange?", options: ["A bank", "A marketplace where stocks are bought and sold", "A company that issues stocks", "A government regulator"], correctIndex: 1 },
          { question: "What is the 'spread' in stock trading?", options: ["The profit from a trade", "The difference between buy and sell price", "The commission a broker charges", "The total volume of trades"], correctIndex: 1 },
          { question: "How quickly do modern stock trades execute?", options: ["Several hours", "About one day", "Milliseconds", "One week"], correctIndex: 2 },
          { question: "What is NASDAQ known for?", options: ["Being the oldest exchange", "Having a physical trading floor", "Being fully electronic", "Only trading bonds"], correctIndex: 2 },
          { question: "Why does a stock's price constantly change?", options: ["The government adjusts it daily", "Supply and demand from millions of buyers and sellers", "The company sets a new price each morning", "Stock prices only change once a week"], correctIndex: 1 },
          { question: "A stock has a bid of $100 and an ask of $100.50. You place a market buy order. What price will you likely pay?", options: ["$100", "$100.25", "Around $100.50 or the current ask", "Whatever price you choose"], correctIndex: 2 },
        ]),
      },
      {
        id: "1-3", chapterId: 1, chapterName: "What Is the Stock Market?", lessonNumber: 3,
        title: "What Moves Stock Prices?",
        content: `Stock prices move based on four main forces: earnings, news, sentiment, and supply and demand.\n\n**Earnings:** When a company makes more money than expected, its stock usually goes up. When it misses expectations, the stock often drops. Quarterly earnings reports are the single biggest mover of stock prices.\n\n**News:** A new product launch, a CEO resignation, a government regulation — any news can move a stock. Bad news can crater a stock in minutes. Good news can send it soaring.\n\n**Sentiment:** Sometimes stocks move not because of facts, but because of feelings. If investors are optimistic about the future, they buy. If they're scared, they sell. This is why markets sometimes feel irrational.\n\n**Supply and Demand:** At its core, a stock price is simply where buyers and sellers agree. If more people want to buy than sell, the price goes up. If more want to sell than buy, it goes down.\n\nUnderstanding these forces is crucial because it helps you separate signal from noise. Not every price movement means something fundamental changed.`,
        assetToUnlock: [],
        baseReward: 100,
        quiz: makeQuiz("1-3", [
          { question: "What are quarterly earnings reports?", options: ["Government tax documents", "Reports showing how much money a company made", "Stock exchange regulations", "Daily price summaries"], correctIndex: 1 },
          { question: "If more people want to buy a stock than sell it, what happens to the price?", options: ["It stays the same", "It goes down", "It goes up", "It gets delisted"], correctIndex: 2 },
          { question: "What role does sentiment play in stock prices?", options: ["None — prices are purely based on facts", "Investor emotions can push prices beyond fundamental value", "Sentiment only matters for crypto", "Sentiment sets the official price"], correctIndex: 1 },
          { question: "A tech company beats earnings expectations by 20%. What typically happens?", options: ["Stock goes down because the company is too profitable", "Stock goes up as investors become more optimistic", "Nothing — earnings don't affect prices", "The stock gets delisted"], correctIndex: 1 },
          { question: "Why might a stock drop even when the company reports good earnings?", options: ["The market expected even better results", "Good earnings always make stocks go up", "The exchange penalizes profitable companies", "Investors don't look at earnings"], correctIndex: 0 },
          { question: "Oil prices surge due to a geopolitical crisis. How might this affect airline stocks and why?", options: ["Airline stocks go up because more people fly during crises", "Airline stocks drop because fuel is their biggest cost", "No connection between oil and airlines", "Airline stocks are only affected by passenger numbers"], correctIndex: 1 },
        ]),
      },
      {
        id: "1-4", chapterId: 1, chapterName: "What Is the Stock Market?", lessonNumber: 4,
        title: "What Is an Index Fund?",
        content: `Instead of buying one stock, what if you could buy a tiny piece of the 500 biggest companies in America with a single purchase? That's an index fund.\n\nThe S&P 500 is an index — a list of the 500 largest U.S. companies. An index fund like SPY tracks this list. When you buy SPY, you own a small piece of Apple, Microsoft, Amazon, Google, and 496 other companies.\n\n**Why experts recommend index funds:** Over the past 50 years, the S&P 500 has returned about 10% per year on average. Most professional fund managers — people paid millions to pick stocks — fail to beat this over long periods. If the pros can't beat the index, buying the index is a smart default.\n\n**Diversification:** Owning 500 companies means if one company fails, you barely notice. Your risk is spread across the entire economy.\n\nWarren Buffett, one of the greatest investors ever, has said that most people should just buy an S&P 500 index fund. It's boring, it's simple, and it works.`,
        assetToUnlock: [],
        baseReward: 100,
        quiz: makeQuiz("1-4", [
          { question: "What is an index fund?", options: ["A single stock", "A fund that tracks a group of stocks", "A type of bond", "A savings account"], correctIndex: 1 },
          { question: "What does SPY track?", options: ["The NASDAQ", "The Dow Jones", "The S&P 500", "Bitcoin"], correctIndex: 2 },
          { question: "Why is diversification important?", options: ["It guarantees profits", "It spreads risk across many investments", "It's required by law", "It makes trading faster"], correctIndex: 1 },
          { question: "What has been the average annual return of the S&P 500 historically?", options: ["About 2%", "About 5%", "About 10%", "About 25%"], correctIndex: 2 },
          { question: "Why do most experts recommend index funds over picking individual stocks?", options: ["Index funds are more exciting", "Most professional stock pickers fail to beat the index long-term", "Individual stocks are illegal for beginners", "Index funds have no risk"], correctIndex: 1 },
          { question: "You have $10,000 to invest. You're 25 years old and won't need this money for 30 years. Which approach best aligns with historical evidence?", options: ["Put it all in one hot tech stock for maximum gain", "Keep it in cash because the market might crash", "Invest in a broad index fund and add to it regularly over 30 years", "Wait for a crash then invest everything at once"], correctIndex: 2 },
        ]),
      },
      {
        id: "1-5", chapterId: 1, chapterName: "What Is the Stock Market?", lessonNumber: 5,
        title: "How to Read a Stock Chart",
        content: `A stock chart shows you the price of a stock over time. The horizontal axis is time, the vertical axis is price. A line going up means the price increased. A line going down means it decreased.\n\n**Line charts** are the simplest — just a line connecting closing prices over time. Great for seeing the big picture.\n\n**Candlestick charts** show more detail. Each "candle" represents one period (a day, week, or month). A green candle means the price went up that day. A red candle means it went down. The body of the candle shows open and close prices, and the wicks show the high and low.\n\n**Volume bars** at the bottom show how many shares were traded. High volume means lots of interest. Low volume means fewer people are trading.\n\nFor now, focus on line charts. They tell you the story of a stock simply: did it go up, down, or sideways? Over what period? How dramatically?\n\nDon't try to predict the future from charts alone. Use them to understand the past.`,
        assetToUnlock: [],
        baseReward: 100,
        quiz: makeQuiz("1-5", [
          { question: "What does the vertical axis on a stock chart represent?", options: ["Time", "Volume", "Price", "Market cap"], correctIndex: 2 },
          { question: "What does a green candlestick mean?", options: ["The price went down", "The price went up", "No trading happened", "The market was closed"], correctIndex: 1 },
          { question: "What do volume bars show?", options: ["The profit of each trade", "How many shares were traded", "The company's revenue", "The stock's dividend"], correctIndex: 1 },
          { question: "Which chart type is best for beginners to understand overall price trend?", options: ["Candlestick", "Point and figure", "Line chart", "Renko chart"], correctIndex: 2 },
          { question: "A stock's chart shows a steady upward line over 5 years with occasional dips. What does this suggest?", options: ["The stock is too expensive", "Long-term upward trend with normal short-term volatility", "The stock will crash soon", "The chart is broken"], correctIndex: 1 },
          { question: "You see a stock chart where the price dropped 40% over two months, but volume was extremely low during the drop. What might this indicate?", options: ["A major crash driven by panic selling", "Few people were actually selling — the drop may not reflect broad market sentiment", "Volume doesn't matter for understanding price moves", "The stock exchange was closed"], correctIndex: 1 },
        ]),
      },
    ],
  },
  {
    id: 2,
    name: "How to Buy and Sell",
    color: "hsl(199, 89%, 48%)",
    icon: "dollar-sign",
    baseReward: 150,
    totalReward: 750,
    lessons: [
      {
        id: "2-1", chapterId: 2, chapterName: "How to Buy and Sell", lessonNumber: 6,
        title: "What Is a Brokerage?",
        content: `A brokerage is the company that connects you to the stock market. You can't walk up to the NYSE and buy stocks yourself — you need a broker.\n\nModern brokerages are apps on your phone. Robinhood, Fidelity, Charles Schwab, Interactive Brokers — they all do the same core thing: let you buy and sell stocks, ETFs, and other assets.\n\n**Types of accounts:** A taxable brokerage account is the most basic. You deposit money, buy stocks, and pay taxes on profits. Retirement accounts like IRAs have tax advantages but restrict when you can withdraw.\n\n**What to look for:** Low or zero commissions, a clean interface, good customer service, and the assets you want to trade. Most major brokerages now offer commission-free stock trading.\n\nThe brokerage holds your assets for you and keeps track of what you own. When you press "buy" in the app, the brokerage routes your order to the exchange, finds a seller, and executes the trade. Your portfolio updates instantly.`,
        assetToUnlock: ["AAPL", "MSFT"],
        baseReward: 150,
        quiz: makeQuiz("2-1", [
          { question: "What does a brokerage do?", options: ["Issues stocks for companies", "Connects you to the stock market to buy/sell", "Sets stock prices", "Guarantees your investments won't lose value"], correctIndex: 1 },
          { question: "Which is an example of a brokerage?", options: ["The Federal Reserve", "Goldman Sachs investment bank", "Robinhood", "The NYSE itself"], correctIndex: 2 },
          { question: "What is a taxable brokerage account?", options: ["An account only for bonds", "A basic account where you buy stocks and pay taxes on profits", "An account that avoids all taxes", "A government savings bond"], correctIndex: 1 },
          { question: "Most modern brokerages offer what for stock trades?", options: ["$50 per trade", "Zero commission", "Guaranteed returns", "Physical stock certificates"], correctIndex: 1 },
          { question: "What happens when you press 'buy' in your brokerage app?", options: ["Nothing until the next day", "Your order is routed to an exchange and matched with a seller", "The brokerage sells you their own shares", "You receive a physical certificate in the mail"], correctIndex: 1 },
          { question: "You're choosing between two brokerages. Broker A charges $5 per trade but has great research tools. Broker B is free but basic. You plan to make 200 trades per year. Which is the smarter financial choice and why?", options: ["Broker A — research tools are always worth it", "Broker B — $1,000/year in fees from Broker A will significantly eat into returns", "It doesn't matter — all brokerages are the same", "Neither — you should trade directly on the exchange"], correctIndex: 1 },
        ]),
      },
      {
        id: "2-2", chapterId: 2, chapterName: "How to Buy and Sell", lessonNumber: 7,
        title: "Market Orders vs Limit Orders",
        content: `When you buy a stock, you choose how you want to buy it. The two main order types are market orders and limit orders.\n\n**Market order:** "Buy this stock right now at whatever the current price is." It executes instantly but you might pay slightly more than expected if the price is moving fast.\n\n**Limit order:** "Buy this stock only if the price drops to $X or lower." You set your maximum price. The trade only happens if someone is willing to sell at your price. It might never execute if the price doesn't reach your limit.\n\nThink of it like shopping. A market order is grabbing the item off the shelf at whatever it costs. A limit order is saying "I'll buy it, but only if it goes on sale to this price."\n\nFor beginners trading popular stocks, market orders are fine. The price difference is usually pennies. For larger trades or less popular stocks, limit orders give you more control.\n\nThere are also stop orders, trailing stops, and more advanced types — but master these two first.`,
        assetToUnlock: [],
        baseReward: 150,
        quiz: makeQuiz("2-2", [
          { question: "What is a market order?", options: ["An order to buy at a specific price", "An order to buy immediately at the current price", "An order that expires at market close", "An order placed by a market maker"], correctIndex: 1 },
          { question: "What is a limit order?", options: ["An order with no price limit", "An order to buy only at your specified price or better", "The fastest type of order", "An order that's limited to 100 shares"], correctIndex: 1 },
          { question: "When is a market order most appropriate?", options: ["For large trades on illiquid stocks", "For popular stocks where the price is stable", "When you want to set a specific buy price", "Never — limit orders are always better"], correctIndex: 1 },
          { question: "What's a potential downside of limit orders?", options: ["They always cost more", "Your order might never execute if the price doesn't reach your limit", "They execute too quickly", "They're illegal for retail investors"], correctIndex: 1 },
          { question: "A stock is currently at $50. You place a limit buy at $48. What happens?", options: ["You buy immediately at $50", "Your order waits until the price drops to $48 or lower", "The exchange rejects your order", "You buy at $48 right away"], correctIndex: 1 },
          { question: "You want to buy 10,000 shares of a small company that only trades 5,000 shares per day. Should you use a market or limit order, and why?", options: ["Market order — speed is everything", "Limit order — a large market order on a low-volume stock could push the price up significantly against you", "Either is fine — order type doesn't matter for large trades", "You can't buy more than the daily volume"], correctIndex: 1 },
        ]),
      },
      {
        id: "2-3", chapterId: 2, chapterName: "How to Buy and Sell", lessonNumber: 8,
        title: "What Does Going Long Mean?",
        content: `Going "long" simply means buying a stock because you believe it will go up in value over time. This is the most natural way to invest — you buy, you hold, and you sell later at a higher price for a profit.\n\nMost investors are long investors. When someone says "I own Apple stock," they're long Apple. They bought shares and they're holding them, expecting the price to increase.\n\n**The math:** Buy 10 shares at $150 each = $1,500 invested. If the price rises to $180, your shares are worth $1,800. Your profit is $300, or a 20% return.\n\n**Why most people invest this way:** Markets tend to go up over long periods. The S&P 500 has gone up in about 75% of all calendar years. Time is on your side when you go long.\n\nThe opposite — going "short" — means betting a stock will go down. That's an advanced strategy with higher risk. For now, focus on going long: buying things you believe in and holding them.`,
        assetToUnlock: [],
        baseReward: 150,
        quiz: makeQuiz("2-3", [
          { question: "What does 'going long' mean?", options: ["Holding a stock for exactly one year", "Buying a stock expecting it to increase in value", "Borrowing shares to sell them", "Trading stocks all day long"], correctIndex: 1 },
          { question: "If you buy 10 shares at $100 and sell at $120, what's your profit?", options: ["$100", "$120", "$200", "$20"], correctIndex: 2 },
          { question: "Why is going long considered the default investing strategy?", options: ["Markets tend to go up over long periods", "It's the only legal strategy", "Short selling is always more profitable", "Going long eliminates all risk"], correctIndex: 0 },
          { question: "What percentage of calendar years has the S&P 500 historically gone up?", options: ["About 50%", "About 65%", "About 75%", "About 95%"], correctIndex: 2 },
          { question: "You bought a stock at $200 and it's now at $180. You still believe in the company's long-term prospects. What does a long investor typically do?", options: ["Sell immediately to cut losses", "Hold and wait for recovery since the thesis hasn't changed", "Buy options to hedge", "Sue the company"], correctIndex: 1 },
          { question: "Two investors both buy the same stock at $100. Investor A sells after it drops to $85 in month 1. Investor B holds for 3 years and sells at $160. What lesson does this illustrate?", options: ["Investor A was smarter for cutting losses quickly", "Short-term volatility doesn't determine long-term outcomes — patience matters", "Both strategies are equally valid", "Investor B just got lucky"], correctIndex: 1 },
        ]),
      },
      {
        id: "2-4", chapterId: 2, chapterName: "How to Buy and Sell", lessonNumber: 9,
        title: "Transaction Fees and Their Impact",
        content: `Every time you trade, there can be costs. Even "free" brokerages make money somehow — usually by selling your order flow to market makers. But some brokerages still charge per-trade commissions, especially for options or international stocks.\n\n**Why fees matter:** If you pay $5 per trade and make 200 trades a year, that's $1,000. On a $10,000 portfolio, that's 10% lost to fees alone. Over 20 years with compounding, the impact is enormous.\n\n**Types of fees:** Trading commissions (per trade), expense ratios (annual fee on funds, typically 0.03% to 1%+), account fees (some brokerages charge monthly), and spreads (the hidden cost of the bid-ask gap).\n\n**The revolution:** Commission-free trading from apps like Robinhood forced the entire industry to drop fees. This was great for investors but created new questions about payment for order flow.\n\nThe lesson: always know what you're paying. Even small fees compound into large amounts over time.`,
        assetToUnlock: [],
        baseReward: 150,
        quiz: makeQuiz("2-4", [
          { question: "How do 'free' brokerages typically make money?", options: ["They don't — they lose money on every trade", "By selling order flow to market makers", "By charging hidden taxes", "Through government subsidies"], correctIndex: 1 },
          { question: "What is an expense ratio?", options: ["The ratio of wins to losses", "An annual fee charged on funds", "The cost of opening an account", "The spread between bid and ask"], correctIndex: 1 },
          { question: "If you pay $5 per trade and make 200 trades a year, what's your annual cost?", options: ["$200", "$500", "$1,000", "$5,000"], correctIndex: 2 },
          { question: "Why did commission-free trading become standard?", options: ["Government mandate", "Robinhood forced competitors to match their free model", "Exchanges eliminated all fees", "Trading volume dropped"], correctIndex: 1 },
          { question: "Two ETFs track the same index. ETF A charges 0.03% per year, ETF B charges 1%. On $100,000 over 20 years, roughly how much more would ETF B cost?", options: ["A few hundred dollars", "About $5,000 more", "Over $20,000 more in fees and lost compounding", "They'd cost the same"], correctIndex: 2 },
          { question: "An investor with a $5,000 portfolio makes 3 trades per day, paying $1 per trade. After one year of trading 250 days, how have fees affected their portfolio?", options: ["Barely noticeable — $1 per trade is nothing", "Fees of $750 = 15% of portfolio. The trading strategy needs to return 15%+ just to break even", "Fees don't compound so it doesn't matter", "Daily traders are exempt from fees"], correctIndex: 1 },
        ]),
      },
      {
        id: "2-5", chapterId: 2, chapterName: "How to Buy and Sell", lessonNumber: 10,
        title: "Calculating Profit and Loss",
        content: `The most fundamental calculation in investing: did you make money or lose money?\n\n**Dollar profit/loss:** (Sell Price − Buy Price) × Quantity. Buy 10 shares at $100, sell at $120: ($120 − $100) × 10 = $200 profit.\n\n**Percentage return:** (Profit ÷ Amount Invested) × 100. $200 profit ÷ $1,000 invested × 100 = 20% return.\n\nPercentage matters more than dollar amounts. Making $200 on a $1,000 investment (20%) is better than making $200 on a $10,000 investment (2%).\n\n**Unrealized vs realized:** If you haven't sold yet, your profit or loss is "unrealized" — it's just on paper. Once you sell, it becomes "realized" and may be subject to taxes.\n\nAlways think in percentages. It helps you compare different investments fairly and understand your true performance.`,
        assetToUnlock: [],
        baseReward: 150,
        quiz: makeQuiz("2-5", [
          { question: "Buy 5 shares at $80, sell at $100. What's your profit?", options: ["$80", "$100", "$20", "$100"], correctIndex: 1 },
          { question: "What's the formula for percentage return?", options: ["Profit × Quantity", "(Profit ÷ Amount Invested) × 100", "Sell Price ÷ Buy Price", "Buy Price − Sell Price"], correctIndex: 1 },
          { question: "What does 'unrealized' profit mean?", options: ["Profit you lost", "Profit you haven't locked in by selling yet", "Profit that's not real", "Profit from dividends"], correctIndex: 1 },
          { question: "Which is a better investment: $500 profit on $5,000 or $500 profit on $2,000?", options: ["Both are the same — $500 is $500", "The $5,000 investment — bigger is better", "The $2,000 investment — 25% return vs 10%", "Neither — only losses matter"], correctIndex: 2 },
          { question: "You bought a stock at $50. It's now at $75. You haven't sold. What's your unrealized return?", options: ["25%", "50%", "75%", "100%"], correctIndex: 1 },
          { question: "Investor A makes 50% on a $2,000 investment. Investor B makes 10% on a $20,000 investment. Who made more money? Who had a better return?", options: ["A made more money and had a better return", "B made more money ($2,000 vs $1,000) but A had a better percentage return (50% vs 10%)", "They made the same amount", "Returns can't be compared this way"], correctIndex: 1 },
        ]),
      },
    ],
  },
  {
    id: 3,
    name: "Understanding Risk",
    color: "hsl(45, 93%, 58%)",
    icon: "zap",
    baseReward: 200,
    totalReward: 1000,
    lessons: [
      {
        id: "3-1", chapterId: 3, chapterName: "Understanding Risk", lessonNumber: 11,
        title: "What Is Investment Risk?",
        content: `Every investment carries risk. Risk means the possibility that you could lose some or all of your money. There's no such thing as a risk-free investment with high returns.\n\n**The risk-reward relationship:** Generally, higher potential returns come with higher risk. A savings account is very safe but earns almost nothing. Stocks can earn 10%+ per year but can also lose 30% in a crash.\n\n**Types of risk:** Market risk (the whole market drops), company risk (one company fails), inflation risk (your returns don't keep up with rising prices), and liquidity risk (you can't sell when you need to).\n\nThe key insight is not to avoid risk — it's to understand it, manage it, and make sure you're being compensated for taking it. If two investments have the same expected return but different risk levels, always choose the less risky one.\n\nRisk is not the same as losing money. Risk is the uncertainty of outcomes. Good investors don't eliminate risk — they manage it intelligently.`,
        assetToUnlock: ["GLD", "SLV"],
        baseReward: 200,
        quiz: makeQuiz("3-1", [
          { question: "What is investment risk?", options: ["Guaranteed losses", "The possibility of losing money", "Only losing all your money", "Something only for professional investors"], correctIndex: 1 },
          { question: "What's the relationship between risk and reward?", options: ["No relationship", "Higher potential returns usually mean higher risk", "Lower risk always means higher returns", "Risk and reward are the same thing"], correctIndex: 1 },
          { question: "What is market risk?", options: ["Risk that one company fails", "Risk that the entire market declines", "Risk of high inflation", "Risk of your broker going bankrupt"], correctIndex: 1 },
          { question: "Why is inflation a form of investment risk?", options: ["Inflation makes stocks more valuable", "Your returns might not keep up with rising prices, reducing purchasing power", "Inflation only affects real estate", "Inflation eliminates all investment gains"], correctIndex: 1 },
          { question: "If two investments offer the same expected return but different risk levels, which should you choose?", options: ["The riskier one — more excitement", "The less risky one — same reward for less uncertainty", "Neither — invest in both equally", "Risk level doesn't matter if returns are the same"], correctIndex: 1 },
          { question: "A friend says they found a 'guaranteed' investment returning 30% per year with zero risk. What should you think?", options: ["Great — invest immediately", "Sounds too good to be true — high returns with 'no risk' is a major red flag for fraud", "30% is normal for safe investments", "Risk-free high returns are common if you know where to look"], correctIndex: 1 },
        ]),
      },
      {
        id: "3-2", chapterId: 3, chapterName: "Understanding Risk", lessonNumber: 12,
        title: "Volatility Explained Simply",
        content: `Volatility measures how much a stock's price jumps around. A stock that moves 1% in a typical day is low volatility. One that moves 5-10% daily is highly volatile.\n\nThink of it as "how jumpy is this stock?" A utility company might move 0.5% per day — very calm. A tech startup might swing 8% in a single session.\n\n**Why it matters:** High volatility means bigger potential gains AND bigger potential losses. If you can't stomach seeing your investment drop 20% in a week, you should avoid highly volatile stocks.\n\n**Measuring volatility:** The VIX (often called the "fear index") measures expected volatility of the S&P 500. When VIX is low (under 15), markets are calm. When it spikes above 30, people are scared.\n\nVolatility is not inherently bad. It creates opportunities. But you need to match your investments to your emotional tolerance. If wild price swings keep you up at night, stick to lower-volatility investments.`,
        assetToUnlock: [],
        baseReward: 200,
        quiz: makeQuiz("3-2", [
          { question: "What does volatility measure?", options: ["A company's profit", "How much a stock's price fluctuates", "The volume of trades", "A stock's dividend yield"], correctIndex: 1 },
          { question: "What is the VIX?", options: ["A stock ticker", "A measure of expected market volatility", "A type of ETF", "A trading strategy"], correctIndex: 1 },
          { question: "A stock with low volatility typically moves how much per day?", options: ["10-20%", "5-10%", "Less than 1-2%", "Exactly 0%"], correctIndex: 2 },
          { question: "Is high volatility always bad?", options: ["Yes — always avoid volatile stocks", "No — it creates both risk and opportunity", "Volatility doesn't affect returns", "Only bad for professional traders"], correctIndex: 1 },
          { question: "The VIX jumps from 12 to 35 in one week. What is this telling you?", options: ["Markets are very calm", "Investors are becoming significantly more fearful", "Stocks will definitely crash", "The VIX is broken"], correctIndex: 1 },
          { question: "You have two portfolios. Portfolio A returns 8% per year with small, steady movements. Portfolio B returns 10% per year but regularly drops 25-30% before recovering. For a retiree who needs stable income, which is better and why?", options: ["Portfolio B — higher returns always win", "Portfolio A — the retiree can't afford a 30% drop when they need income", "Both are equally suitable", "Neither — retirees shouldn't invest"], correctIndex: 1 },
        ]),
      },
      {
        id: "3-3", chapterId: 3, chapterName: "Understanding Risk", lessonNumber: 13,
        title: "What Is Diversification?",
        content: `Diversification means spreading your money across many investments so that no single failure ruins your portfolio.\n\nImagine putting all your money into one company. If that company goes bankrupt, you lose everything. But if you own 50 different companies and one goes bankrupt, you only lose 2% of your portfolio.\n\n**How to diversify:** Across companies (own many, not one), across sectors (tech, healthcare, energy), across asset types (stocks, bonds, commodities), and across countries (US, international).\n\n**The free lunch of investing:** Nobel Prize-winning economist Harry Markowitz called diversification the only "free lunch" in finance. You can reduce risk without reducing expected returns.\n\nIndex funds are diversification in one purchase — that's why they're so powerful. But even within a diversified portfolio, you should understand what you own and why.`,
        assetToUnlock: [],
        baseReward: 200,
        quiz: makeQuiz("3-3", [
          { question: "What is diversification?", options: ["Buying one stock in large quantities", "Spreading money across many investments to reduce risk", "Timing the market perfectly", "Only investing in tech stocks"], correctIndex: 1 },
          { question: "If you own 50 stocks and one goes bankrupt, roughly how much of your portfolio do you lose?", options: ["50%", "25%", "10%", "2%"], correctIndex: 3 },
          { question: "Who called diversification the only 'free lunch' in finance?", options: ["Warren Buffett", "Harry Markowitz", "Elon Musk", "Benjamin Graham"], correctIndex: 1 },
          { question: "Which is an example of diversifying across asset types?", options: ["Owning Apple and Microsoft", "Owning US and international stocks", "Owning stocks, bonds, and gold", "Owning 10 tech stocks"], correctIndex: 2 },
          { question: "Why are index funds considered a good diversification tool?", options: ["They only hold the best stocks", "They hold hundreds of stocks in a single purchase", "They eliminate all risk", "They guarantee 10% returns"], correctIndex: 1 },
          { question: "An investor owns 5 tech stocks and nothing else. They think they're diversified because they own 5 companies. Are they right? Why or why not?", options: ["Yes — 5 is enough companies", "No — they're concentrated in one sector. A tech downturn would hit all 5 simultaneously", "Yes — tech is the safest sector", "Sector doesn't matter for diversification"], correctIndex: 1 },
        ]),
      },
      {
        id: "3-4", chapterId: 3, chapterName: "Understanding Risk", lessonNumber: 14,
        title: "Safe Assets vs Risky Assets",
        content: `Investments exist on a spectrum from very safe to very risky.\n\n**Safest:** Cash and savings accounts — won't lose value but earn almost nothing. Government bonds — backed by the US government, very safe, low returns.\n\n**Middle ground:** Blue-chip stocks (Apple, Microsoft) — established companies, moderate volatility. Bond funds — mix of bonds, relatively stable.\n\n**Riskier:** Small-cap stocks — smaller companies with more growth potential but more volatility. Commodities — prices driven by unpredictable supply/demand factors.\n\n**Riskiest:** Crypto — highly volatile, 50%+ swings are normal. Penny stocks — tiny companies, often manipulated. Options and leveraged products.\n\nGold sits in an interesting spot — it's considered a "safe haven" that tends to go up when stocks go down. Investors use it as insurance against market turmoil.\n\nYour portfolio should have a mix that matches your risk tolerance and time horizon.`,
        assetToUnlock: [],
        baseReward: 200,
        quiz: makeQuiz("3-4", [
          { question: "Which is generally the safest investment?", options: ["Crypto", "Government bonds", "Penny stocks", "Commodities"], correctIndex: 1 },
          { question: "Why is gold considered a 'safe haven'?", options: ["Gold always goes up", "Gold tends to hold value or increase when stocks fall", "The government guarantees gold prices", "Gold has zero volatility"], correctIndex: 1 },
          { question: "Where do blue-chip stocks fall on the risk spectrum?", options: ["Safest", "Middle — established companies with moderate volatility", "Riskiest", "Same risk as cash"], correctIndex: 1 },
          { question: "Why are penny stocks considered very risky?", options: ["They're backed by the government", "Small companies, low liquidity, often manipulated", "They're the same as blue-chips", "Penny stocks always go to zero"], correctIndex: 1 },
          { question: "A portfolio needs to match your risk tolerance and what else?", options: ["Your favorite stocks", "Your time horizon", "Your broker's recommendation only", "The current trending assets"], correctIndex: 1 },
          { question: "A 28-year-old with 35 years until retirement and a 65-year-old about to retire both have $100,000. Should their portfolios look the same? Why?", options: ["Yes — the best investments are the same for everyone", "No — the 28-year-old can afford more risk (more stocks) because they have time to recover from crashes, while the retiree needs stability (more bonds)", "No — the retiree should take more risk to grow their money faster", "Age is irrelevant to investment decisions"], correctIndex: 1 },
        ]),
      },
      {
        id: "3-5", chapterId: 3, chapterName: "Understanding Risk", lessonNumber: 15,
        title: "How Much Risk Is Right for You?",
        content: `Risk tolerance is deeply personal. It depends on your age, goals, financial situation, and emotional temperament.\n\n**Age:** Younger investors can take more risk because they have decades to recover from crashes. A 25-year-old can afford a 40% drop. A 65-year-old retiree cannot.\n\n**Goals:** Saving for a house in 2 years? Stay conservative. Building retirement wealth over 30 years? You can afford more risk.\n\n**The sleep test:** If checking your portfolio keeps you up at night, you're taking too much risk. The best portfolio is one you can stick with through thick and thin.\n\n**Emotional tolerance:** Some people see a 20% drop and panic sell. Others see it as a buying opportunity. Know yourself honestly.\n\nA common rule of thumb: your stock allocation should be roughly (110 − your age)%. A 30-year-old might have 80% stocks, 20% bonds. A 60-year-old might have 50/50. But this is just a starting point — adjust based on your personal situation.`,
        assetToUnlock: [],
        baseReward: 200,
        quiz: makeQuiz("3-5", [
          { question: "What is risk tolerance?", options: ["The maximum amount you can invest", "Your personal ability and willingness to handle investment losses", "A government-mandated limit", "How much risk a broker allows"], correctIndex: 1 },
          { question: "Why can younger investors generally take more risk?", options: ["They're smarter", "They have more time to recover from losses", "Young people can't lose money", "Risk doesn't apply to young people"], correctIndex: 1 },
          { question: "What is the 'sleep test' for risk?", options: ["How long you sleep before market open", "If your investments keep you up at night, you have too much risk", "Sleeping on decisions before trading", "A test brokers administer"], correctIndex: 1 },
          { question: "Using the 110 minus age rule, how much should a 30-year-old allocate to stocks?", options: ["30%", "50%", "80%", "110%"], correctIndex: 2 },
          { question: "Saving for a house down payment in 18 months. What's the appropriate risk level?", options: ["Very aggressive — maximize returns", "Conservative — you can't afford a big drop right before you need the money", "Moderate — split between stocks and crypto", "Risk level doesn't matter for short-term goals"], correctIndex: 1 },
          { question: "You invested $50,000. The market drops 25% and your portfolio is now worth $37,500. You feel sick and can't stop checking your phone. What does this reveal, and what should you do?", options: ["Buy more immediately — stocks are on sale", "This emotional reaction suggests your risk exposure exceeds your tolerance. Consider adjusting your allocation when markets recover", "Sell everything — trust your gut", "Ignore your feelings — they don't matter in investing"], correctIndex: 1 },
        ]),
      },
    ],
  },
  // Chapters 4-10: Concise content
  {
    id: 4, name: "Reading the Market", color: "hsl(280, 70%, 55%)", icon: "search",
    baseReward: 250, totalReward: 1250,
    lessons: [
      { id: "4-1", chapterId: 4, chapterName: "Reading the Market", lessonNumber: 16, title: "Bull Markets and Bear Markets",
        content: "A bull market is when prices are rising — optimism drives buying. A bear market is when prices fall 20%+ from recent highs — fear dominates. Bull markets last years on average; bear markets tend to be shorter but more intense. The key is staying invested through both. Historically, markets recover from every bear market and go on to new highs.",
        assetToUnlock: ["TSLA", "AMZN"], baseReward: 250,
        quiz: makeQuiz("4-1", [
          { question: "What defines a bear market?", options: ["Any day the market drops", "A decline of 20%+ from recent highs", "Markets that only go down forever", "A market with no trading"], correctIndex: 1 },
          { question: "Which typically lasts longer?", options: ["Bear markets", "Bull markets", "They're equal", "Neither lasts more than a month"], correctIndex: 1 },
          { question: "What drives a bull market?", options: ["Fear and panic", "Optimism and buying pressure", "Government intervention only", "Low trading volume"], correctIndex: 1 },
          { question: "During a bear market, what do prices generally do?", options: ["Go up slowly", "Stay flat", "Decline significantly", "Only bonds are affected"], correctIndex: 2 },
          { question: "Historically, do markets recover from bear markets?", options: ["Never", "Sometimes", "Yes — every bear market has been followed by recovery", "Only if the government intervenes"], correctIndex: 2 },
          { question: "Markets drop 30% over 6 months. Your friend says 'the market will never recover — sell everything.' Based on history, is this good advice?", options: ["Yes — some crashes are permanent", "No — historically every major decline has recovered. Selling locks in losses at the worst time", "It depends on which stocks you own", "You should sell half"], correctIndex: 1 },
        ]),
      },
      { id: "4-2", chapterId: 4, chapterName: "Reading the Market", lessonNumber: 17, title: "Market Cycles",
        content: "Markets move in cycles: expansion (growth), peak (top), contraction (decline), and trough (bottom). These cycles can last years. The 2020 COVID crash was a rapid cycle — markets crashed 34% in weeks, then recovered to new highs within months. Understanding cycles helps you avoid panic and spot opportunities.",
        assetToUnlock: [], baseReward: 250,
        quiz: makeQuiz("4-2", [
          { question: "What are the four phases of a market cycle?", options: ["Buy, sell, hold, short", "Expansion, peak, contraction, trough", "Morning, noon, evening, night", "Growth, maturity, decline, death"], correctIndex: 1 },
          { question: "How fast did markets crash during COVID in 2020?", options: ["Over a year", "About 6 months", "Just a few weeks", "Markets didn't crash in 2020"], correctIndex: 2 },
          { question: "What happens during the expansion phase?", options: ["Prices decline", "The economy and stock prices grow", "Markets are closed", "Only bonds do well"], correctIndex: 1 },
          { question: "What is the 'trough' in a market cycle?", options: ["The highest point", "The bottom — where decline ends and recovery begins", "A trading strategy", "When markets close"], correctIndex: 1 },
          { question: "Why is understanding market cycles useful?", options: ["It lets you perfectly time the market", "It helps you avoid panic and recognize that downturns are normal and temporary", "It eliminates risk", "Cycles are unpredictable so they're useless to study"], correctIndex: 1 },
          { question: "It's March 2020, markets just crashed 34% due to COVID. Everyone is panicking. Knowing about market cycles, what would have been the best response?", options: ["Sell everything — the world is ending", "Stay invested or even buy more — rapid crashes often recover quickly, and this was a contraction likely to be followed by recovery", "Wait exactly 6 months then invest", "Market cycles don't apply to pandemics"], correctIndex: 1 },
        ]),
      },
      { id: "4-3", chapterId: 4, chapterName: "Reading the Market", lessonNumber: 18, title: "What Is Market Sentiment?",
        content: "Market sentiment is the collective mood of investors — are they fearful or greedy? When sentiment is extremely positive, prices can be pushed above fair value (bubbles). When negative, prices can fall below fair value (opportunities). The famous Warren Buffett quote: 'Be fearful when others are greedy, and greedy when others are fearful.'",
        assetToUnlock: [], baseReward: 250,
        quiz: makeQuiz("4-3", [
          { question: "What is market sentiment?", options: ["A technical indicator", "The collective mood and emotions of investors", "A type of order", "The official market rating"], correctIndex: 1 },
          { question: "Who said 'Be fearful when others are greedy'?", options: ["Elon Musk", "Warren Buffett", "Jeff Bezos", "Benjamin Graham"], correctIndex: 1 },
          { question: "What can extreme positive sentiment lead to?", options: ["Guaranteed profits", "Price bubbles above fair value", "Market closure", "Lower volatility"], correctIndex: 1 },
          { question: "When sentiment is extremely negative, what opportunity might exist?", options: ["Everything is worthless", "Assets may be priced below fair value, creating buying opportunities", "You should always sell during fear", "Negative sentiment means markets won't recover"], correctIndex: 1 },
          { question: "Can sentiment push prices away from fundamental value?", options: ["No — prices always reflect true value", "Yes — emotions can cause overvaluation and undervaluation", "Only in crypto markets", "Sentiment only affects penny stocks"], correctIndex: 1 },
          { question: "Everyone on social media is saying a particular stock is 'going to the moon' and it's already up 300% in 2 months. Based on sentiment analysis, what should you consider?", options: ["Buy immediately — don't miss out", "Be cautious — extreme greed often signals a potential correction. The price may already be far above fair value", "Social media hype is always accurate", "Buy and sell within the same day"], correctIndex: 1 },
        ]),
      },
      { id: "4-4", chapterId: 4, chapterName: "Reading the Market", lessonNumber: 19, title: "What Are Earnings Reports?",
        content: "Every public company reports its financial results four times a year — quarterly earnings. These reports show revenue, profit, and future guidance. If a company 'beats expectations,' the stock often jumps. If it 'misses,' the stock often drops. Earnings season is when most companies report simultaneously, creating heightened volatility and trading opportunities.",
        assetToUnlock: [], baseReward: 250,
        quiz: makeQuiz("4-4", [
          { question: "How often do public companies report earnings?", options: ["Monthly", "Quarterly (4x per year)", "Annually", "Weekly"], correctIndex: 1 },
          { question: "What does 'beating expectations' mean?", options: ["The stock price went up", "The company reported better results than analysts predicted", "The company beat its competitors", "The CEO won an award"], correctIndex: 1 },
          { question: "What typically happens when a company misses earnings expectations?", options: ["Stock goes up", "Stock often drops", "Nothing changes", "The company is delisted"], correctIndex: 1 },
          { question: "What is 'guidance' in an earnings report?", options: ["Instructions for investors", "The company's forecast for future performance", "Government regulations", "A type of stock order"], correctIndex: 1 },
          { question: "Why does earnings season create more volatility?", options: ["Exchanges change their rules", "Many companies report results simultaneously, causing big price moves", "Volatility is random and unrelated to earnings", "Markets close during earnings season"], correctIndex: 1 },
          { question: "A company beats earnings by 15%, but their forward guidance suggests slowing growth. The stock drops 8%. Why might this happen?", options: ["Markets are broken", "Investors look forward, not backward — weak future guidance outweighs past results", "Beating earnings should always make stocks go up", "The earnings report must be wrong"], correctIndex: 1 },
        ]),
      },
      { id: "4-5", chapterId: 4, chapterName: "Reading the Market", lessonNumber: 20, title: "What Is the P/E Ratio?",
        content: "The Price-to-Earnings (P/E) ratio tells you how expensive a stock is relative to its earnings. If a stock trades at $100 and earns $5 per share, its P/E is 20. A high P/E (like 50+) might mean the stock is expensive OR that investors expect rapid growth. A low P/E (like 10) might mean it's cheap OR struggling. Use P/E to compare stocks within the same industry, not across different ones.",
        assetToUnlock: [], baseReward: 250,
        quiz: makeQuiz("4-5", [
          { question: "What does P/E ratio measure?", options: ["Profit and expenses", "Price relative to earnings per share", "Portfolio efficiency", "Percentage of equity"], correctIndex: 1 },
          { question: "A stock at $200 with earnings of $10/share has what P/E?", options: ["10", "20", "200", "2000"], correctIndex: 1 },
          { question: "Does a high P/E always mean a stock is overpriced?", options: ["Yes — always avoid high P/E stocks", "No — it might reflect high growth expectations", "P/E doesn't matter", "High P/E means the company is more profitable"], correctIndex: 1 },
          { question: "How should you best use P/E ratios?", options: ["Compare any two stocks", "Compare stocks within the same industry", "Only look at P/E and nothing else", "Ignore P/E completely"], correctIndex: 1 },
          { question: "A company has a P/E of 5 while its industry average is 20. What might this suggest?", options: ["It's definitely a great bargain", "It could be undervalued, or the market sees problems — needs deeper investigation", "Low P/E always means great investment", "The P/E calculation is wrong"], correctIndex: 1 },
          { question: "Tech Company A has a P/E of 80. Utility Company B has a P/E of 12. A friend says Company A is 'way overpriced.' Is this a fair comparison?", options: ["Yes — lower P/E is always better", "No — different industries have different typical P/E ranges. Tech companies often trade at higher P/Es due to growth expectations", "P/E doesn't apply to tech companies", "Both are equally overpriced"], correctIndex: 1 },
        ]),
      },
    ],
  },
  {
    id: 5, name: "Your Brain Is the Enemy", color: "hsl(330, 80%, 55%)", icon: "brain",
    baseReward: 300, totalReward: 1500,
    lessons: [
      { id: "5-1", chapterId: 5, chapterName: "Your Brain Is the Enemy", lessonNumber: 21, title: "Loss Aversion", content: "Losing $100 feels about twice as painful as gaining $100 feels good. This is called loss aversion — a deeply wired human bias. It causes investors to hold losing positions too long (hoping to avoid realizing the loss) and sell winning positions too early (locking in gains before they can disappear). Being aware of this bias is the first step to overcoming it.", assetToUnlock: ["GOOGL", "NVDA"], baseReward: 300, quiz: makeQuiz("5-1", [
        { question: "What is loss aversion?", options: ["Avoiding risky investments", "The tendency to feel losses more strongly than equivalent gains", "A trading strategy", "Fear of the stock market"], correctIndex: 1 },
        { question: "How does loss aversion affect investors?", options: ["It makes them better traders", "They hold losers too long and sell winners too early", "It has no effect on trading", "It only affects beginners"], correctIndex: 1 },
        { question: "Roughly how much more painful is a loss vs an equivalent gain?", options: ["Equal", "About 2x", "About 10x", "Losses don't hurt"], correctIndex: 1 },
        { question: "What's a practical consequence of loss aversion?", options: ["Better diversification", "Refusing to sell a losing stock because 'selling makes the loss real'", "Always buying at the bottom", "Perfect market timing"], correctIndex: 1 },
        { question: "How can you combat loss aversion?", options: ["Never check your portfolio", "Set predetermined rules for when to sell, before emotions take over", "Only invest in risk-free assets", "Ignore losses completely"], correctIndex: 1 },
        { question: "You bought a stock at $100. It drops to $60. You've done research and the company's fundamentals have deteriorated. But selling 'feels wrong' because you'd lock in a 40% loss. What's happening and what should you do?", options: ["Trust your gut — don't sell", "Loss aversion is clouding your judgment. If fundamentals are broken, holding won't fix it — sell based on analysis, not emotion", "Wait until it goes back to $100 then sell", "Double down to lower your average cost"], correctIndex: 1 },
      ]) },
      { id: "5-2", chapterId: 5, chapterName: "Your Brain Is the Enemy", lessonNumber: 22, title: "Panic Selling", content: "When markets crash, your fight-or-flight instinct screams 'SELL EVERYTHING.' This is panic selling — and it's one of the most destructive things an investor can do. Selling at the bottom locks in your losses permanently. Markets recover, but your sold shares don't. The 2020 crash recovered in months. Investors who panic sold missed the fastest recovery in history.", assetToUnlock: [], baseReward: 300, quiz: makeQuiz("5-2", [
        { question: "What is panic selling?", options: ["Selling strategically during a dip", "Selling investments out of fear during a crash", "Selling at the peak", "A professional trading technique"], correctIndex: 1 },
        { question: "Why is panic selling destructive?", options: ["It happens too slowly", "It locks in losses at the worst possible time", "It always leads to profits", "It only affects options traders"], correctIndex: 1 },
        { question: "How long did the 2020 COVID crash recovery take?", options: ["Several years", "About 18 months", "Just a few months", "Markets never recovered"], correctIndex: 2 },
        { question: "What triggers the urge to panic sell?", options: ["Rational analysis", "Fight-or-flight instinct driven by fear", "Greed", "Boredom"], correctIndex: 1 },
        { question: "What's a better alternative to panic selling during a crash?", options: ["Sell half your portfolio", "Review your long-term plan and remember that crashes are temporary", "Buy leveraged inverse ETFs", "Close your brokerage account"], correctIndex: 1 },
        { question: "In March 2020, your portfolio drops 35% in three weeks. You sell everything at the bottom. By August, markets fully recover and go to new highs. What was the real cost of panic selling?", options: ["No cost — you protected your money", "You locked in a 35% loss AND missed the full recovery. You're worse off than if you'd done nothing", "Only a small opportunity cost", "Panic selling was the right move because nobody could predict recovery"], correctIndex: 1 },
      ]) },
      { id: "5-3", chapterId: 5, chapterName: "Your Brain Is the Enemy", lessonNumber: 23, title: "FOMO Investing", content: "FOMO (Fear Of Missing Out) drives you to chase investments that already skyrocketed. GameStop went from $20 to $400 — people who bought near the top watched it crash back down. Dogecoin pumped 15,000% — late buyers lost most of their money. By the time everyone is talking about a stock, the easy money has already been made.", assetToUnlock: [], baseReward: 300, quiz: makeQuiz("5-3", [
        { question: "What is FOMO investing?", options: ["A sound strategy", "Buying assets because you fear missing a rally that already happened", "Selling before others", "Avoiding all investments"], correctIndex: 1 },
        { question: "What often happens when you buy an asset that already surged 500%?", options: ["It goes up another 500%", "You're likely buying near the top, and price often falls significantly after", "Nothing — past performance guarantees future results", "You always make money on momentum"], correctIndex: 1 },
        { question: "GameStop went from $20 to $400 then crashed. What does this illustrate?", options: ["That meme stocks are safe investments", "The danger of buying at the peak of a hype-driven rally", "That stocks always go up", "That short sellers always lose"], correctIndex: 1 },
        { question: "How can you protect yourself from FOMO?", options: ["Buy every trending stock immediately", "Have a written investment plan and stick to it regardless of hype", "Follow social media traders exclusively", "Only invest when stocks are trending on Twitter"], correctIndex: 1 },
        { question: "When 'everyone is talking about a stock,' what does this usually mean?", options: ["It's still early — time to buy", "The easy money has likely already been made", "It's guaranteed to keep going up", "The stock is undervalued"], correctIndex: 1 },
        { question: "Your coworkers are bragging about huge gains on a crypto token that's up 1000% this month. You feel the urge to buy. What should you consider before acting?", options: ["Nothing — buy immediately before it goes higher", "Ask yourself: has the easy money been made? Am I investing based on analysis or emotion? Could I accept losing this money entirely?", "As long as it's going up, it will keep going up", "Coworkers always give the best investment advice"], correctIndex: 1 },
      ]) },
      { id: "5-4", chapterId: 5, chapterName: "Your Brain Is the Enemy", lessonNumber: 24, title: "Confirmation Bias", content: "Confirmation bias is the tendency to seek out information that supports what you already believe and ignore information that challenges it. If you think Tesla is great, you'll read bullish articles and dismiss bearish ones. This creates blind spots. Fight it by actively seeking opposing viewpoints and asking 'What could go wrong?'", assetToUnlock: [], baseReward: 300, quiz: makeQuiz("5-4", [
        { question: "What is confirmation bias?", options: ["Confirming trades with your broker", "Only seeking information that supports your existing beliefs", "A type of market analysis", "A government regulation"], correctIndex: 1 },
        { question: "How does confirmation bias hurt investors?", options: ["It doesn't — it helps", "Creates blind spots by ignoring warning signs that contradict your thesis", "It only affects beginners", "It makes you trade too little"], correctIndex: 1 },
        { question: "How can you combat confirmation bias?", options: ["Only read news you agree with", "Actively seek opposing viewpoints and analysis", "Ignore all news", "Trust your gut exclusively"], correctIndex: 1 },
        { question: "A good question to regularly ask about your investments is:", options: ["When will this make me rich?", "What could go wrong with this thesis?", "How much higher can this go?", "Who else is buying this?"], correctIndex: 1 },
        { question: "You own a stock and find yourself only reading articles that are positive about it. What's happening?", options: ["Smart research", "Confirmation bias — you're filtering for agreement and ignoring potential risks", "Normal investing behavior that's perfectly fine", "The stock must be good if so many articles are positive"], correctIndex: 1 },
        { question: "You're bullish on a company. A credible analyst publishes a detailed bear case with strong evidence. Your first instinct is to dismiss it. What should you do instead?", options: ["Ignore it — your research is better", "Engage with the bear case seriously. If you can't refute the specific arguments, your thesis might have weaknesses", "Block the analyst on social media", "Sell everything immediately based on one opinion"], correctIndex: 1 },
      ]) },
      { id: "5-5", chapterId: 5, chapterName: "Your Brain Is the Enemy", lessonNumber: 25, title: "Overtrading", content: "Overtrading means buying and selling too frequently. Each trade has costs (spreads, fees, taxes), and studies show that the most active traders have the worst returns. A famous study found that the average investor who traded the most earned 6.5% less per year than those who traded the least. Patience is profitable.", assetToUnlock: [], baseReward: 300, quiz: makeQuiz("5-5", [
        { question: "What is overtrading?", options: ["Trading exactly the right amount", "Buying and selling too frequently, generating unnecessary costs", "Only trading once a year", "Trading more than your broker allows"], correctIndex: 1 },
        { question: "What do studies show about frequent traders vs infrequent ones?", options: ["Frequent traders earn more", "Frequent traders tend to earn significantly less", "No difference in returns", "Frequent traders have lower risk"], correctIndex: 1 },
        { question: "What are the hidden costs of overtrading?", options: ["No costs — more trades means more opportunities", "Spreads, potential fees, and taxes on every trade add up", "Overtrading only costs time", "The only cost is stress"], correctIndex: 1 },
        { question: "Why is patience profitable in investing?", options: ["Markets are closed most of the time", "Compound growth requires time, and avoiding unnecessary trades reduces costs and tax drag", "Patient investors are luckier", "Patience has no proven benefit"], correctIndex: 1 },
        { question: "How much less per year did the most active traders earn vs the least active, according to research?", options: ["About 1%", "About 3%", "About 6.5%", "About 15%"], correctIndex: 2 },
        { question: "You check your portfolio 10 times a day and feel compelled to adjust your positions with each market move. Over a year, you've made 400 trades. Your portfolio is up only 2% while the market is up 12%. What's the diagnosis?", options: ["Bad luck", "Overtrading — excessive activity generated costs and emotional decisions that destroyed returns. A buy-and-hold approach would have earned 12%", "You need to trade even more to catch up", "The market was unusually strong this year"], correctIndex: 1 },
      ]) },
    ],
  },
  {
    id: 6, name: "Commodities and Real Assets", color: "hsl(35, 85%, 52%)", icon: "circle-dollar-sign",
    baseReward: 400, totalReward: 2000,
    lessons: [
      { id: "6-1", chapterId: 6, chapterName: "Commodities and Real Assets", lessonNumber: 26, title: "What Are Commodities?", content: "Commodities are physical goods — gold, oil, wheat, copper. Their prices are driven by real-world supply and demand. When the economy booms, industrial commodities rise. When investors are fearful, gold often rises as a safe haven. Commodities diversify a portfolio because they often move differently than stocks.", assetToUnlock: ["CL=F", "HG=F", "ZW=F"], baseReward: 400, quiz: makeQuiz("6-1", [
        { question: "What are commodities?", options: ["Digital currencies", "Physical goods traded on markets", "Government bonds", "Tech stocks"], correctIndex: 1 },
        { question: "What drives commodity prices?", options: ["Only stock market movements", "Real-world supply and demand", "Government decree", "Social media sentiment only"], correctIndex: 1 },
        { question: "Why is gold considered a safe haven?", options: ["It always goes up", "Investors buy it during uncertainty, pushing its price up when stocks fall", "The government guarantees its price", "Gold has zero risk"], correctIndex: 1 },
        { question: "How do commodities help a portfolio?", options: ["They guarantee profits", "They diversify because they often move differently than stocks", "They eliminate all risk", "They don't help at all"], correctIndex: 1 },
        { question: "When the economy booms, which commodities tend to rise?", options: ["Only gold", "Industrial commodities like copper and oil", "None — commodities fall in booms", "Agricultural commodities only"], correctIndex: 1 },
        { question: "During a recession, stocks fall 30%. An investor with 10% of their portfolio in gold sees gold rise 20%. How did gold affect their overall portfolio?", options: ["No impact", "Gold's gain partially offset stock losses, reducing overall portfolio decline — this is diversification working", "Gold made the portfolio worse", "10% allocation is too small to matter"], correctIndex: 1 },
      ]) },
      { id: "6-2", chapterId: 6, chapterName: "Commodities and Real Assets", lessonNumber: 27, title: "How Oil Prices Work", content: "Oil is the world's most important commodity. Its price is driven by global supply (OPEC, US shale), demand (economic growth, transportation), geopolitics (wars, sanctions), and weather. When oil prices spike, it raises costs for virtually every business — transportation, manufacturing, heating. This makes oil a key economic indicator.", assetToUnlock: [], baseReward: 400, quiz: makeQuiz("6-2", [
        { question: "Why is oil considered the most important commodity?", options: ["It's the most expensive", "It affects costs across virtually every industry", "Only because it powers cars", "It's the only traded commodity"], correctIndex: 1 },
        { question: "What is OPEC?", options: ["A stock exchange", "An organization of oil-producing countries that influences supply", "A type of ETF", "An oil company"], correctIndex: 1 },
        { question: "What happens when oil prices spike?", options: ["Only gas stations are affected", "Costs rise across transportation, manufacturing, and energy — affecting the whole economy", "The stock market always goes up", "Nothing — oil prices don't matter"], correctIndex: 1 },
        { question: "What factors drive oil prices?", options: ["Only supply", "Supply, demand, geopolitics, and weather", "Only OPEC decisions", "Stock market performance only"], correctIndex: 1 },
        { question: "Why do geopolitical events affect oil prices?", options: ["They don't", "Conflicts in oil-producing regions can disrupt supply, causing price spikes", "Geopolitics only affects stock markets", "Oil is immune to political events"], correctIndex: 1 },
        { question: "A major conflict begins in the Middle East. Oil prices surge 40% in a month. How might this ripple through the broader economy and stock market?", options: ["No effect on stocks or the economy", "Higher energy costs > higher business costs > lower profits > potential stock market decline, plus consumer spending drops as gas and heating costs rise", "Stock market always goes up during conflicts", "Only oil company stocks are affected"], correctIndex: 1 },
      ]) },
      { id: "6-3", chapterId: 6, chapterName: "Commodities and Real Assets", lessonNumber: 28, title: "Inflation and Commodities", content: "When inflation rises — when money loses purchasing power — commodity prices often rise too. Gold has been used as an inflation hedge for centuries. Real assets maintain value because they have intrinsic worth. A bar of gold, a barrel of oil, a bushel of wheat — these things have real utility regardless of what happens to paper money.", assetToUnlock: [], baseReward: 400, quiz: makeQuiz("6-3", [
        { question: "What is inflation?", options: ["Stock prices going up", "Money losing its purchasing power over time", "Companies making more profit", "The cost of trading going up"], correctIndex: 1 },
        { question: "Why do commodity prices often rise with inflation?", options: ["Government regulation", "Real assets maintain value while paper money loses it", "Commodities are immune to economics", "They don't — commodities fall during inflation"], correctIndex: 1 },
        { question: "Why is gold considered an inflation hedge?", options: ["Its supply is unlimited", "It has maintained purchasing power over centuries while currencies depreciate", "The government sets gold prices to match inflation", "Gold always goes up"], correctIndex: 1 },
        { question: "What gives commodities 'intrinsic value'?", options: ["Government backing", "Real-world utility — oil powers engines, wheat feeds people, gold is used in electronics", "Stock market demand", "They don't have intrinsic value"], correctIndex: 1 },
        { question: "During periods of high inflation, which tends to perform better?", options: ["Cash in a savings account", "Real assets like commodities", "Both perform equally", "Neither — everything loses value"], correctIndex: 1 },
        { question: "Inflation is running at 8% per year. Your savings account earns 2%. Your gold holding has gained 12%. In real terms (after inflation), what happened to each?", options: ["Both gained value", "Savings lost 6% in purchasing power. Gold gained 4% in real terms — illustrating why real assets hedge inflation", "Savings kept up with inflation", "Gold's gain is irrelevant to inflation"], correctIndex: 1 },
      ]) },
      { id: "6-4", chapterId: 6, chapterName: "Commodities and Real Assets", lessonNumber: 29, title: "Agricultural Commodities", content: "Wheat, corn, coffee, cotton — these commodities are driven by weather, seasons, and geopolitics. A drought in Kansas can spike wheat prices globally. Trade wars affect export flows. Climate change creates increasing uncertainty. Agricultural commodities are volatile but essential for portfolio diversification.", assetToUnlock: [], baseReward: 400, quiz: makeQuiz("6-4", [
        { question: "What primarily drives agricultural commodity prices?", options: ["Stock market performance", "Weather, seasons, and geopolitical factors", "Social media trends", "Interest rates only"], correctIndex: 1 },
        { question: "How can a drought in one country affect global food prices?", options: ["It can't — food prices are set locally", "Reduced supply from a major producer raises prices worldwide", "Droughts only affect local markets", "Food prices are fixed by governments"], correctIndex: 1 },
        { question: "Why is climate change relevant to agricultural investing?", options: ["It's not relevant", "Increasing weather unpredictability creates more price volatility and supply uncertainty", "Climate change only affects energy markets", "Agriculture is immune to climate change"], correctIndex: 1 },
        { question: "How do trade wars affect agricultural commodities?", options: ["They don't", "Tariffs and export restrictions disrupt supply chains and change price dynamics", "They only affect tech stocks", "Trade wars lower all commodity prices"], correctIndex: 1 },
        { question: "Are agricultural commodities good for diversification?", options: ["No — they're too risky", "Yes — they often move independently of stocks and bonds", "They move exactly like stocks", "Diversification doesn't apply to commodities"], correctIndex: 1 },
        { question: "Russia (a major wheat exporter) faces international sanctions. Global wheat futures jump 30%. How does this illustrate the interconnection between geopolitics and commodity markets?", options: ["No connection — it's coincidence", "Sanctions reduced global wheat supply, driving prices up. Countries dependent on Russian wheat now face food cost inflation — showing how geopolitics directly impacts commodities and daily life", "Wheat prices only change due to weather", "Sanctions don't affect trade"], correctIndex: 1 },
      ]) },
      { id: "6-5", chapterId: 6, chapterName: "Commodities and Real Assets", lessonNumber: 30, title: "Commodities in a Portfolio", content: "Commodities aren't for getting rich quick — they're for balance and protection. A 5-10% commodity allocation can reduce portfolio volatility because commodities often zig when stocks zag. Gold protects against inflation, oil profits from economic growth, and agricultural commodities provide exposure to essential global demand.", assetToUnlock: [], baseReward: 400, quiz: makeQuiz("6-5", [
        { question: "What role should commodities play in a portfolio?", options: ["The entire portfolio", "Balance, protection, and diversification — typically 5-10%", "No role — avoid commodities", "Only for professional traders"], correctIndex: 1 },
        { question: "Why do commodities reduce portfolio volatility?", options: ["They don't move at all", "They often move in different directions than stocks", "They're guaranteed by the government", "Commodities are risk-free"], correctIndex: 1 },
        { question: "What does gold protect against in a portfolio?", options: ["Stock market gains", "Inflation and economic uncertainty", "High returns", "Low interest rates only"], correctIndex: 1 },
        { question: "When might oil commodities perform well?", options: ["During recessions only", "During economic growth when demand for energy increases", "Only when stocks are falling", "Oil always performs the same regardless of conditions"], correctIndex: 1 },
        { question: "What's a typical recommended commodity allocation?", options: ["0% — never invest in commodities", "5-10% of a diversified portfolio", "50% or more", "100% during inflation"], correctIndex: 1 },
        { question: "A portfolio of 60% stocks and 40% bonds lost 15% during a market downturn. A similar portfolio with 55% stocks, 35% bonds, and 10% gold lost only 9%. What does this demonstrate?", options: ["Gold is better than stocks", "The gold allocation provided a cushion because gold rose while stocks fell, demonstrating the diversification benefit of commodities", "A 6% difference doesn't matter", "This is just luck — gold doesn't reliably help"], correctIndex: 1 },
      ]) },
    ],
  },
  {
    id: 7, name: "Crypto and Digital Assets", color: "hsl(270, 76%, 55%)", icon: "bitcoin",
    baseReward: 500, totalReward: 2500,
    lessons: [
      { id: "7-1", chapterId: 7, chapterName: "Crypto and Digital Assets", lessonNumber: 31, title: "What Is Bitcoin?", content: "Bitcoin was created in 2009 by the pseudonymous Satoshi Nakamoto. It's a digital currency with a hard cap of 21 million coins — no one can create more. Transactions are recorded on a blockchain, a public ledger. Bitcoin is often called 'digital gold' because of its scarcity. It's highly volatile but has been the best-performing asset of the last decade.", assetToUnlock: ["BTC-USD", "ETH-USD"], baseReward: 500, quiz: makeQuiz("7-1", [
        { question: "Who created Bitcoin?", options: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin", "The US Government"], correctIndex: 1 },
        { question: "What is the maximum supply of Bitcoin?", options: ["Unlimited", "100 million", "21 million", "1 billion"], correctIndex: 2 },
        { question: "What is a blockchain?", options: ["A type of stock exchange", "A public ledger that records all transactions", "A private bank", "A type of encryption"], correctIndex: 1 },
        { question: "Why is Bitcoin called 'digital gold'?", options: ["It's made from gold", "Its fixed supply makes it scarce, similar to gold", "The government backs it with gold", "It's literally golden colored"], correctIndex: 1 },
        { question: "What has Bitcoin's performance been over the last decade?", options: ["It lost value every year", "One of the best-performing assets despite extreme volatility", "Exactly matched the S&P 500", "It maintained a stable, constant price"], correctIndex: 1 },
        { question: "Bitcoin has a fixed supply of 21M coins. If adoption grows and demand increases but supply can't, what economic principle suggests will happen to the price?", options: ["Price will decrease", "Price will increase — fixed supply with growing demand pushes prices up", "Supply doesn't affect price", "The limit will be removed to meet demand"], correctIndex: 1 },
      ]) },
      { id: "7-2", chapterId: 7, chapterName: "Crypto and Digital Assets", lessonNumber: 32, title: "What Is Ethereum?", content: "Ethereum is a platform, not just a currency. While Bitcoin is 'digital gold,' Ethereum is a 'digital computer' that can run programs called smart contracts. These contracts execute automatically — no middleman needed. DeFi (decentralized finance), NFTs, and thousands of apps run on Ethereum. ETH is the fuel that powers this ecosystem.", assetToUnlock: [], baseReward: 500, quiz: makeQuiz("7-2", [
        { question: "How is Ethereum different from Bitcoin?", options: ["They're the same", "Ethereum is a platform that runs smart contracts, not just a currency", "Ethereum has no blockchain", "Bitcoin is newer than Ethereum"], correctIndex: 1 },
        { question: "What is a smart contract?", options: ["A legal document", "Self-executing code that runs automatically on the blockchain", "A type of cryptocurrency", "A contract with your broker"], correctIndex: 1 },
        { question: "What does ETH fuel?", options: ["Bitcoin transactions", "The Ethereum ecosystem — running apps and smart contracts", "Traditional banking", "Stock exchanges"], correctIndex: 1 },
        { question: "What is DeFi?", options: ["Default finance", "Decentralized finance — financial services running on blockchain without banks", "A type of stock", "A government program"], correctIndex: 1 },
        { question: "Why is Ethereum sometimes called a 'world computer'?", options: ["It's a physical computer", "It can run decentralized applications and smart contracts globally", "It processes stock trades", "Vitalik Buterin owns all the computers"], correctIndex: 1 },
        { question: "A traditional bank processes a loan: paperwork, credit checks, approval takes days, bank takes a cut. How might a smart contract on Ethereum handle this differently?", options: ["Exactly the same way", "Automatically execute lending terms based on coded conditions — no paperwork, instant settlement, lower fees, but no human oversight for edge cases", "Smart contracts can't handle financial transactions", "Banks are always better than blockchain solutions"], correctIndex: 1 },
      ]) },
      { id: "7-3", chapterId: 7, chapterName: "Crypto and Digital Assets", lessonNumber: 33, title: "Why Crypto Is So Volatile", content: "Crypto swings wildly because of low liquidity compared to stocks, extreme speculation, whale movements (large holders moving markets), regulatory news, and 24/7 trading with no circuit breakers. A single tweet from an influential person can move Bitcoin 10%. This volatility creates opportunity but also extreme risk.", assetToUnlock: [], baseReward: 500, quiz: makeQuiz("7-3", [
        { question: "Why is crypto more volatile than stocks?", options: ["It's not — they're equally volatile", "Lower liquidity, speculation, 24/7 trading, and no circuit breakers", "Government manipulation", "Crypto is more regulated than stocks"], correctIndex: 1 },
        { question: "What is a 'whale' in crypto?", options: ["A type of coin", "A large holder whose trades can significantly move the market", "A trading strategy", "A type of blockchain"], correctIndex: 1 },
        { question: "What are circuit breakers (that crypto lacks)?", options: ["Physical switches", "Trading halts that pause markets during extreme moves — crypto doesn't have them", "Crypto security features", "A type of wallet"], correctIndex: 1 },
        { question: "How can a single tweet affect crypto prices?", options: ["It can't", "In a speculative, sentiment-driven market with low liquidity, influential voices can trigger massive buying or selling", "Tweets are regulated by the SEC", "Only verified tweets affect prices"], correctIndex: 1 },
        { question: "Does crypto volatility create opportunity?", options: ["No — volatility is only bad", "Yes — but it comes with proportional risk", "Only for institutional investors", "Volatility means guaranteed profits"], correctIndex: 1 },
        { question: "A major country announces a crypto ban. Bitcoin drops 25% in hours. Another country announces crypto-friendly regulation the next week and Bitcoin recovers. What does this pattern reveal about crypto markets?", options: ["Crypto is a scam", "Regulatory news is a primary driver of crypto prices because the market's future depends heavily on legal acceptance — creating both opportunity and risk for investors", "Bans don't affect crypto", "Regulation doesn't matter — only technology matters"], correctIndex: 1 },
      ]) },
      { id: "7-4", chapterId: 7, chapterName: "Crypto and Digital Assets", lessonNumber: 34, title: "What Are Altcoins?", content: "Beyond Bitcoin and Ethereum, there are thousands of 'altcoins' — alternative cryptocurrencies. Some have real use cases (Solana for fast transactions, Chainlink for data feeds). Many are pure speculation or outright scams. The vast majority of altcoins lose 90%+ of their value eventually. Stick to established projects with real utility.", assetToUnlock: [], baseReward: 500, quiz: makeQuiz("7-4", [
        { question: "What are altcoins?", options: ["Alternative versions of Bitcoin", "Any cryptocurrency besides Bitcoin", "Fake cryptocurrencies", "Coins made of alternative metals"], correctIndex: 1 },
        { question: "Do all altcoins have real use cases?", options: ["Yes — every coin solves a problem", "No — many are speculative or scams. Only some have genuine utility", "Use cases don't matter in crypto", "Only meme coins have real utility"], correctIndex: 1 },
        { question: "What happens to the majority of altcoins over time?", options: ["They all become valuable", "Most lose 90%+ of their value", "They stay stable", "They all get acquired by Bitcoin"], correctIndex: 1 },
        { question: "What makes an altcoin worth investigating?", options: ["How funny its name is", "Real technical utility, strong team, growing adoption, and a genuine problem it solves", "Celebrity endorsements", "How much its price has pumped recently"], correctIndex: 1 },
        { question: "Name an altcoin with genuine utility.", options: ["All altcoins are scams", "Solana (fast transactions) or Chainlink (oracle data feeds)", "Whichever is trending on TikTok", "None — only Bitcoin has utility"], correctIndex: 1 },
        { question: "A new altcoin promises 1000x returns, has a dog-themed logo, no whitepaper, anonymous team, and is being promoted by paid influencers. What red flags do you see?", options: ["Sounds great — early opportunity", "Multiple red flags: no whitepaper, anonymous team, unrealistic promises, paid promotion. This has hallmarks of a pump-and-dump or scam", "Dog-themed coins are always good investments", "Anonymous teams are normal in crypto"], correctIndex: 1 },
      ]) },
      { id: "7-5", chapterId: 7, chapterName: "Crypto and Digital Assets", lessonNumber: 35, title: "Crypto in a Portfolio", content: "Crypto should be a small position — most advisors suggest 1-5% of a portfolio. Only invest what you can afford to lose entirely. Bitcoin and Ethereum are the 'blue chips' of crypto. Don't let crypto dominate your portfolio or your emotions. It's a high-risk, high-reward satellite holding, not the foundation of your wealth.", assetToUnlock: [], baseReward: 500, quiz: makeQuiz("7-5", [
        { question: "What's a common recommended crypto allocation?", options: ["50% or more", "1-5% of total portfolio", "100% for maximum gains", "0% — never invest in crypto"], correctIndex: 1 },
        { question: "What does 'only invest what you can afford to lose' mean for crypto?", options: ["You'll definitely lose it", "Crypto is risky enough that you should be prepared for total loss of your crypto allocation", "It's a marketing slogan with no meaning", "This advice only applies to penny stocks"], correctIndex: 1 },
        { question: "Which cryptos are considered the 'blue chips'?", options: ["Dogecoin and Shiba Inu", "Bitcoin and Ethereum", "Whatever's trending on Reddit", "All cryptos are equally reliable"], correctIndex: 1 },
        { question: "Should crypto be the foundation of an investment portfolio?", options: ["Yes — it's the future", "No — it's a high-risk satellite holding, not the core", "Only if you're under 30", "It depends on your horoscope"], correctIndex: 1 },
        { question: "Why shouldn't you let crypto dominate your emotions?", options: ["Crypto doesn't affect emotions", "Extreme volatility can trigger panic selling and FOMO buying — the same biases that destroy returns", "Emotions improve crypto trading", "Only robots should invest in crypto"], correctIndex: 1 },
        { question: "An investor puts 60% of their savings into altcoins, saying 'crypto is the future.' They lose 70% in a market crash. What principles did they violate?", options: ["None — this is normal investing", "Over-concentration (60% in one asset class), ignoring diversification, and not limiting crypto to what they could afford to lose. A 5% allocation crash would have been manageable", "They should have put 80% in crypto instead", "Crypto crashes are always temporary so the allocation was fine"], correctIndex: 1 },
      ]) },
    ],
  },
  {
    id: 8, name: "ETFs and Passive Investing", color: "hsl(190, 80%, 45%)", icon: "bar-chart-3",
    baseReward: 600, totalReward: 3000,
    lessons: [
      { id: "8-1", chapterId: 8, chapterName: "ETFs and Passive Investing", lessonNumber: 36, title: "What Is an ETF?", content: "An ETF (Exchange-Traded Fund) is a basket of assets in one ticker. Buy QQQ and you own a piece of the 100 largest NASDAQ companies. Buy GLD and you own gold exposure. ETFs are the most efficient way for most people to invest — low fees, instant diversification, easy to buy and sell like a stock.", assetToUnlock: ["QQQ", "VTI", "IWM", "TLT"], baseReward: 600, quiz: makeQuiz("8-1", [
        { question: "What is an ETF?", options: ["A single stock", "A basket of assets traded as one ticker", "A type of bond", "An exchange fee"], correctIndex: 1 },
        { question: "What does QQQ track?", options: ["S&P 500", "Top 100 NASDAQ companies", "Bond market", "Gold prices"], correctIndex: 1 },
        { question: "Why are ETFs popular?", options: ["They guarantee profits", "Low fees, instant diversification, easy to trade", "They're only for professionals", "They have no risk"], correctIndex: 1 },
        { question: "How do you buy an ETF?", options: ["Through a special ETF store", "Like buying any stock through a brokerage", "Only through a financial advisor", "You can't buy ETFs — only institutions can"], correctIndex: 1 },
        { question: "What advantage do ETFs have over picking individual stocks?", options: ["Higher guaranteed returns", "Instant diversification — one purchase gives you exposure to many assets", "No tax implications", "They always go up"], correctIndex: 1 },
        { question: "An investor can't decide between buying 30 individual tech stocks (spending weeks researching each) or buying QQQ (which holds the top 100 NASDAQ companies). They have limited time and expertise. What's the better approach and why?", options: ["Always pick individual stocks — ETFs are for lazy investors", "QQQ — it provides broader diversification, requires less research, has lower costs, and historically most stock-pickers underperform the index anyway", "There's no difference between the two approaches", "Buy both — you can't go wrong"], correctIndex: 1 },
      ]) },
      { id: "8-2", chapterId: 8, chapterName: "ETFs and Passive Investing", lessonNumber: 37, title: "Active vs Passive Investing", content: "Active investing means trying to beat the market by picking stocks. Passive investing means buying the whole market index and matching its returns. After fees, over 80% of professional fund managers fail to beat the S&P 500 over 10 years. The evidence overwhelmingly favors passive investing for most people.", assetToUnlock: [], baseReward: 600, quiz: makeQuiz("8-2", [
        { question: "What is passive investing?", options: ["Doing nothing with your money", "Buying index funds to match market returns rather than trying to beat them", "Only investing in bonds", "Letting someone else pick all your stocks"], correctIndex: 1 },
        { question: "What percentage of fund managers fail to beat the S&P 500 over 10 years?", options: ["About 20%", "About 50%", "Over 80%", "0% — all managers beat the market"], correctIndex: 2 },
        { question: "Why does passive investing tend to outperform active?", options: ["Passive investors are smarter", "Lower fees and the difficulty of consistently beating the market compound into better returns", "Markets are rigged against active managers", "Passive investing has no risk"], correctIndex: 1 },
        { question: "What is the main cost disadvantage of active funds?", options: ["No disadvantage", "Higher management fees (often 1%+ vs 0.03% for index funds)", "Higher trading costs only", "Active funds are free"], correctIndex: 1 },
        { question: "For most individual investors, what does the evidence suggest?", options: ["Active stock picking is best", "Passive index investing produces better outcomes for most people", "Neither approach works", "Everyone should hire a fund manager"], correctIndex: 1 },
        { question: "A financial advisor recommends an actively managed fund charging 1.5% annually, claiming they can 'beat the market.' An equivalent index fund charges 0.03%. Over 30 years on a $100,000 investment earning 10% before fees, what's the approximate fee difference?", options: ["A few thousand dollars", "About $50,000", "Over $200,000 in total costs and lost compounding — the fee drag is enormous over decades", "Fees don't matter over long periods"], correctIndex: 2 },
      ]) },
      { id: "8-3", chapterId: 8, chapterName: "ETFs and Passive Investing", lessonNumber: 38, title: "The Three-Fund Portfolio", content: "The simplest effective portfolio: US stocks (VTI), international stocks (VXUS), and US bonds (BND). Three funds, total global diversification, extremely low fees. Many financial advisors and academics consider this the gold standard for long-term investing. Adjust the ratio based on your age and risk tolerance.", assetToUnlock: [], baseReward: 600, quiz: makeQuiz("8-3", [
        { question: "What are the three funds in the 'three-fund portfolio'?", options: ["Apple, Google, Amazon", "US stocks, international stocks, and bonds", "Gold, silver, oil", "SPY, QQQ, and IWM"], correctIndex: 1 },
        { question: "Why is the three-fund portfolio effective?", options: ["It's the most exciting strategy", "Total global diversification at extremely low cost", "It guarantees 10% returns", "It only holds tech stocks"], correctIndex: 1 },
        { question: "What does VTI represent?", options: ["A tech company", "Total US stock market ETF", "A bond fund", "An international fund"], correctIndex: 1 },
        { question: "How should you adjust the three-fund ratio?", options: ["Never change it", "Based on age and risk tolerance — more bonds as you age", "Always equal thirds", "100% stocks regardless of age"], correctIndex: 1 },
        { question: "Why include international stocks?", options: ["They always outperform US stocks", "Geographic diversification — US won't always be the best-performing market", "International stocks are risk-free", "You shouldn't include them"], correctIndex: 1 },
        { question: "A 35-year-old implements a three-fund portfolio: 60% VTI, 25% VXUS, 15% BND. At 55, should they keep the same allocation? Why or why not?", options: ["Yes — never change your allocation", "No — as they approach retirement, they should shift toward more bonds for stability, perhaps 40% VTI, 20% VXUS, 40% BND", "They should go to 100% stocks for maximum growth", "Age doesn't affect portfolio allocation"], correctIndex: 1 },
      ]) },
      { id: "8-4", chapterId: 8, chapterName: "ETFs and Passive Investing", lessonNumber: 39, title: "Dollar-Cost Averaging", content: "Dollar-cost averaging (DCA) means investing the same amount at regular intervals regardless of price. $500 every month, no matter what. When prices are high, you buy fewer shares. When prices drop, you buy more. This removes emotion from investing and ensures you don't miss opportunities by trying to time the market.", assetToUnlock: [], baseReward: 600, quiz: makeQuiz("8-4", [
        { question: "What is dollar-cost averaging?", options: ["Investing everything at once", "Investing a fixed amount at regular intervals", "Only buying when prices drop", "Averaging your gains and losses"], correctIndex: 1 },
        { question: "When prices drop during DCA, what happens?", options: ["You lose money permanently", "You buy more shares with your fixed amount, lowering your average cost", "You stop investing", "Nothing changes"], correctIndex: 1 },
        { question: "What's the main emotional benefit of DCA?", options: ["It guarantees profits", "Removes the stress of trying to time the market", "It makes investing exciting", "It eliminates all risk"], correctIndex: 1 },
        { question: "How often should you invest with DCA?", options: ["Only during crashes", "At regular intervals — monthly is common", "Whenever you feel like it", "Once per year at most"], correctIndex: 1 },
        { question: "Does DCA guarantee better returns than investing a lump sum?", options: ["Yes — always", "No — lump sum often beats DCA, but DCA reduces the psychological risk of investing everything at a peak", "DCA always underperforms", "They're exactly the same"], correctIndex: 1 },
        { question: "You have $12,000 to invest. You're nervous about a market crash. You decide to invest $1,000/month for 12 months. In month 3, markets drop 20%. How does DCA help you here?", options: ["It doesn't — you should have waited for the crash", "Your month 3-5 investments buy more shares at lower prices, improving your overall average cost. Without DCA, you might have panicked and invested nothing", "DCA prevented any losses", "You should have invested all $12,000 in month 3"], correctIndex: 1 },
      ]) },
      { id: "8-5", chapterId: 8, chapterName: "ETFs and Passive Investing", lessonNumber: 40, title: "Bond ETFs", content: "Bonds are loans to governments or companies. Bond ETFs like TLT (long-term US Treasury bonds) package many bonds together. When interest rates rise, bond prices fall. When rates fall, bonds rise. Bonds provide stability and income to a portfolio. They're the 'seatbelt' that softens crashes.", assetToUnlock: [], baseReward: 600, quiz: makeQuiz("8-5", [
        { question: "What is a bond?", options: ["Ownership of a company", "A loan to a government or company that pays interest", "A type of stock", "A cryptocurrency"], correctIndex: 1 },
        { question: "What happens to bond prices when interest rates rise?", options: ["They go up", "They go down", "They stay the same", "Bonds don't have prices"], correctIndex: 1 },
        { question: "What does TLT track?", options: ["Tech stocks", "Long-term US Treasury bonds", "Gold prices", "The S&P 500"], correctIndex: 1 },
        { question: "Why are bonds called the 'seatbelt' of a portfolio?", options: ["They speed up your returns", "They provide stability and cushion stock market crashes", "They're uncomfortable but required", "Bonds are risky"], correctIndex: 1 },
        { question: "What's the relationship between interest rates and bond ETFs?", options: ["No relationship", "Inverse — rates up means bond prices down, and vice versa", "They move in the same direction", "Interest rates don't affect bonds"], correctIndex: 1 },
        { question: "The Federal Reserve raises interest rates aggressively. TLT drops 30% in a year. Your friend says 'bonds are supposed to be safe — this proves they're not!' How would you explain what happened?", options: ["Your friend is right — bonds are as risky as stocks", "Bond prices and interest rates are inversely related. TLT holds long-duration bonds, which are most sensitive to rate changes. They're still 'safe' in that they'll repay principal at maturity, but their prices fluctuate with rate policy", "The Fed made a mistake — bonds can't lose value", "TLT is broken — buy a different bond fund"], correctIndex: 1 },
      ]) },
    ],
  },
  {
    id: 9, name: "Advanced Concepts", color: "hsl(15, 80%, 55%)", icon: "target",
    baseReward: 800, totalReward: 4000,
    lessons: [
      { id: "9-1", chapterId: 9, chapterName: "Advanced Concepts", lessonNumber: 41, title: "Short Selling", content: "Short selling is borrowing a stock, selling it immediately, and hoping to buy it back cheaper later. If a stock goes from $100 to $50, you profit $50 per share. But if it goes to $200, you lose $100 per share — with theoretically unlimited downside. Short selling is dangerous for beginners and should be avoided until you're experienced.", assetToUnlock: ["JPM", "GS", "V", "MA", "BLK", "JNJ", "PFE", "UNH", "XOM", "CVX"], baseReward: 800, quiz: makeQuiz("9-1", [
        { question: "What is short selling?", options: ["Selling a stock you own", "Borrowing and selling a stock hoping to buy it back cheaper", "Selling options", "Trading for short periods"], correctIndex: 1 },
        { question: "What's the maximum loss on a short position?", options: ["The stock price", "Your initial investment", "Theoretically unlimited — there's no cap on how high a stock can go", "50% of your investment"], correctIndex: 2 },
        { question: "If you short a stock at $100 and it drops to $60, what's your profit per share?", options: ["$60", "$100", "$40", "$160"], correctIndex: 2 },
        { question: "Why is short selling risky for beginners?", options: ["It's too complicated", "Unlimited potential losses and requires borrowing, margin, and precise timing", "It's illegal", "Short selling is actually very safe"], correctIndex: 1 },
        { question: "What happens if a stock you shorted goes up significantly?", options: ["You profit from the rise", "You face mounting losses and may be forced to cover (buy back) at a much higher price", "Nothing — you can wait forever", "The broker absorbs the loss"], correctIndex: 1 },
        { question: "You short 100 shares of GameStop at $20. A short squeeze happens and it rockets to $400. What is your loss, and what lesson does this teach about short selling?", options: ["$2,000 loss — manageable", "$38,000 loss ($380 × 100) — this demonstrates that short selling has unlimited downside. A stock can theoretically go to infinity, making short losses potentially catastrophic", "No loss — short squeezes don't affect short sellers", "$0 — your broker would have stopped the loss"], correctIndex: 1 },
      ]) },
      { id: "9-2", chapterId: 9, chapterName: "Advanced Concepts", lessonNumber: 42, title: "Options Simply Explained", content: "An option gives you the right (but not obligation) to buy or sell a stock at a specific price before a certain date. Think of it like a deposit on a house — you pay a small amount to lock in the right to purchase at an agreed price. If the deal looks bad, you walk away and lose only the deposit. Options amplify gains but can expire worthless.", assetToUnlock: [], baseReward: 800, quiz: makeQuiz("9-2", [
        { question: "What is a stock option?", options: ["A stock you must buy", "The right but not obligation to buy or sell at a specific price", "A type of bond", "A guaranteed profit instrument"], correctIndex: 1 },
        { question: "What's the most you can lose buying a call option?", options: ["Unlimited", "The stock's full price", "The premium (price) you paid for the option", "50% of the option's value"], correctIndex: 2 },
        { question: "How are options like a house deposit?", options: ["They're not similar at all", "You pay a small amount to lock in the right to buy at an agreed price — if things change, you walk away losing only the deposit", "Both are guaranteed investments", "You always have to complete the purchase"], correctIndex: 1 },
        { question: "What happens when an option expires 'out of the money'?", options: ["You get your money back", "It becomes worthless — you lose the premium paid", "It automatically converts to stock", "The broker extends the expiration"], correctIndex: 1 },
        { question: "Why are options considered advanced?", options: ["They're simple — everyone should use them", "Time decay, leverage, and complexity create significant risk of total loss", "They're the safest investment", "Options are just like stocks"], correctIndex: 1 },
        { question: "You pay $5 per share for a call option on a $100 stock with a strike price of $105, expiring in 30 days. The stock goes to $95. What happens?", options: ["You make $5 profit", "Your option expires worthless — the stock never reached $105. You lose the $5 premium (100%). This is why options are risky — total loss is common", "You can exercise at $95 for a discount", "Options can't expire worthless"], correctIndex: 1 },
      ]) },
      { id: "9-3", chapterId: 9, chapterName: "Advanced Concepts", lessonNumber: 43, title: "Leverage", content: "Leverage means borrowing money to invest more than you have. If you have $10,000 and use 2x leverage, you invest $20,000 — doubling both gains and losses. Margin calls happen when losses reach a threshold and your broker forces you to add money or sells your assets. Leverage is the fastest way to blow up a portfolio.", assetToUnlock: [], baseReward: 800, quiz: makeQuiz("9-3", [
        { question: "What is leverage in investing?", options: ["Using physical leverage", "Borrowing money to amplify your investment", "A risk-free strategy", "A type of ETF"], correctIndex: 1 },
        { question: "With 2x leverage on $10,000, a 10% gain becomes:", options: ["$1,000 (10%)", "$2,000 (20%)", "$500 (5%)", "$10,000 (100%)"], correctIndex: 1 },
        { question: "What is a margin call?", options: ["A phone call from your broker to congratulate you", "A demand to add funds when losses reach a threshold, or face forced selling", "A type of stock order", "A fee for using margin"], correctIndex: 1 },
        { question: "With 2x leverage, a 50% market drop wipes out:", options: ["25% of your money", "50% of your money", "100% of your money — your entire investment", "Nothing — leverage protects against losses"], correctIndex: 2 },
        { question: "Why do experts warn beginners against leverage?", options: ["It's too profitable", "Amplified losses can destroy a portfolio faster than gains can build it", "Leverage is illegal for individuals", "It's too complicated to set up"], correctIndex: 1 },
        { question: "An investor uses 5x leverage on a $20,000 portfolio, controlling $100,000 in assets. The market drops 20%. What happens to their actual money?", options: ["They lose $4,000 (20%)", "They lose $20,000 — their ENTIRE capital is wiped out (20% × 5x = 100% loss). They may even owe money beyond their initial investment", "Leverage limits losses to the original $20,000", "The broker absorbs leverage losses"], correctIndex: 1 },
      ]) },
      { id: "9-4", chapterId: 9, chapterName: "Advanced Concepts", lessonNumber: 44, title: "Market Makers", content: "Market makers are firms that always stand ready to buy and sell, providing liquidity. They profit from the spread — buying at the bid and selling at the ask. Without market makers, you might not find a buyer when you want to sell. Firms like Citadel Securities and Virtu Financial handle billions of shares daily, making markets function smoothly.", assetToUnlock: [], baseReward: 800, quiz: makeQuiz("9-4", [
        { question: "What do market makers do?", options: ["Set stock prices arbitrarily", "Stand ready to buy and sell, providing liquidity to markets", "Only sell stocks, never buy", "Create new stocks for companies"], correctIndex: 1 },
        { question: "How do market makers profit?", options: ["By predicting market direction", "From the spread — buying at bid and selling at ask", "Government subsidies", "They don't profit — it's a public service"], correctIndex: 1 },
        { question: "Why are market makers important?", options: ["They're not important", "They ensure you can always find a buyer or seller for your trades", "They guarantee stock prices go up", "They only matter for institutional traders"], correctIndex: 1 },
        { question: "Name a major market maker firm.", options: ["Apple", "Citadel Securities or Virtu Financial", "The Federal Reserve", "Robinhood"], correctIndex: 1 },
        { question: "What would happen without market makers?", options: ["Markets would be more efficient", "Stocks could be harder to buy and sell, with wider spreads and less reliable pricing", "Nothing would change", "Stock prices would be more stable"], correctIndex: 1 },
        { question: "You want to sell a stock immediately. The bid-ask spread is $0.01 (very tight). On another stock, the spread is $0.50. What role did market makers play, and which stock would cost more to trade?", options: ["Market makers don't affect spreads", "Active market making on the first stock created tight spreads (low cost to trade). The second stock likely has fewer market makers, so you 'pay' $0.50 per share to cross the spread", "Both cost the same to trade", "Wider spreads are better for traders"], correctIndex: 1 },
      ]) },
      { id: "9-5", chapterId: 9, chapterName: "Advanced Concepts", lessonNumber: 45, title: "Stock Splits", content: "A stock split divides existing shares into more shares at a proportionally lower price. If a $1,000 stock does a 10:1 split, you now have 10 shares at $100 each. Your total value doesn't change. Splits are cosmetic but often trigger price bumps because the stock becomes more accessible to small investors. Apple's 2020 4:1 split is a famous recent example.", assetToUnlock: [], baseReward: 800, quiz: makeQuiz("9-5", [
        { question: "What is a stock split?", options: ["Dividing a company in two", "Dividing shares into more shares at a lower price per share", "Selling half your shares", "A type of dividend"], correctIndex: 1 },
        { question: "After a 4:1 split, if you had 10 shares at $400, you now have:", options: ["10 shares at $100", "40 shares at $100", "40 shares at $400", "10 shares at $400"], correctIndex: 1 },
        { question: "Does a stock split change the total value of your position?", options: ["Yes — it doubles your money", "No — same total value, just more shares at a lower price", "Yes — you lose half your value", "It depends on the market"], correctIndex: 1 },
        { question: "Why do companies do stock splits?", options: ["To raise money", "To make shares more accessible and affordable to retail investors", "Government requirement", "To reduce their market cap"], correctIndex: 1 },
        { question: "Why do stock prices sometimes rise after a split announcement?", options: ["The company becomes more valuable", "Increased accessibility, positive sentiment, and perception of growth potential attract new buyers", "Splits create real value", "Market manipulation"], correctIndex: 1 },
        { question: "Apple's stock was at $500 before its 2020 4:1 split. After the split, the stock price was $125. Nothing about Apple's business changed. Why did the stock go up 30% in the weeks after the split?", options: ["The company became 4x more valuable", "Lower price attracted more retail buyers, and the split signaled management confidence. The rally was driven by sentiment and accessibility, not fundamentals — showing that markets aren't always perfectly rational", "Stock splits always cause 30% gains", "Apple released a new product that day"], correctIndex: 1 },
      ]) },
    ],
  },
  {
    id: 10, name: "Thinking Long Term", color: "hsl(200, 90%, 50%)", icon: "award",
    baseReward: 1000, totalReward: 5000,
    lessons: [
      { id: "10-1", chapterId: 10, chapterName: "Thinking Long Term", lessonNumber: 46, title: "Compound Growth", content: "$1,000 invested at 10% per year becomes $2,594 after 10 years, $6,727 after 20 years, and $17,449 after 30 years. That's the magic of compound growth — your gains earn gains. Einstein reportedly called it the 8th wonder of the world. The most important variable isn't your return rate — it's time. Start early.", assetToUnlock: ["VXX", "SOL-USD", "BNB-USD", "XRP-USD", "ADA-USD", "AVAX-USD", "DOT-USD", "LINK-USD", "DOGE-USD"], baseReward: 1000, quiz: makeQuiz("10-1", [
        { question: "$1,000 at 10% for 30 years becomes approximately:", options: ["$3,000", "$10,000", "$17,449", "$100,000"], correctIndex: 2 },
        { question: "What is the key to compound growth?", options: ["High returns only", "Time — the longer you're invested, the more compounding works for you", "Timing the market perfectly", "Leverage"], correctIndex: 1 },
        { question: "Why did Einstein call compound interest 'the 8th wonder of the world'?", options: ["He was being sarcastic", "The exponential growth of reinvested returns creates extraordinary wealth over time", "He invested in crypto", "It was about physics, not finance"], correctIndex: 1 },
        { question: "A 25-year-old and 45-year-old both invest $500/month at 10%. Who benefits more from compounding?", options: ["The 45-year-old — they're wiser", "The 25-year-old — 20 extra years of compounding creates dramatically more wealth", "Both benefit equally", "Neither — compounding is a myth"], correctIndex: 1 },
        { question: "What's more important: return rate or time invested?", options: ["Return rate — always chase the highest returns", "Time — consistent investing over decades beats chasing returns", "They're equally important", "Neither matters"], correctIndex: 1 },
        { question: "Investor A starts investing $200/month at age 25 and stops at 35 (10 years, $24,000 total). Investor B starts at 35 and invests $200/month until 65 (30 years, $72,000 total). At 10% returns, who has more at 65 and why?", options: ["Investor B — they invested 3x more money", "Investor A likely has more or similar — those extra 10 years of early compounding gave their money 30 additional years to grow. This demonstrates that WHEN you start matters more than HOW MUCH you invest", "They end up exactly equal", "There's no way to calculate this"], correctIndex: 1 },
      ]) },
      { id: "10-2", chapterId: 10, chapterName: "Thinking Long Term", lessonNumber: 47, title: "How Taxes Affect Returns", content: "When you sell investments at a profit, you owe capital gains tax. Short-term gains (held less than 1 year) are taxed as regular income — up to 37%. Long-term gains (held over 1 year) are taxed at 0-20%. This difference is enormous. Holding investments longer isn't just good strategy — it's tax efficient.", assetToUnlock: [], baseReward: 1000, quiz: makeQuiz("10-2", [
        { question: "What is capital gains tax?", options: ["A fee paid to your broker", "Tax on profit from selling investments", "A penalty for losing money", "A tax on dividend income only"], correctIndex: 1 },
        { question: "How is short-term capital gains (less than 1 year) taxed?", options: ["0%", "15%", "As ordinary income — up to 37%", "Tax-free"], correctIndex: 2 },
        { question: "How is long-term capital gains (over 1 year) taxed?", options: ["As ordinary income", "0-20% — significantly lower than short-term rates", "50%", "The same as short-term"], correctIndex: 1 },
        { question: "Why does the holding period matter for tax purposes?", options: ["It doesn't", "Holding over 1 year qualifies for much lower tax rates, potentially saving thousands", "You avoid all taxes if you hold long enough", "Taxes are the same regardless of holding period"], correctIndex: 1 },
        { question: "How does tax consideration support long-term investing?", options: ["It doesn't affect strategy", "Lower tax rates on long-term holds mean more money stays invested and compounds", "Short-term trading is more tax efficient", "Taxes only apply to retirement accounts"], correctIndex: 1 },
        { question: "You bought a stock 11 months ago. It's up 30% and you're thinking of selling. If you wait 1 more month, how does this affect your tax bill (assuming you're in the 35% tax bracket)?", options: ["No difference — timing doesn't affect taxes", "Selling now: ~35% tax on gains. Waiting 1 month: ~15-20% tax on gains. On a $3,000 gain, you'd save $450-600 by waiting one month — a significant incentive to hold", "You should always sell immediately regardless of taxes", "Capital gains tax doesn't apply to individual investors"], correctIndex: 1 },
      ]) },
      { id: "10-3", chapterId: 10, chapterName: "Thinking Long Term", lessonNumber: 48, title: "Portfolio Rebalancing", content: "Over time, your portfolio drifts from its target allocation. If you started with 70% stocks and 30% bonds, a bull market might push you to 85/15. Rebalancing means selling some winners and buying more of the laggards to return to your target. Do it once a year or when allocations drift more than 5% from targets.", assetToUnlock: [], baseReward: 1000, quiz: makeQuiz("10-3", [
        { question: "What is portfolio rebalancing?", options: ["Selling everything and starting over", "Adjusting your portfolio back to its target allocation", "Only buying more stocks", "Changing your broker"], correctIndex: 1 },
        { question: "Why does a portfolio drift from its target?", options: ["Brokers change it", "Different assets grow at different rates, shifting your allocation", "It doesn't — allocations stay fixed", "Taxes cause drift"], correctIndex: 1 },
        { question: "How often should you typically rebalance?", options: ["Daily", "Once a year or when allocations drift more than 5%", "Every trade", "Never — let it ride"], correctIndex: 1 },
        { question: "Rebalancing involves selling winners and buying laggards. Why?", options: ["Winners always become losers", "To return to your risk-appropriate target — you're systematically buying low and selling high", "It's a superstition", "To avoid capital gains taxes"], correctIndex: 1 },
        { question: "What risk does NOT rebalancing create?", options: ["No risk at all", "Your portfolio becomes increasingly concentrated in whatever performed best, potentially taking on more risk than intended", "Your portfolio automatically rebalances", "Not rebalancing improves returns"], correctIndex: 1 },
        { question: "Your target: 60% stocks, 40% bonds. After a great stock year, you're at 80% stocks, 20% bonds. What should you do and what does this mean for risk?", options: ["Celebrate — stocks did well", "Rebalance: sell some stocks, buy more bonds to return to 60/40. At 80/20, you're taking significantly more risk than intended — a stock crash now would hit much harder than your target allocation allows", "Go to 100% stocks since they're winning", "Ignore it — allocation doesn't matter"], correctIndex: 1 },
      ]) },
      { id: "10-4", chapterId: 10, chapterName: "Thinking Long Term", lessonNumber: 49, title: "Reading Financial News Without Being Manipulated", content: "Financial media is designed to generate clicks and views, not to help you invest wisely. Headlines trigger fear and greed. 'MARKET CRASH IMMINENT' and 'THIS STOCK WILL 10X' are designed to make you emotional, not informed. Filter for signal: focus on earnings data, economic indicators, and long-term trends. Ignore daily noise.", assetToUnlock: [], baseReward: 1000, quiz: makeQuiz("10-4", [
        { question: "Why are financial media headlines often misleading?", options: ["They're not — trust all headlines", "They're designed to trigger emotional reactions for clicks, not to help you invest wisely", "Journalists are always wrong", "Headlines are government-regulated for accuracy"], correctIndex: 1 },
        { question: "What should you focus on instead of clickbait headlines?", options: ["Social media influencer tips", "Earnings data, economic indicators, and long-term trends", "Whatever generates the most fear", "Only news that confirms your existing positions"], correctIndex: 1 },
        { question: "What emotions do financial headlines typically try to trigger?", options: ["Calmness and patience", "Fear and greed — the two most powerful drivers of poor investment decisions", "Boredom", "Confusion"], correctIndex: 1 },
        { question: "What is 'daily noise' in investing?", options: ["Important market signals", "Short-term price moves and sensational headlines that don't affect long-term outcomes", "Trading volume data", "Economic indicators"], correctIndex: 1 },
        { question: "How can you protect yourself from media manipulation?", options: ["Stop investing entirely", "Have a written plan, focus on fundamentals, and resist the urge to act on emotional headlines", "Only read one news source", "Trade more to compensate for bad news"], correctIndex: 1 },
        { question: "A headline screams: 'WORST MARKET CRASH IN DECADES!' The actual data shows the S&P 500 dropped 3% — its fourth such drop this year. How should you interpret this?", options: ["Sell everything — the headline says crash", "The headline exaggerated a normal 3% pullback to generate fear and clicks. A 3% drop is routine — happens several times per year. This is media manipulation, not actionable information", "3% drops always lead to bigger crashes", "If the headline says crash, it must be one"], correctIndex: 1 },
      ]) },
      { id: "10-5", chapterId: 10, chapterName: "Thinking Long Term", lessonNumber: 50, title: "Building Your Investment Philosophy", content: "Every great investor has a philosophy — a set of principles they follow consistently. Yours should define: your risk tolerance, time horizon, target asset allocation, rules for when to buy and sell, how often you'll check your portfolio, and what you won't do. Write it down. Revisit it yearly. The best investors have discipline, patience, and consistency. Not luck, not genius — consistency.", assetToUnlock: [], baseReward: 1000, quiz: makeQuiz("10-5", [
        { question: "Why should you have a written investment philosophy?", options: ["It's a legal requirement", "It provides discipline and prevents emotional decision-making during market stress", "Written plans don't help", "Only professionals need one"], correctIndex: 1 },
        { question: "What should your investment philosophy include?", options: ["Only which stocks to buy", "Risk tolerance, time horizon, asset allocation, buy/sell rules, and behavioral guidelines", "Just your target return", "A prediction of where markets will go"], correctIndex: 1 },
        { question: "How often should you revisit your philosophy?", options: ["Never — set it and forget it forever", "Annually — to ensure it still matches your life circumstances", "Daily", "After every trade"], correctIndex: 1 },
        { question: "What separates great investors from average ones?", options: ["Genius-level stock picking", "Discipline, patience, and consistency over long periods", "Access to insider information", "Trading more frequently than others"], correctIndex: 1 },
        { question: "Why is defining 'what you won't do' important in a philosophy?", options: ["It's not important", "It creates boundaries that prevent destructive behaviors like panic selling and FOMO buying", "Only to limit taxes", "It reduces the number of trades"], correctIndex: 1 },
        { question: "You've completed all 50 lessons. You've learned about stocks, bonds, commodities, crypto, behavioral biases, and risk management. Now you're building your philosophy. What's the single most important thing to include?", options: ["A promise to check your portfolio hourly", "A commitment to consistency — regular investing, staying the course during crashes, rebalancing annually, and never letting emotions override your plan", "A list of hot stocks to buy", "A target to beat the market every year"], correctIndex: 1 },
      ]) },
    ],
  },
];

export const chapters = chaptersData;
export const allLessons: Lesson[] = chaptersData.flatMap(c => c.lessons);
export const getLessonById = (id: string) => allLessons.find(l => l.id === id);
export const getChapterById = (id: number) => chaptersData.find(c => c.id === id);

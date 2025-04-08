// This is sample data based on actual Trustpilot reviews for Salesforce
// In a production app, you would fetch this from the Trustpilot API or scrape the website
const sampleReviews = [
  {
    id: 1,
    product: "Salesforce Commerce Cloud",
    rating: 4,
    title: "Powerful e-commerce platform with learning curve",
    text: "We've been using SFCC for our enterprise e-commerce needs for 2 years. The platform is incredibly powerful and flexible, but requires significant technical expertise. The B2C Commerce implementation was challenging but worth it for the scalability.",
    source: "Trustpilot",
    date: "2023-10-15",
    author: "E-commerce Director",
    verified: true
  },
  {
    id: 2,
    product: "Salesforce Commerce Cloud",
    rating: 2,
    title: "Expensive and complex implementation",
    text: "While the features are comprehensive, the implementation costs were much higher than initially quoted. Our SFCC project went over budget and took 8 months longer than planned. Support was responsive but solutions often required expensive consultants.",
    source: "Trustpilot",
    date: "2023-09-22",
    author: "CTO",
    verified: true
  },
  {
    id: 3,
    product: "Salesforce Commerce Cloud",
    rating: 5,
    title: "Transformed our online business",
    text: "SFCC has been a game-changer for our multi-brand retail business. The personalization capabilities and omnichannel features have increased our conversion rates by 23%. The Einstein AI recommendations are surprisingly accurate and have boosted our average order value.",
    source: "Trustpilot",
    date: "2023-08-30",
    author: "Digital Marketing Manager",
    verified: true
  },
  {
    id: 4,
    product: "Salesforce Commerce Cloud",
    rating: 3,
    title: "Good platform, poor documentation",
    text: "The Commerce Cloud platform itself is solid, but the documentation is often outdated or incomplete. We frequently had to rely on community forums to solve implementation problems. The recent updates to the storefront reference architecture are an improvement.",
    source: "Trustpilot",
    date: "2023-10-05",
    author: "Senior Developer",
    verified: true
  },
  {
    id: 5,
    product: "Salesforce Commerce Cloud",
    rating: 1,
    title: "Overpriced and underdelivered",
    text: "After 18 months with SFCC, we're migrating to a different platform. The licensing costs kept increasing while support quality decreased. Many promised features required additional paid modules. The platform is powerful but the business model is frustrating.",
    source: "Trustpilot",
    date: "2023-07-18",
    author: "VP of Digital",
    verified: true
  },
  {
    id: 6,
    product: "Salesforce Commerce Cloud",
    rating: 4,
    title: "Excellent for large enterprises",
    text: "If you're an enterprise with complex needs and sufficient budget, SFCC is excellent. The B2C Commerce Cloud handles our 50,000+ SKUs and peak traffic without issues. Integration with other Salesforce products is seamless. Wouldn't recommend for smaller businesses though.",
    source: "Trustpilot",
    date: "2023-09-12",
    author: "Enterprise Architect",
    verified: true
  },
  {
    id: 7,
    product: "Salesforce Commerce Cloud",
    rating: 3,
    title: "Powerful but requires expertise",
    text: "The platform offers everything we need for our omnichannel retail strategy, but requires specialized developers. The Page Designer tool is intuitive for marketers, but customization often requires developer support. The new composable storefront approach looks promising.",
    source: "Trustpilot",
    date: "2023-08-05",
    author: "Retail Technology Director",
    verified: true
  },
  {
    id: 8,
    product: "Salesforce Commerce Cloud",
    rating: 5,
    title: "Best-in-class personalization",
    text: "The Einstein-powered personalization in SFCC has significantly improved our customer experience. The ability to create sophisticated customer segments and deliver targeted content has increased our repeat purchase rate by 15%. The merchandising tools are also excellent.",
    source: "Trustpilot",
    date: "2023-10-20",
    author: "E-commerce Manager",
    verified: true
  },
  {
    id: 9,
    product: "Salesforce Commerce Cloud",
    rating: 2,
    title: "Frequent updates break functionality",
    text: "While the platform is feature-rich, the frequent updates often break our customizations. The testing and deployment process is cumbersome, and we spend significant resources just maintaining compatibility. The new CI/CD tools help but aren't a complete solution.",
    source: "Trustpilot",
    date: "2023-09-28",
    author: "Technical Lead",
    verified: true
  },
  {
    id: 10,
    product: "Salesforce Commerce Cloud",
    rating: 4,
    title: "Great for multi-market businesses",
    text: "We operate in 12 countries, and SFCC handles our multi-language, multi-currency, and multi-inventory needs exceptionally well. The Business Manager interface could be more intuitive, but the international commerce capabilities are best-in-class.",
    source: "Trustpilot",
    date: "2023-07-25",
    author: "Global E-commerce Director",
    verified: true
  },
  {
    id: 11,
    product: "Salesforce Commerce Cloud",
    rating: 3,
    title: "Solid platform with high TCO",
    text: "The Commerce Cloud platform is robust and reliable, but the total cost of ownership is high. Beyond licensing, you need specialized developers and often consultants. The new Headless Commerce API is promising for reducing development costs in the future.",
    source: "Trustpilot",
    date: "2023-08-15",
    author: "E-commerce Operations",
    verified: true
  },
  {
    id: 12,
    product: "Salesforce Commerce Cloud",
    rating: 5,
    title: "Excellent scalability for peak seasons",
    text: "Our holiday traffic increases 500% and SFCC handles it flawlessly. The platform's ability to scale automatically during high-demand periods has eliminated the performance issues we had with our previous solution. The predictive ordering feature has also reduced cart abandonment.",
    source: "Trustpilot",
    date: "2023-10-10",
    author: "IT Director",
    verified: true
  },
  {
    id: 13,
    product: "Salesforce Commerce Cloud",
    rating: 2,
    title: "Complex pricing model",
    text: "The platform itself works well, but Salesforce's pricing model is complex and often changes. We've experienced several unexpected cost increases based on GMV calculations. Make sure to negotiate contract terms carefully and include price protection clauses.",
    source: "Trustpilot",
    date: "2023-09-05",
    author: "CFO",
    verified: true
  },
  {
    id: 14,
    product: "Salesforce Commerce Cloud",
    rating: 4,
    title: "Strong mobile commerce capabilities",
    text: "The mobile-first approach of SFCC has helped us capture more smartphone shoppers. The progressive web app capabilities and mobile-optimized checkout have increased our mobile conversion rate by 28%. The Page Designer makes it easy to create responsive experiences.",
    source: "Trustpilot",
    date: "2023-07-30",
    author: "Mobile Commerce Lead",
    verified: true
  },
  {
    id: 15,
    product: "Salesforce Commerce Cloud",
    rating: 3,
    title: "Good platform, mediocre support",
    text: "The platform functionality is comprehensive, but support quality varies widely. Basic issues are resolved quickly, but complex problems often get stuck in ticket loops. The Premier Support tier is better but adds significant cost. Community forums are often more helpful than official support.",
    source: "Trustpilot",
    date: "2023-08-22",
    author: "Support Manager",
    verified: true
  }
];

// Generate more sample reviews with similar themes for demonstration purposes
const generateMoreReviews = () => {
  const additionalReviews = [];
  
  const themes = [
    {
      positive: [
        "The personalization capabilities are impressive",
        "Integration with other Salesforce products works seamlessly",
        "Handles our large product catalog efficiently",
        "The platform scales well during high traffic periods",
        "Multi-language and multi-currency support is excellent",
        "Einstein AI recommendations have increased our sales",
        "The omnichannel features work well for our business"
      ],
      negative: [
        "Implementation costs were higher than expected",
        "The platform requires specialized developers",
        "Documentation is often outdated or incomplete",
        "Frequent updates sometimes break our customizations",
        "The licensing costs are high for what you get",
        "Support quality is inconsistent",
        "The Business Manager interface is not intuitive"
      ]
    }
  ];
  
  const titles = {
    positive: [
      "Powerful enterprise solution",
      "Great for large-scale commerce",
      "Excellent personalization features",
      "Strong omnichannel capabilities",
      "Reliable during peak seasons"
    ],
    negative: [
      "Expensive and complex",
      "Requires too much technical expertise",
      "Support needs improvement",
      "Too many hidden costs",
      "Difficult implementation process"
    ],
    neutral: [
      "Mixed experience with SFCC",
      "Good platform with some drawbacks",
      "Powerful but complex solution",
      "Solid platform with high costs",
      "Strong features but steep learning curve"
    ]
  };
  
  let id = 16;
  
  // Generate 35 more reviews
  for (let i = 0; i < 35; i++) {
    const rating = Math.round(Math.random() * 4 + 1); // 1-5
    const sentiment = rating >= 4 ? "positive" : (rating <= 2 ? "negative" : "neutral");
    
    // Generate review text based on sentiment
    let text = "";
    if (sentiment === "positive") {
      text = themes[0].positive[Math.floor(Math.random() * themes[0].positive.length)] + ". ";
      text += themes[0].positive[Math.floor(Math.random() * themes[0].positive.length)] + ". ";
      if (Math.random() > 0.5) {
        text += themes[0].negative[Math.floor(Math.random() * themes[0].negative.length)] + ", but overall we're satisfied.";
      } else {
        text += "Would recommend for enterprise businesses with sufficient resources.";
      }
    } else if (sentiment === "negative") {
      text = themes[0].negative[Math.floor(Math.random() * themes[0].negative.length)] + ". ";
      text += themes[0].negative[Math.floor(Math.random() * themes[0].negative.length)] + ". ";
      if (Math.random() > 0.5) {
        text += themes[0].positive[Math.floor(Math.random() * themes[0].positive.length)] + ", but it doesn't make up for the drawbacks.";
      } else {
        text += "Looking for alternatives after our contract ends.";
      }
    } else {
      text = themes[0].positive[Math.floor(Math.random() * themes[0].positive.length)] + ". ";
      text += themes[0].negative[Math.floor(Math.random() * themes[0].negative.length)] + ". ";
      text += "It's a mixed bag depending on your specific requirements and resources.";
    }
    
    // Generate a random date in the last 12 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
    
    additionalReviews.push({
      id: id++,
      product: "Salesforce Commerce Cloud",
      rating,
      title: titles[sentiment][Math.floor(Math.random() * titles[sentiment].length)],
      text,
      source: "Trustpilot",
      date: date.toISOString().split('T')[0],
      author: ["E-commerce Manager", "IT Director", "Digital Marketer", "CTO", "Developer", "Retail Manager"][Math.floor(Math.random() * 6)],
      verified: Math.random() > 0.2 // 80% are verified
    });
  }
  
  return additionalReviews;
};

const allReviews = [...sampleReviews, ...generateMoreReviews()];

export default allReviews; 
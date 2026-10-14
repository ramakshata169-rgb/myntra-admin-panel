
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8787;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
  ]
}));

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    configured: true,
    mode: "free-local-recommendations"
  });
});

// Helpers for catalogue matching
function getProduct(p) {
  return {
    id: String(p.id ?? p.productId ?? p._id ?? ""),
    name: String(p.name ?? p.title ?? p.productName ?? "Fashion item"),
    category: String(p.category ?? ""),
    price: Number(p.price ?? p.productPrice) || 0,
    description: String(p.description ?? ""),
    audience: String(p.audience ?? p.gender ?? p.targetAudience ?? "")
  };
}

function productText(p) {
  return (
    p.name + " " +
    p.category + " " +
    p.description + " " +
    p.audience
  ).toLowerCase();
}

function audienceMatch(p, audience) {
  const wanted = String(audience || "Any").toLowerCase();
  const text = productText(p);

  if (
    wanted === "any" ||
    wanted === "everyone" ||
    !wanted.trim()
  ) {
    return true;
  }

  const isWomen = /\b(women|woman|womens|ladies|female|girls|girl)\b/.test(text);
  const isMen = /\b(men|mens|male|boys|boy)\b/.test(text);

  if (wanted.includes("women") || wanted.includes("female")) {
    return isWomen && !isMen;
  }

  if (wanted.includes("men") || wanted.includes("male")) {
    return isMen && !isWomen;
  }

  if (wanted.includes("kids") || wanted.includes("children")) {
    return /\b(kids|children|child|boys|girls)\b/.test(text);
  }

  // Don't exclude products if their audience is not specified.
  return true;
}

function styleScore(p, style, occasion, notes) {
  const text = productText(p);
  const preferences = [
    style,
    occasion,
    ...(String(notes || "").split(/[,;]+/))
  ].filter(Boolean);

  let score = 0;

  for (const preference of preferences) {
    const words = String(preference)
      .toLowerCase()
      .split(/[\s-]+/)
      .filter(word => word.length > 2);

    for (const word of words) {
      if (text.includes(word)) score += 2;
    }
  }

  const chosenStyle = String(style || "").toLowerCase();

  if (
    chosenStyle.includes("ethnic") &&
    /\b(kurta|kurti|saree|sari|lehenga|salwar|ethnic|anarkali|dupatta)\b/.test(text)
  ) score += 8;

  if (
    chosenStyle.includes("casual") &&
    /\b(t-shirt|tshirt|jeans|casual|sneakers|top)\b/.test(text)
  ) score += 5;

  if (
    chosenStyle.includes("formal") &&
    /\b(formal|blazer|trousers|shirt|office)\b/.test(text)
  ) score += 5;

  if (
    chosenStyle.includes("western") &&
    /\b(dress|jeans|top|gown|skirt|western)\b/.test(text)
  ) score += 5;

  return score;
}

function itemRole(p) {
  const text = productText(p);

  if (/\b(saree|sari|lehenga|kurta|kurti|dress|gown|anarkali)\b/.test(text)) {
    return "Main outfit";
  }

  if (/\b(jeans|trousers|pants|leggings|skirt|shorts)\b/.test(text)) {
    return "Bottom wear";
  }

  if (/\b(shoes|sneakers|sandals|heels|footwear)\b/.test(text)) {
    return "Footwear";
  }

  if (/\b(bag|handbag|clutch|purse)\b/.test(text)) {
    return "Accessory";
  }

  if (/\b(earrings|necklace|bracelet|jewellery|jewelry)\b/.test(text)) {
    return "Jewellery";
  }

  if (/\b(dupatta|scarf|stole)\b/.test(text)) {
    return "Accessory";
  }

  if (/\b(t-shirt|tshirt|shirt|top|blouse)\b/.test(text)) {
    return "Top wear";
  }

  return "Fashion item";
}

app.post("/api/recommendations", (req, res) => {
  try {
    const body = req.body || {};
    const products = body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "No catalogue products received. Add products first."
      });
    }

    const occasion = body.occasion || "Everyday";
    const style = body.style || "Casual";
    const audience = body.audience || "Any";
    const notes = body.notes || "";
    const budget = Math.max(0, Number(body.budget) || 0);

    const catalogue = products
      .map(getProduct)
      .filter(p => p.id && p.price > 0);

    if (catalogue.length === 0) {
      return res.status(400).json({
        error: "No valid products found. Check product IDs and prices."
      });
    }

    // Filter by budget first.
    let affordable = catalogue.filter(
      p => budget === 0 || p.price <= budget
    );

    // Prefer products for the selected audience.
    const matchingAudience = affordable.filter(
      p => audienceMatch(p, audience)
    );

    // Use audience-matching products when available.
    // If the catalogue doesn't contain audience labels, retain products
    // rather than returning an empty result.
    if (matchingAudience.length > 0) {
      affordable = matchingAudience;
    }

    affordable = affordable
      .map(p => ({
        ...p,
        score: styleScore(p, style, occasion, notes)
      }))
      .sort((a, b) => b.score - a.score);

    if (affordable.length === 0) {
      return res.status(400).json({
        error: "No products fit your budget. Please increase it."
      });
    }

    // Build a look without exceeding the budget.
    const selected = [];
    const usedRoles = new Set();
    let total = 0;

    // Select a main outfit first, then complementary items.
    const rolePriority = {
      "Main outfit": 1,
      "Top wear": 2,
      "Bottom wear": 3,
      "Footwear": 4,
      "Accessory": 5,
      "Jewellery": 6,
      "Fashion item": 7
    };

    affordable.sort((a, b) => {
      const roleDifference =
        (rolePriority[itemRole(a)] || 7) -
        (rolePriority[itemRole(b)] || 7);

      if (roleDifference !== 0) return roleDifference;
      return b.score - a.score;
    });

    for (const p of affordable) {
      if (selected.length >= 3) break;

      if (budget > 0 && total + p.price > budget) continue;

      const role = itemRole(p);

      // Avoid picking multiple identical roles when alternatives exist.
      if (usedRoles.has(role) && role !== "Fashion item") continue;

      selected.push(p);
      usedRoles.add(role);
      total += p.price;
    }

    // If role diversity leaves too few products, add affordable items.
    for (const p of affordable) {
      if (selected.length >= 3) break;
      if (selected.some(item => item.id === p.id)) continue;
      if (budget > 0 && total + p.price > budget) continue;

      selected.push(p);
      total += p.price;
    }

    if (selected.length === 0) {
      return res.status(400).json({
        error: "Could not build an outfit within this budget."
      });
    }

    console.log(
      "Free recommendations generated:",
      selected.map(p => p.name)
    );

    return res.json({
      title: "Your Myntra Outfit Suggestions",
      summary:
        `Suggestions for ${occasion}, with a ${style} preference. ` +
        `Products are matched from your saved catalogue.`,
      photoAnalysis: body.photoDataUrl
        ? "Photo analysis is not available in free local mode."
        : "",
      outfits: [{
        name: `${style} ${occasion} Look`,
        reason:
          "Products selected using your audience, style, occasion and budget preferences.",
        totalPrice: total,
        items: selected.map(p => ({
          productId: p.id,
          role: itemRole(p),
          reason: `${p.name} selected from your catalogue.`
        }))
      }],
      stylingTips: [
        "Choose colours and patterns that complement each other.",
        "Check the product size, colour and availability before ordering.",
        "Try suitable accessories to complete your look."
      ]
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      error: "Could not generate outfit suggestions."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Myntra backend running at http://localhost:${PORT}`);
  console.log("Free local recommendation mode enabled.");
});

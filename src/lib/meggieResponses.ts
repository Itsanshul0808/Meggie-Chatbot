// Meggie's response logic - sweet, caring, and helpful responses for hostel students

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  tips?: string;
}

const commonIngredients = {
  rice: ["rice", "basmati", "white rice", "brown rice"],
  tomato: ["tomato", "tomatoes", "tomato sauce"],
  onion: ["onion", "onions", "pyaz"],
  potato: ["potato", "potatoes", "aloo"],
  egg: ["egg", "eggs", "anda"],
  bread: ["bread", "double roti", "pav"],
  maggi: ["maggi", "noodles", "instant noodles"],
  dal: ["dal", "lentils", "moong", "masoor", "toor"],
  oil: ["oil", "cooking oil", "refined oil"],
  salt: ["salt", "namak"],
  spices: ["turmeric", "haldi", "red chili", "garam masala", "jeera", "cumin"]
};

const recipes: Record<string, Recipe> = {
  "rice_tomato": {
    name: "Aromatic Hostel-Style Tomato Rice",
    ingredients: ["1 cup basmati rice", "3-4 medium tomatoes", "1 large onion", "2-3 garlic cloves", "1 tsp cumin seeds", "1/2 tsp turmeric", "1 tsp red chili powder", "salt to taste", "3 tbsp cooking oil", "fresh coriander leaves"],
    steps: [
      "Wash and soak rice for 15 minutes, then boil with salt until 70% cooked (8-10 mins). Drain and set aside.",
      "Heat oil in a heavy-bottomed pan. Add cumin seeds and let them splutter.",
      "Add finely chopped onions and sauté until golden brown (5-6 minutes).",
      "Add minced garlic and cook for 1 minute until fragrant.",
      "Add chopped tomatoes, turmeric, and chili powder. Cook until tomatoes break down completely (8-10 minutes).",
      "Gently fold in the parboiled rice. Add salt and mix carefully to avoid breaking grains.",
      "Cover and cook on low heat for 10-12 minutes until rice is fully cooked.",
      "Garnish with fresh coriander and serve hot with raita or pickle! 🍚✨"
    ],
    tips: "Pro tip: Add a bay leaf while boiling rice for extra aroma! No garlic? Use ginger instead. Save time by using canned tomatoes when fresh ones are expensive."
  },
  "egg_rice": {
    name: "Restaurant-Style Egg Fried Rice",
    ingredients: ["2 cups cooked rice (preferably day-old)", "3 eggs", "1 medium onion", "2 spring onions", "2 cloves garlic", "1 tbsp soy sauce", "1 tsp vinegar", "1/2 tsp black pepper", "salt to taste", "3 tbsp oil"],
    steps: [
      "Beat eggs with a pinch of salt and black pepper. Set aside.",
      "Heat 1 tbsp oil in a large pan or wok on high heat.",
      "Pour beaten eggs and scramble quickly. Remove and set aside.",
      "Heat remaining oil, add minced garlic and chopped onions. Stir-fry for 2-3 minutes.",
      "Add cold rice, breaking up any clumps with a spatula.",
      "Stir-fry rice for 3-4 minutes until heated through and slightly crispy.",
      "Add soy sauce, vinegar, and scrambled eggs back to the pan.",
      "Toss everything together for 2 minutes. Garnish with chopped spring onions.",
      "Serve immediately while hot! 🍳🥢"
    ],
    tips: "Secret: Use day-old rice for the best texture! Add frozen mixed vegetables for extra nutrition. No soy sauce? Mix ketchup with a little water and salt!"
  },
  "maggi_upgrade": {
    name: "Gourmet Hostel Masala Maggi Bowl",
    ingredients: ["2 packets maggi noodles", "1 large onion", "2 tomatoes", "2 eggs", "1 green chili", "1 tsp ginger-garlic paste", "1/2 tsp garam masala", "1 tsp red chili powder", "fresh coriander", "2 tbsp oil", "cheese slice (optional)"],
    steps: [
      "Boil water in a large pot. Add maggi noodles (reserve one masala packet) and cook for 2 minutes. Drain and set aside.",
      "Heat oil in a deep pan. Add chopped onions and green chili, sauté until onions turn pink.",
      "Add ginger-garlic paste and cook for 1 minute until aromatic.",
      "Add chopped tomatoes, reserved masala packet, chili powder, and garam masala. Cook until tomatoes are soft (5-6 minutes).",
      "Beat eggs and pour into the pan. Scramble with the masala mixture.",
      "Add the cooked noodles and toss everything together for 2-3 minutes.",
      "Add a splash of water if too dry. Cook for another 2 minutes.",
      "Garnish with fresh coriander and cheese slice if available.",
      "Serve in bowls with a cup of chai! 🍜🔥"
    ],
    tips: "Level up: Add capsicum, carrots, or any leftover vegetables. Make it creamy by adding a spoonful of mayonnaise at the end. Freeze the extra masala packets for future use!"
  }
};

const getDetectedIngredients = (message: string): string[] => {
  const detected: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  Object.entries(commonIngredients).forEach(([key, variations]) => {
    if (variations.some(ingredient => lowerMessage.includes(ingredient))) {
      detected.push(key);
    }
  });
  
  return detected;
};

const getRecipeKey = (ingredients: string[]): string | null => {
  if (ingredients.includes("rice") && ingredients.includes("tomato")) {
    return "rice_tomato";
  }
  if (ingredients.includes("rice") && ingredients.includes("egg")) {
    return "egg_rice";
  }
  if (ingredients.includes("maggi")) {
    return "maggi_upgrade";
  }
  return null;
};

const formatRecipe = (recipe: Recipe): string => {
  let response = `Ooh, perfect! Let's make ${recipe.name}! 🌸\n\n`;
  response += `You'll need:\n`;
  recipe.ingredients.forEach(ingredient => {
    response += `• ${ingredient}\n`;
  });
  
  response += `\nHere's how to make it:\n`;
  recipe.steps.forEach((step, index) => {
    response += `${index + 1}. ${step}\n`;
  });
  
  if (recipe.tips) {
    response += `\n💡 Meggie's tip: ${recipe.tips}`;
  }
  
  return response;
};

// Function to call AI for recipe generation
export const generateAIRecipe = async (ingredients: string[], preferences?: string, budget?: string, time?: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients,
        preferences,
        budget,
        time
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return data.fallback || "I'm having trouble with my recipe generator right now! Let me give you one of my tried-and-tested favorites instead. 😊";
    }

    return data.recipe;
  } catch (error) {
    console.error('Error generating AI recipe:', error);
    return "Sorry, I'm having trouble connecting to my recipe brain! 😅 But I can still help with some basic recipes. What specific dish are you thinking of?";
  }
};

export const generateMeggieResponse = async (userMessage: string): Promise<string> => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect ingredients
  const ingredients = getDetectedIngredients(userMessage);
  
  // Check if user wants AI-generated recipe (has multiple ingredients or asks for something creative)
  if (ingredients.length >= 2 || lowerMessage.includes("recipe") || lowerMessage.includes("cook") || lowerMessage.includes("make")) {
    // Extract preferences from message
    let preferences = "";
    let budget = "";
    let time = "";
    
    if (lowerMessage.includes("vegetarian") || lowerMessage.includes("veg")) preferences += "vegetarian ";
    if (lowerMessage.includes("spicy")) preferences += "spicy ";
    if (lowerMessage.includes("mild")) preferences += "mild ";
    if (lowerMessage.includes("quick") || lowerMessage.includes("fast")) time = "15";
    if (lowerMessage.includes("budget") || lowerMessage.includes("cheap")) budget = "₹50";
    
    // Try AI recipe generation first
    const aiRecipe = await generateAIRecipe(ingredients, preferences, budget, time);
    if (aiRecipe && !aiRecipe.includes("trouble") && !aiRecipe.includes("Sorry")) {
      return aiRecipe;
    }
  }
  
  // Fallback to existing recipe logic
  const recipeKey = getRecipeKey(ingredients);
  if (recipeKey && recipes[recipeKey]) {
    return formatRecipe(recipes[recipeKey]);
  }
  
  // Handle common queries
  if (lowerMessage.includes("breakfast")) {
    return "Good morning! 🌅 For a delicious hostel breakfast, try:\n\n• **Masala Scrambled Eggs** - with onions, tomatoes, and green chilies\n• **Poha Upma** - quick and filling with minimal ingredients\n• **French Toast** - if you have bread, eggs, and milk\n• **Oats Porridge** - healthy and customizable with any toppings\n\nTell me what ingredients you have, and I'll create a detailed breakfast recipe just for you! 😊";
  }
  
  if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("₹50") || lowerMessage.includes("money")) {
    return "I totally get it - hostel life and budgets! 💕\n\nHere are my **detailed budget meals**:\n• **Dal Rice Bowl** (₹25-35) - protein-rich and filling\n• **Masala Maggi Deluxe** (₹30-40) - upgraded with eggs and veggies\n• **Spiced Bread Omelette** (₹20-30) - restaurant-style technique\n• **Simple Khichdi** (₹20-25) - comfort food at its best\n\nShare your exact ingredients and budget, and I'll create a **step-by-step gourmet recipe** that'll make your friends jealous! 🌸";
  }
  
  if (lowerMessage.includes("no ingredients") || lowerMessage.includes("nothing") || lowerMessage.includes("empty")) {
    return "Oh honey! 😅 The classic empty-hostel-kitchen situation!\n\n**Emergency Solutions:**\n• **Community Cooking** - team up with roommates for shared ingredients\n• **Mess Hall Hacks** - see what's available there\n• **Quick Store Run** - ₹100 can get you rice, dal, oil, and onions for multiple meals\n• **Tea & Biscuits** - sometimes that's all we need\n\n**Survival Kit for Next Time:** Rice, dal, oil, onions, salt, and chili powder - these 6 items can make 20+ different dishes! \n\nWhat's your current situation? I might have some creative solutions! 💪";
  }
  
  if (ingredients.length > 0) {
    let response = `Ooh, I can see you have **${ingredients.join(", ")}**! 😊 That's a great start!\n\n`;
    
    // Provide detailed suggestions based on ingredients
    if (ingredients.includes("rice")) {
      response += "**Rice possibilities:** Fried rice, biryani-style rice, tomato rice, lemon rice, or even sweet rice for dessert!\n\n";
    }
    
    if (ingredients.includes("egg")) {
      response += "**Egg magic:** Scrambled masala eggs, egg curry, egg fried rice, or a fluffy omelette with whatever veggies you have!\n\n";
    }
    
    response += "Give me the **complete list** of what you have (including spices, oil, etc.), and I'll create a **detailed, restaurant-quality recipe** that'll make your hostel room smell amazing! 🏠✨";
    return response;
  }
  
  // Default caring response
  return "Hey there! 😊 I'm Meggie, your personal hostel kitchen assistant! I'm here to help you create **amazing meals** with whatever you have! \n\n**Just tell me:**\n• What ingredients are in your kitchen right now?\n• Any specific cravings or dietary preferences?\n• How much time do you have to cook?\n• What's your budget like?\n\nI'll create **detailed, step-by-step recipes** that'll have your hostel friends begging for the secret! Ready to cook something incredible? 🌸✨";
};
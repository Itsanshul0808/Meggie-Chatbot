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
    name: "Simple Tomato Rice",
    ingredients: ["rice", "tomatoes", "salt", "oil"],
    steps: [
      "Boil rice until 70% cooked, drain and set aside",
      "Heat oil in pan, add chopped tomatoes",
      "Cook tomatoes until mushy, add salt",
      "Mix in the rice and cook for 5 more minutes",
      "Serve hot! 🍚"
    ],
    tips: "No onions? No problem! Add a tiny bit of ketchup for extra flavor 😉"
  },
  "egg_rice": {
    name: "Quick Egg Fried Rice",
    ingredients: ["rice", "eggs", "salt", "oil"],
    steps: [
      "Cook rice and let it cool (day-old rice works best!)",
      "Scramble eggs in a pan with oil and salt",
      "Add rice to the same pan and mix well",
      "Stir-fry for 3-4 minutes until heated through",
      "Enjoy your protein-packed meal! 🍳"
    ],
    tips: "Add any leftover veggies you have - they'll taste amazing!"
  },
  "maggi_upgrade": {
    name: "Hostel Special Masala Maggi",
    ingredients: ["maggi noodles", "onion", "tomato", "egg (optional)"],
    steps: [
      "Boil water, add maggi and cook for 1 minute",
      "In another pan, sauté chopped onions and tomatoes",
      "Beat an egg and scramble it in the same pan (if using)",
      "Mix the cooked maggi with the veggie-egg mixture",
      "Your fancy maggi is ready! 🍜"
    ],
    tips: "This trick makes instant noodles feel like a proper meal!"
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

export const generateMeggieResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect ingredients
  const ingredients = getDetectedIngredients(userMessage);
  
  // Check for specific recipe matches
  const recipeKey = getRecipeKey(ingredients);
  if (recipeKey && recipes[recipeKey]) {
    return formatRecipe(recipes[recipeKey]);
  }
  
  // Handle common queries
  if (lowerMessage.includes("breakfast")) {
    return "Good morning! 🌅 For a quick hostel breakfast, try:\n\n• Bread omelette (if you have eggs)\n• Poha with tea (if available)\n• Simple upma with semolina\n• Or just some good old toast with whatever spread you have!\n\nWhat ingredients do you have right now? I'll help you make something yummy! 😊";
  }
  
  if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("₹50") || lowerMessage.includes("money")) {
    return "I totally get it - hostel life and budgets! 💕\n\nHere are my go-to budget meals:\n• Rice + dal (₹20-30)\n• Maggi with egg (₹25-35)\n• Bread omelette (₹20-30)\n• Simple rice with pickle (₹15-20)\n\nTell me what you have in your room right now, and I'll help you create something filling and delicious! Remember, the best meals come from the heart, not the wallet! 🌸";
  }
  
  if (lowerMessage.includes("no ingredients") || lowerMessage.includes("nothing") || lowerMessage.includes("empty")) {
    return "Oh honey! 😅 Been there, done that! When the hostel kitchen looks like a desert...\n\nQuick fixes:\n• Check if anyone has extra bread/maggi to share\n• See if the hostel mess has anything\n• Emergency: Just tea/coffee with some biscuits\n• Time for a quick grocery run? Rice + dal + oil covers many meals!\n\nDon't worry, we've all survived on creative 'nothing' meals. Tomorrow will be better! 💪 What's your situation right now?";
  }
  
  if (ingredients.length > 0) {
    let response = `I can see you have ${ingredients.join(", ")}! 😊\n\n`;
    
    // Provide general suggestions based on ingredients
    if (ingredients.includes("rice")) {
      response += "With rice, you can make so many things! Plain rice with any curry, fried rice if you have some veggies or eggs, or even sweet rice with a bit of sugar!\n\n";
    }
    
    if (ingredients.includes("egg")) {
      response += "Eggs are like magic in hostel cooking! 🥚 Scrambled, omelette, or just boiled - they make everything better!\n\n";
    }
    
    response += "Tell me exactly what you have, and I'll give you a step-by-step recipe that'll make your hostel room smell like home! 🏠✨";
    return response;
  }
  
  // Default caring response
  return "Hey there! 😊 I'm here to help you whip up something delicious with whatever you have! \n\nJust tell me:\n• What ingredients are in your hostel kitchen right now?\n• Any specific cravings?\n• How much time do you have?\n\nI promise we'll make something that'll have your hostel friends asking for the recipe! What do you say? 🌸";
};
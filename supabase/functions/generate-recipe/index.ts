import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ingredient mapping for local Indian terms to global terms
const ingredientMapping: Record<string, string> = {
  "paneer": "cottage cheese",
  "maggi": "instant noodles",
  "poha": "flattened rice",
  "atta": "wheat flour",
  "roti": "flatbread",
  "chapati": "flatbread",
  "chaas": "buttermilk",
  "curd": "yogurt",
  "dahi": "yogurt",
  "bhindi": "okra",
  "methi": "fenugreek leaves",
  "jeera": "cumin seeds",
  "haldi": "turmeric",
  "dhania": "coriander",
  "aloo": "potato",
  "pyaz": "onion",
  "tamatar": "tomato",
  "dal": "lentils",
  "rajma": "kidney beans",
  "chana": "chickpeas",
  "upma": "semolina",
  "suji": "semolina",
  "besan": "chickpea flour",
  "ghee": "clarified butter"
}

// Local hostel recipes cache
const localRecipes: Record<string, any> = {
  "maggi": {
    "name": "Hostel Special Maggi",
    "ingredients": ["maggi noodles", "onion", "tomato", "green chilies", "garam masala", "oil"],
    "steps": [
      "Heat oil in pan, add chopped onions and green chilies",
      "Add tomatoes and cook until soft",
      "Add water and bring to boil",
      "Add maggi noodles and masala packet",
      "Cook for 2-3 minutes, add garam masala and serve hot"
    ],
    "time": "8 minutes",
    "hostel_tip": "Add an egg while cooking for extra protein! No veggies? Just use the masala packet."
  },
  "poha": {
    "name": "Classic Poha",
    "ingredients": ["poha", "onion", "mustard seeds", "curry leaves", "turmeric", "oil", "salt"],
    "steps": [
      "Rinse poha in water and drain well",
      "Heat oil, add mustard seeds and curry leaves",
      "Add chopped onions, cook until golden",
      "Add turmeric and drained poha",
      "Mix gently, add salt and cook for 3-4 minutes"
    ],
    "time": "15 minutes",
    "hostel_tip": "No curry leaves? Skip them! Add peanuts for crunch if available."
  },
  "paneer": {
    "name": "Quick Paneer Butter Masala",
    "ingredients": ["paneer", "butter", "tomato", "cream", "garam masala", "kasuri methi"],
    "steps": [
      "Fry paneer cubes in butter until golden",
      "Add chopped tomatoes and cook until soft",
      "Add cream, garam masala and kasuri methi",
      "Mix paneer into sauce and simmer for 5 minutes"
    ],
    "time": "20 minutes",
    "hostel_tip": "No cream? Use milk with a spoon of ghee. Frozen paneer works too!"
  }
}

// Function to map local ingredients to global terms
function mapIngredientsToGlobal(ingredients: string[]): string[] {
  return ingredients.map(ingredient => {
    const lowercased = ingredient.toLowerCase().trim()
    return ingredientMapping[lowercased] || ingredient
  })
}

// Function to check local recipe cache
function findLocalRecipe(ingredients: string[]): string | null {
  const lowercasedIngredients = ingredients.map(i => i.toLowerCase())
  
  for (const [key, recipe] of Object.entries(localRecipes)) {
    if (lowercasedIngredients.some(ingredient => ingredient.includes(key))) {
      return formatLocalRecipe(recipe)
    }
  }
  
  return null
}

// Function to format local recipe
function formatLocalRecipe(recipe: any): string {
  const steps = recipe.steps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')
  
  return `**${recipe.name}**
*Perfect for hostel cooking! Let's make something delicious together! 🍳*

**Ingredients:**
${recipe.ingredients.map((ing: string) => `• ${ing}`).join('\n')}

**Step-by-Step Instructions:**
${steps}

**Cooking Time:** ${recipe.time}

**Meggie's Hostel Tip:**
${recipe.hostel_tip}

Happy cooking! 😊`
}

// Function to convert global terms back to local terms in response
function localizeResponse(response: string): string {
  let localizedResponse = response
  
  // Convert global terms back to local terms
  const reverseMapping: Record<string, string> = {
    "cottage cheese": "paneer",
    "instant noodles": "maggi",
    "flattened rice": "poha",
    "wheat flour": "atta",
    "flatbread": "roti",
    "buttermilk": "chaas",
    "yogurt": "curd",
    "okra": "bhindi",
    "fenugreek leaves": "methi",
    "cumin seeds": "jeera",
    "turmeric": "haldi",
    "coriander": "dhania",
    "potato": "aloo",
    "onion": "pyaz",
    "tomato": "tamatar",
    "lentils": "dal",
    "kidney beans": "rajma",
    "chickpeas": "chana",
    "semolina": "rava",
    "chickpea flour": "besan",
    "clarified butter": "ghee"
  }
  
  for (const [global, local] of Object.entries(reverseMapping)) {
    const regex = new RegExp(`\\b${global}\\b`, 'gi')
    localizedResponse = localizedResponse.replace(regex, local)
  }
  
  return localizedResponse
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ingredients, preferences, budget, time } = await req.json()

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // First, check local recipe cache
    const localRecipe = findLocalRecipe(ingredients)
    if (localRecipe) {
      return new Response(
        JSON.stringify({ recipe: localRecipe }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Map local ingredients to global terms for Spoonacular
    const globalIngredients = mapIngredientsToGlobal(ingredients)

    // Get recipe suggestions from Spoonacular if API key is available
    let spoonacularRecipes = []
    if (spoonacularApiKey && globalIngredients.length > 0) {
      try {
        const spoonacularResponse = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${globalIngredients.join(',')}&number=3&apiKey=${spoonacularApiKey}`
        )
        if (spoonacularResponse.ok) {
          spoonacularRecipes = await spoonacularResponse.json()
        }
      } catch (error) {
        console.log('Spoonacular API error:', error)
      }
    }

    // Include Spoonacular recipe suggestions in the prompt if available
    const spoonacularContext = spoonacularRecipes.length > 0 
      ? `\n\nInspiration from real recipes: ${spoonacularRecipes.map(r => r.title).join(', ')}`
      : '';

    const prompt = `You are Meggie, a sweet and caring kitchen assistant for hostel students. Create a detailed, step-by-step recipe using these LOCAL INDIAN ingredients: ${ingredients.join(', ')}.${spoonacularContext}

Requirements:
- Make it suitable for hostel cooking (basic equipment like single burner, one pan)
- Use LOCAL INDIAN ingredient names (paneer, not cottage cheese; curd, not yogurt; aloo, not potato)
- Include cooking times and temperatures
- Add hostel-specific tips and easy substitutions
- Make it budget-friendly and student-oriented
- Keep the tone warm, encouraging, and relatable to Indian hostel students
- Include ingredient substitutions for common hostel scenarios
- Add shortcuts and time-saving hacks
${preferences ? `- Consider these preferences: ${preferences}` : ''}
${budget ? `- Keep it within budget: ${budget}` : ''}
${time ? `- Should take about: ${time} minutes` : ''}

Format your response as:
**Recipe Name**
*Brief encouraging intro*

**Ingredients:**
• [detailed list with quantities]

**Equipment Needed:**
• [basic hostel equipment]

**Step-by-Step Instructions:**
1. [detailed step with timing]
2. [continue...]

**Meggie's Hostel Tips:**
• [helpful hints specific to hostel cooking, substitutions, and shortcuts]

**Variations:**
• [how to modify with different ingredients commonly available in hostels]

**Storage Tips:**
• [how to store leftovers in hostel conditions]

Keep it conversational, encouraging, and include emojis sparingly. Use local Indian ingredient names throughout. Make it feel like advice from a caring friend who understands hostel life.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Meggie, a caring kitchen assistant who helps hostel students cook delicious meals. Be warm, encouraging, and provide detailed but accessible recipes.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`)
    }

    let recipe = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Hmm, I couldn\'t find an exact recipe, but here\'s a similar idea you can try! 🤔\n\nWhy don\'t you try making a simple stir-fry with whatever vegetables you have? Heat some oil, add your ingredients, and season with salt and garam masala. Cook for 10-15 minutes and you\'ll have a tasty meal! 😊'
    
    // Localize the response to use Indian terms
    recipe = localizeResponse(recipe)

    return new Response(
      JSON.stringify({ recipe }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in generate-recipe function:', error)
    // Provide helpful fallback with hostel cooking tips
    const fallbackResponse = `I'm having trouble connecting to my recipe brain right now! 😅 But don't worry, here are some quick hostel cooking ideas:

**Quick & Easy Options:**
• **Maggi Special**: Add an egg and some vegetables to your maggi for a complete meal
• **Bread Omelette**: Beat eggs with onions and make a quick omelette sandwich
• **Dal Chawal**: Simple comfort food - just boil dal with turmeric and serve with rice
• **Poha**: Quick breakfast with flattened rice, onions, and basic spices

**Hostel Survival Tips:**
• Keep basic spices: salt, turmeric, garam masala, and red chili powder
• Onions and potatoes are versatile and last long
• Eggs are your best friend for protein
• Always have some maggi packets for emergency meals! 🍜

What ingredients do you have? I can suggest something specific! 😊`

    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: fallbackResponse
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
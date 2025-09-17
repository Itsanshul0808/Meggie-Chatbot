import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ingredients, preferences, budget, time } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are Meggie, a sweet and caring kitchen assistant for hostel students. Create a detailed, step-by-step recipe using these ingredients: ${ingredients.join(', ')}.

Requirements:
- Make it suitable for hostel cooking (basic equipment)
- Include cooking times and temperatures
- Add pro tips and variations
- Make it budget-friendly
- Keep the tone warm and encouraging
- Include ingredient substitutions for common hostel scenarios
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

**Meggie's Pro Tips:**
• [helpful hints and substitutions]

**Variations:**
• [how to modify the recipe]

**Storage Tips:**
• [how to store leftovers]

Keep it conversational, encouraging, and include emojis sparingly. Make the recipe complex enough to feel like a proper cooking experience, not just basic instructions.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Meggie, a caring kitchen assistant who helps hostel students cook delicious meals. Be warm, encouraging, and provide detailed but accessible recipes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
    }

    const recipe = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a recipe right now. Try again!'

    return new Response(
      JSON.stringify({ recipe }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in generate-recipe function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: 'I\'m having trouble connecting to my recipe brain right now! 😅 But don\'t worry, I can still help you with some of my tried-and-tested hostel recipes. What ingredients do you have?'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
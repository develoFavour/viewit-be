import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateHotspotContent = async (idName, context) => {
  try {
    const prompt = `Act as an expert e-commerce copywriter for a high-end SaaS product called "ViewIt AR".
    We are adding an interactive hotspot to a 3D model.
    Hotspot Label: "${idName}"
    Product Context: "${context}"
    
    Task: Write a 2-sentence compelling, conversion-focused description for this specific feature. 
    Focus on the craftsmanship, benefit, or "wow" factor. Keep it professional yet exciting.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "you are a professional product marketer." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq Generation Error:', error);
    return "Experience the fine details of our premium product in high fidelity.";
  }
};

export const analyzeProductImage = async (imageUrl) => {
  try {
    const prompt = `Look at this product image and provide:
    1. A short, catchy product name.
    2. An estimated premium price (in numbers).
    3. The best category for it (e.g., Furniture, Electronics, Fashion).
    4. A high-converting 1-sentence product description.

    Return ONLY a JSON object in this format:
    { "name": "...", "price": 0, "category": "...", "description": "..." }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
    });

    const content = chatCompletion.choices[0].message.content;
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Vision Analysis Error:', error);
    return {
      name: "New Showcase Product",
      price: 199,
      category: "Luxury",
      description: "A premium item curated for the spatial web."
    };
  }
};

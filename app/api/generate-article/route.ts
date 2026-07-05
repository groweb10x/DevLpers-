import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sampleArticle, competitorUrl, instructions, language } = await req.json();

    if (!sampleArticle && !competitorUrl) {
      return NextResponse.json({ error: 'Please provide sample article or competitor URL' }, { status: 400 });
    }

    const prompt = `You are an expert SEO content writer. Your task is to create a high-quality, advanced article based on the following input.

${sampleArticle ? `SAMPLE ARTICLE / COMPETITOR CONTENT:
${sampleArticle}` : ''}

${competitorUrl ? `COMPETITOR URL: ${competitorUrl}` : ''}

${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}` : ''}

LANGUAGE: Write the article in ${language || 'the same language as the sample content'}

REQUIREMENTS:
1. Analyze the structure, headings, and format of the sample article
2. Create a BETTER, more comprehensive version with advanced insights
3. Use the SAME language as the sample (detect automatically)
4. Keep the same topic but make it 30-50% more detailed
5. Use proper H1, H2, H3 headings with markdown formatting
6. Add more examples, statistics references, and actionable tips
7. Include a compelling introduction and strong conclusion
8. Make it SEO-optimized with natural keyword usage
9. Keep the same tone but make it more authoritative
10. Add bullet points and numbered lists where appropriate

Write the complete article now:`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || 'API error' }, { status: 500 });
    }

    const data = await response.json();
    const article = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
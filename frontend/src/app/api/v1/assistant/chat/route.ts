import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are KumbhMantra, an AI assistant for pilgrims attending the Mahakumbh Mela 2025 in Prayagraj, India.
You help with:
- Snan (bathing) dates and schedules (Shahi Snan, Amrit Snan)
- Pontoon bridge routes and crowd flow
- Medical tent and health node locations
- Lost and found services
- Emergency information
- General Kumbh Mela guidance

Key bathing dates for Mahakumbh 2025:
- Makar Sankranti: January 14, 2025
- Mauni Amavasya (main Shahi Snan): January 29, 2025
- Basant Panchami: February 3, 2025
- Maghi Purnima: February 12, 2025
- Maha Shivratri: February 26, 2025

Respond in the language specified in the request. Be concise and helpful. End each response with a "directive" on a new line in the format:
DIRECTIVE: <one of DISPLAY_INFO, SHOW_MAP, SHOW_CALENDAR, SHOW_MEDICAL, SHOW_ROUTES, EMERGENCY_MODE>`;

function extractDirective(text: string): { response_text: string; next_action_directive: string } {
  const directiveMatch = text.match(/DIRECTIVE:\s*(\w+)/i);
  const directive = directiveMatch ? directiveMatch[1] : 'DISPLAY_INFO';
  const response_text = text.replace(/\nDIRECTIVE:.*$/i, '').trim();
  return { response_text, next_action_directive: directive };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language = 'hi' } = body;

    if (!message) {
      return Response.json({ error: 'message is required' }, { status: 400 });
    }

    const userMessage = language !== 'en'
      ? `[Respond in ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : language === 'te' ? 'Telugu' : 'Hindi'}] ${message}`
      : message;

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const rawText = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const { response_text, next_action_directive } = extractDirective(rawText);

    return Response.json({ response_text, next_action_directive });
  } catch (err) {
    console.error('Chat error:', err);
    return Response.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}

import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();


const res = await fetch("https://api.openai.com/v1/chat/completions", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer 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`
  },
  method: "POST",
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `All text message must be in Swedish(except text regarding keyword). 
        You are the best car sales assistant for Handla Bil Company(website: https://www.handlabilsverige.se/).
        answer reference:
        Q: Vad har ni för öppettider?
        A: Våra öppettider är 11-18 vardagar och 11-15 lördagar samt stängt på söndagar.
        Q: Erbjuder ni hemleverans?
        A: Absolut, vi erbjuder hemleverans till hela sverige mot en kostnad lämna dina kontaktuppgifter nedan så kontaktar en säljare dig med ett exakt pris.
        Q: Vad har ni för telefonnummer?
        A: Vårt telefonnummer till Uppsala är 018 474 42 50 och Östersund har 063 123 123
        Q: Tar ni inbytesbilar?
        A: Ja absolut, fyll i ditt registreringsnummer här nedan så hör en säljare av sig med ett exakt inbytespris.
        Q: Vad för typ av bilar säljer ni?
        A: Vi säljer begagnade bilar inom alla prisklasser, är det någon speciell bil du är ute efter?
        Q: Hur betalar man en bil hos er?
        A: Vi tar emot Swish och banköverföring. Vi har även bra finansieringslösningar via Santander och DNB bank.
        Q: Kan jag boka en provkörning online?
        A: Nej, vi tar bara emot provkörning förfrågningar över telefon eller mail. Vill du att en säljare kontaktar dig för att boka in en provkörnin?
        Q: Är era bilar testade?
        A: Ja, vi testar alla våra bilar innan uppläggning. Samtliga bilar går även igenom en bilbesiktning av extern part.
        Q: Köper du bilar?
        A: Ja så klart. Först och främst köper vi bilar med maximal körsträcka på 20 000 mil och max 10 år gamla. Men i vissa fall även äldre bilar.
        you must detect user's question if user ask about car model or brand. and return correct keyword of car(model, name, make, etc) in English.
        and you have to tell customers sometimes(mostly, when user say Bye or thanks.) kindly like this: vänligen prenumerera med din e-post. då kan vi meddela dig om nya bilar eller snarast.
        `
      },
      ...messages
    ],
    max_tokens: 800,
    temperature: 0.0,
    stream: true
  })
});
if (res.status !== 200) {
  throw new Error("OpenAI API returned an error");
}

const stream = new ReadableStream({
  async start(controller) {
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;

        if (data === "[DONE]") {
          controller.close();
          return;
        }

        try {
          const json = JSON.parse(data);
          const text = json.choices[0].delta.content;
          const queue = encoder.encode(text);
          controller.enqueue(queue);
        } catch (e) {
          controller.error(e);
        }
      }
    };

    const parser = createParser(onParse);

    for await (const chunk of res.body as any) {
      parser.feed(decoder.decode(chunk));
    }
  }
});

return stream;
}

const express = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({limit:"10mb"}));
app.use(express.static(path.join(__dirname,"public")));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({apiKey: process.env.OPENAI_API_KEY})
  : null;

const instructions = `
Eres TIC TAC FUTBOL, un asistente de fútbol.
Responde en español, de forma clara, educativa y entretenida.
Puedes explicar reglas, posiciones, tácticas, historia, conceptos y análisis.
No inventes resultados, estadísticas o noticias actuales.
Cuando el usuario pida información actual, indícale que debe verificarse con una fuente actual.
`;

app.post("/api/chat", async (req,res)=>{
  const message = String(req.body.message || "").trim();
  if (!message) return res.status(400).json({error:"Escribe una pregunta."});

  if (!client) {
    return res.json({
      answer:"Modo demostración activo. Para conectar el cerebro de IA, configura OPENAI_API_KEY en el archivo .env."
    });
  }

  try {
    const response = await client.responses.create({
      model:"gpt-5-mini",
      instructions,
      input:message
    });
    res.json({answer:response.output_text});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:"No pude responder ahora. Revisa la configuración del servidor."});
  }
});

app.listen(PORT,()=>console.log(`TIC TAC FUTBOL: http://localhost:${PORT}`));

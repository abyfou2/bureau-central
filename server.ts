import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for Gemini AI Business Advisor / Report generator
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { departmentData, prompt } = req.body;
      const model = "gemini-2.5-flash";
      
      const systemInstruction = `Tu es le conseiller stratégique et financier IA pour "BureauCentral", un bureau multi-services de premier plan comprenant :
1. "Bureau" (Achat & Vente d'Or en lingot - cotation, pureté 24k/22k, stocks physiques, transactions)
2. "Restaurant" (Restauration haut de gamme - gestion des tables, commandes, plats et chiffre d'affaires)
3. "Services Divers" (Prestations administratives, facturation et ticketing clients)
4. "Fondation Ilyassa" (Projets humanitaires, dons et suivi d'impact social)

Analyse les données fournies et réponds en français de manière professionnelle, précise et structurée, avec des recommandations concrètes pour le PDG et les responsables de département. Utilise un ton executive, clair et percutant.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt || `Analyse globale de la performance des départements et donne des recommandations stratégiques : ${JSON.stringify(departmentData)}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Erreur lors de la génération de l'analyse IA." });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const extractJsonArray = (content: string): any[] => {
  const match = content.match(/\[\s*{[\s\S]*?}\s*]/);
  if (!match) {
    throw new Error("❌ Conteúdo retornado não contém um array JSON válido.");
  }

  try {
    // Corrige caracteres de controle e quebras de linha malformadas
    const sanitized = match[0]
      .replace(/[\u0000-\u001F]+/g, "") // remove control characters
      .replace(/\\n/g, "\\n")
      .replace(/\\r/g, "\\r")
      .replace(/\\"/g, '"'); // corrige aspas duplas escapadas em excesso

    return JSON.parse(sanitized);
  } catch (err) {
    console.error("❌ Erro ao fazer parse do JSON extraído:", err);
    throw err;
  }
};

const generateQuestions = async (tema: string, dificuldade: string) => {
  const prompt = `
Gere 10 perguntas no estilo quiz (múltipla escolha), com tema "${tema}" e dificuldade "${dificuldade}", evite repetições de perguntas ao máximo. 
Formato JSON, sem nenhum texto fora do array, nem explicações, comentários ou marcação. Apenas o array:
[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ..."],
    "correctAnswer": "B) ..."
  } 
]
;`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content!;
  return extractJsonArray(content);
};

const generateAudio = async (text: string, outputPath: string) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!,
  );
  speechConfig.speechSynthesisVoiceName = "pt-BR-AntonioNeural";

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  return new Promise<void>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(`🔊 Áudio criado com sucesso: ${outputPath}`);
          resolve();
        } else {
          console.error("❌ Erro na síntese:", result.errorDetails);
          reject(result.errorDetails);
        }
        synthesizer.close();
      },
      (error) => {
        console.error("❌ Erro de execução:", error);
        synthesizer.close();
        reject(error);
      },
    );
  });
};

const run = async () => {
  const tema = "Religião";
  const dificuldade = "difícil";
  const questions = await generateQuestions(tema, dificuldade);

  const processed = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = String(i + 1).padStart(2, "0");

    const questionAudioPath = `question/${id}.mp3`;
    const correctAudioPath = `answer/${id}.mp3`;

    await generateAudio(q.question, path.resolve(`${questionAudioPath}`));
    await generateAudio(
      `${q.correctAnswer}`,
      path.resolve(`${correctAudioPath}`),
    );

    processed.push({
      ...q,
      questionAudio: `/${questionAudioPath}`,
      correctAudio: `/${correctAudioPath}`,
    });

    console.log(`✅ Pergunta ${id} criada`);
  }

  const outputPath = path.resolve("src/assets/config/json.ts");
  const outputData = `const questions = ${JSON.stringify(processed, null, 2)};\n\nexport default questions;\n`;

  fs.writeFileSync(outputPath, outputData);
  console.log(`✅ Arquivo salvo em ${outputPath}`);
};

run().catch((err) => {
  console.error("❌ Erro na execução:", err);
});

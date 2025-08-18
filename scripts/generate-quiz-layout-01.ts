// import fs from "fs";
// import path from "path";
// import { OpenAI } from "openai";
// import dotenv from "dotenv";
// import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const ensureDir = (dir: string) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// const extractJsonArray = (content: string): any[] => {
//   const match = content.match(/\[\s*{[\s\S]*?}\s*]/);
//   if (!match) {
//     throw new Error("❌ Conteúdo retornado não contém um array JSON válido.");
//   }

//   try {
//     const sanitized = match[0]
//       .replace(/[\u0000-\u001F]+/g, "")
//       .replace(/\\n/g, "\\n")
//       .replace(/\\r/g, "\\r")
//       .replace(/\\"/g, '"');

//     return JSON.parse(sanitized);
//   } catch (err) {
//     console.error("❌ Erro ao fazer parse do JSON extraído:", err);
//     throw err;
//   }
// };

// // Remove prefixo de alternativa ("A) ", "B) ", etc.) do correctAnswer
// const stripAnswerLetter = (s: string): string => s.replace(/^[A-Z]\)\s*/i, "");

// // Estima duração (ms) para legenda a partir do tamanho do texto
// const estimateMs = (
//   text: string,
//   baseMs = 2000,
//   charsPerSecond = 15,
// ): number => {
//   const secs = Math.max(baseMs / 1000, Math.ceil(text.length / charsPerSecond));
//   return Math.round(secs * 1000);
// };

// const generateQuestions = async (tema: string, dificuldade: string) => {
//   const prompt = `
// Gere 10 perguntas no estilo quiz (múltipla escolha), com tema "${tema}" e dificuldade "${dificuldade}".
// Evite repetições de perguntas ao máximo e garanta que as informações estejam corretas.

// Formato JSON, sem nenhum texto fora do array, nem explicações, comentários ou marcação. Apenas o array:
// [
//   {
//     "question": "...",
//     "options": ["A) ...", "B) ...", "C) ..."],
//     "correctAnswer": "B) ..."
//   }
// ]
// ;`;

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: prompt }],
//   });

//   const content = response.choices[0].message.content!;
//   return extractJsonArray(content);
// };

// const generateAudio = async (text: string, outputPath: string) => {
//   ensureDir(path.dirname(outputPath));

//   const speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env.AZURE_SPEECH_KEY!,
//     process.env.AZURE_SPEECH_REGION!,
//   );
//   speechConfig.speechSynthesisVoiceName = "pt-BR-AntonioNeural";

//   const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
//   const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

//   return new Promise<void>((resolve, reject) => {
//     synthesizer.speakTextAsync(
//       text,
//       (result) => {
//         if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//           console.log(`🔊 Áudio criado com sucesso: ${outputPath}`);
//           resolve();
//         } else {
//           console.error("❌ Erro na síntese:", result.errorDetails);
//           reject(result.errorDetails);
//         }
//         synthesizer.close();
//       },
//       (error) => {
//         console.error("❌ Erro de execução:", error);
//         synthesizer.close();
//         reject(error);
//       },
//     );
//   });
// };

// const gerarLegendaTikTok = (tema: string, dificuldade: string): string => {
//   const temaHashtag = tema
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/\s/g, "")
//     .toLowerCase();
//   return `
// 🧠 Você manda bem em ${tema}?
// Desafie seu cérebro com esse quiz de nível ${dificuldade}!
// Comente quantas você acertou 👇

// #quiz #conhecimentosgerais #quiztime #curiosidades #${temaHashtag} #quiz${temaHashtag}
// `.trim();
// };

// const run = async () => {
//   const temas = [
//     "Religião",
//     "Ciência",
//     "Geografia",
//     "História",
//     "Esportes",
//     "Artes",
//     "Entretenimento",
//     "Tecnologia",
//     "Música",
//     "Série",
//     "Filmes",
//     "Cinema",
//     "Atualidades",
//     "Cultura Geral",
//     "Matemática",
//     "Filosofia",
//     "Saúde",
//     "Idiomas",
//     "Jogos",
//   ];
//   const dificuldades = ["fácil", "médio", "difícil"];

//   const tema = temas[Math.floor(Math.random() * temas.length)];
//   const dificuldade =
//     dificuldades[Math.floor(Math.random() * dificuldades.length)];

//   const questions = await generateQuestions(tema, dificuldade);

//   const backgroundsDir = path.resolve("public/backgrounds");
//   ensureDir(backgroundsDir);
//   const backgroundFiles = fs
//     .readdirSync(backgroundsDir)
//     .filter((f) => f.endsWith(".mp4"));
//   const randomBackground =
//     backgroundFiles[Math.floor(Math.random() * backgroundFiles.length)] || "";
//   const backgroundPath = randomBackground
//     ? `/backgrounds/${randomBackground}`
//     : "/backgrounds/default.mp4";

//   const processed: any[] = [];

//   for (let i = 0; i < questions.length; i++) {
//     const q = questions[i];
//     const id = String(i + 1).padStart(2, "0");

//     // normaliza a resposta correta (remove "A) ", "B) ", etc.)
//     const cleanAnswer = stripAnswerLetter(q.correctAnswer ?? "");

//     const questionAudioPath = `public/question/${id}.mp3`;
//     const correctAudioPath = `public/answer/${id}.mp3`;

//     // áudios
//     await generateAudio(q.question, path.resolve(questionAudioPath));
//     await generateAudio(cleanAnswer, path.resolve(correctAudioPath));

//     // legendas (estimadas)
//     const questionEndMs = estimateMs(q.question, 2500, 15);
//     const answerEndMs = estimateMs(cleanAnswer, 2000, 15);

//     processed.push({
//       question: q.question,
//       options: q.options,
//       correctAnswer: cleanAnswer, // <-- sem letras
//       questionAudio: `/${questionAudioPath}`,
//       correctAudio: `/${correctAudioPath}`,
//       captions: [{ text: q.question, startMs: 0, endMs: questionEndMs }],
//       answerCaptions: [{ text: cleanAnswer, startMs: 0, endMs: answerEndMs }],
//     });

//     console.log(`✅ Pergunta ${id} criada`);
//   }

//   const outputPath = path.resolve("src/assets/config/json.ts");
//   const outputData = `const questions = ${JSON.stringify(processed, null, 2)};\n\nexport default questions;\n`;
//   ensureDir(path.dirname(outputPath));
//   fs.writeFileSync(outputPath, outputData);
//   console.log(`✅ Arquivo salvo em ${outputPath}`);

//   // ⚙️ Atualiza src/assets.ts com o background sorteado
//   const settingsPath = path.resolve("src/assets/config/setting.ts");
//   const newSettings = `
// export const settings = {
//   titulo: "Quiz ${tema}",
//   dificuldade: "${dificuldade}",
//   background: "${backgroundPath}",
//   timerAudio: "/clock.mp3",
//   answerAudio: "/acerto.mp3",
//   correctAudio: "/respostaCorreta.mp3",
// };
// `.trimStart();

//   ensureDir(path.dirname(settingsPath));
//   fs.writeFileSync(settingsPath, newSettings);
//   console.log(`✅ settings.ts atualizado com background: ${backgroundPath}`);

//   const legenda = gerarLegendaTikTok(tema, dificuldade);
//   const legendaPath = path.resolve("src/assets/config/legend.ts");
//   ensureDir(path.dirname(legendaPath));
//   fs.writeFileSync(legendaPath, `export const legenda = \`${legenda}\`;\n`);
//   console.log(`✅ Legenda gerada em ${legendaPath}`);

//   const introText = `Quiz de ${tema}, Consegue acertar 5 de 5 perguntas na dificuldade ${dificuldade}? Vamos lá!`;
//   const introAudioPath = path.resolve("public/audio-intro.mp3");
//   await generateAudio(introText, introAudioPath);
//   console.log("✅ Áudio da introdução criado.");
// };

// run().catch((err) => {
//   console.error("❌ Erro na execução:", err);
// });

import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const extractJsonArray = (content: string): any[] => {
  const match = content.match(/\[\s*{[\s\S]*?}\s*]/);
  if (!match) {
    throw new Error("❌ Conteúdo retornado não contém um array JSON válido.");
  }

  try {
    const sanitized = match[0]
      .replace(/[\u0000-\u001F]+/g, "")
      .replace(/\\n/g, "\\n")
      .replace(/\\r/g, "\\r")
      .replace(/\\"/g, '"');

    return JSON.parse(sanitized);
  } catch (err) {
    console.error("❌ Erro ao fazer parse do JSON extraído:", err);
    throw err;
  }
};

// Remove prefixo de alternativa ("A) ", "B) ", etc.)
const stripAnswerLetter = (s: string): string => s.replace(/^[A-Z]\)\s*/i, "");

// Estima duração (ms) a partir do tamanho do texto
const estimateMs = (
  text: string,
  baseMs = 2000,
  charsPerSecond = 15,
): number => {
  const secs = Math.max(baseMs / 1000, Math.ceil(text.length / charsPerSecond));
  return Math.round(secs * 1000);
};

const generateQuestions = async (tema: string, dificuldade: string) => {
  const prompt = `
Gere 10 perguntas no estilo quiz (múltipla escolha), com tema "${tema}" e dificuldade "${dificuldade}". 
Evite repetições e garanta que as informações estejam corretas.

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
  ensureDir(path.dirname(outputPath));

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

const gerarLegendaTikTok = (tema: string, dificuldade: string): string => {
  const temaHashtag = tema
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "")
    .toLowerCase();
  return `
🧠 Você manda bem em ${tema}?
Desafie seu cérebro com esse quiz de nível ${dificuldade}!
Comente quantas você acertou 👇

#quiz #conhecimentosgerais #quiztime #curiosidades #${temaHashtag} #quiz${temaHashtag}
`.trim();
};

const run = async () => {
  const temas = [
    "Religião",
    "Ciência",
    "Geografia",
    "História",
    "Esportes",
    "Artes",
    "Entretenimento",
    "Tecnologia",
    "Música",
    "Série",
    "Filmes",
    "Cinema",
    "Cultura Geral",
    "Matemática",
    "Filosofia",
    "Saúde",
    "Idiomas",
    "Jogos",
  ];
  const dificuldades = ["fácil", "médio", "difícil"];

  const tema = temas[Math.floor(Math.random() * temas.length)];
  const dificuldade =
    dificuldades[Math.floor(Math.random() * dificuldades.length)];

  const questions = await generateQuestions(tema, dificuldade);

  // 🎞 background aleatório
  const backgroundsDir = path.resolve("public/backgrounds");
  ensureDir(backgroundsDir);
  const backgroundFiles = fs
    .readdirSync(backgroundsDir)
    .filter((f) => f.endsWith(".mp4"));
  const randomBackground =
    backgroundFiles[Math.floor(Math.random() * backgroundFiles.length)] || "";
  const backgroundPath = randomBackground
    ? `/backgrounds/${randomBackground}`
    : "/backgrounds/default.mp4";

  const processed: any[] = [];

  // 🔊 Gera perguntas/respostas + captions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const id = String(i + 1).padStart(2, "0");

    // normaliza a resposta correta (remove "A) ", "B) ", etc.)
    const cleanAnswer = stripAnswerLetter(q.correctAnswer ?? "");

    const questionAudioPath = `public/question/${id}.mp3`;
    const correctAudioPath = `public/answer/${id}.mp3`;

    // áudios
    await generateAudio(q.question, path.resolve(questionAudioPath));
    await generateAudio(cleanAnswer, path.resolve(correctAudioPath));

    // legendas (estimadas)
    const questionEndMs = estimateMs(q.question, 2500, 15);
    const answerEndMs = estimateMs(cleanAnswer, 2000, 15);

    processed.push({
      question: q.question,
      options: q.options,
      correctAnswer: cleanAnswer, // <-- sem letras
      questionAudio: `/${questionAudioPath}`,
      correctAudio: `/${correctAudioPath}`,
      captions: [{ text: q.question, startMs: 0, endMs: questionEndMs }],
      answerCaptions: [{ text: cleanAnswer, startMs: 0, endMs: answerEndMs }],
    });

    console.log(`✅ Pergunta ${id} criada`);
  }

  // 📝 Salva questions
  const outputPath = path.resolve("src/assets/config/json.ts");
  ensureDir(path.dirname(outputPath));
  const outputData = `const questions = ${JSON.stringify(processed, null, 2)};\n\nexport default questions;\n`;
  fs.writeFileSync(outputPath, outputData);
  console.log(`✅ Arquivo salvo em ${outputPath}`);

  // ⚙️ Atualiza settings
  const settingsPath = path.resolve("src/assets/config/setting.ts");
  ensureDir(path.dirname(settingsPath));
  const newSettings = `
export const settings = {
  titulo: "Quiz ${tema}",
  dificuldade: "${dificuldade}",
  background: "${backgroundPath}",
  timerAudio: "/clock.mp3",
  answerAudio: "/acerto.mp3",
  correctAudio: "/respostaCorreta.mp3",
};
`.trimStart();
  fs.writeFileSync(settingsPath, newSettings);
  console.log(`✅ settings.ts atualizado com background: ${backgroundPath}`);

  // 🎙️ INTRO: gera áudio + captions no formato solicitado
  const introSegments = [
    { text: `Quiz de ${tema},`, baseMs: 1200 },
    {
      text: `Desafie seu cérebro com esse quiz de nível ${dificuldade}!`,
      baseMs: 2600,
    },
    { text: "Acha que consegue acertar 10 de 10 perguntas?", baseMs: 2800 },
    { text: "Vamos lá.", baseMs: 800 },
  ];

  // calcula startMs / endMs cumulativos
  let cursor = 0;
  const intro = introSegments.map((seg) => {
    const dur = estimateMs(seg.text, seg.baseMs, 15);
    const startMs = cursor;
    const endMs = startMs + dur;
    cursor = endMs;
    return { text: seg.text, startMs, endMs };
  });

  // salva captions.ts com o export do intro
  const captionsPath = path.resolve("src/assets/config/captions.ts");
  ensureDir(path.dirname(captionsPath));
  const captionsFile = `export const intro = ${JSON.stringify(intro, null, 2)};\n`;
  fs.writeFileSync(captionsPath, captionsFile);
  console.log(`✅ captions.ts (intro) atualizado`);

  // gera áudio da intro no caminho pedido
  const introAudioText = introSegments.map((s) => s.text).join(" ");
  const introAudioOut = path.resolve("public/audio-intro/audio-intro.mp3");
  ensureDir(path.dirname(introAudioOut));
  await generateAudio(introAudioText, introAudioOut);
  console.log(
    "✅ Áudio da introdução criado em public/audio-intro/audio-intro.mp3",
  );

  // 📝 Legenda TikTok
  const legenda = gerarLegendaTikTok(tema, dificuldade);
  const legendaPath = path.resolve("src/assets/config/legend.ts");
  ensureDir(path.dirname(legendaPath));
  fs.writeFileSync(legendaPath, `export const legenda = \`${legenda}\`;\n`);
  console.log(`✅ Legenda gerada em ${legendaPath}`);
};

run().catch((err) => {
  console.error("❌ Erro na execução:", err);
});

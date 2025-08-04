import axios from "axios";
import OpenAI from "openai";
import { ExpertsList } from "@/services/Options";
import { startVapiConversation, stopVapiConversation, sendVapiMessage } from "./VapiService";

// ✅ OpenRouter setup for chat completion
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
});

// ✅ Vapi TTS: Use expert voice to speak assistant replies
const ConvertTextToSpeech = async (text) => {
  try {
    await sendVapiMessage(text);
    console.log("Spoken via Vapi:", text);
  } catch (error) {
    console.error("Vapi TTS failed:", error);
  }
};

// ✅ Optional token getter
export const getToken = async () => {
  try {
    const result = await axios.get("/api/getToken");
    return result.data;
  } catch (error) {
    console.error("Failed to get token:", error);
    throw error;
  }
};

// ✅ Main AI + Vapi TTS integration
export const AIModel = async (topic, expertType, lastTwoConversation) => {
  console.log("AIModel called with:", { topic, expertType, lastTwoConversation });

  const option = ExpertsList.find((item) => item.name === expertType);

  if (!option) {
    console.error("Expert type not found:", expertType);
    return {
      role: "assistant",
      content: "Sorry, I could not find the specified expert type. Please try again.",
    };
  }

  const PROMPT = option.prompt.replace("{user_topic}", topic);

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        { role: "assistant", content: PROMPT },
        ...lastTwoConversation,
      ],
    });

    const message = completion?.choices?.[0]?.message;

    if (message?.content) {
      await ConvertTextToSpeech(message.content); // 🔈 Vapi AI speaks
    }

    return message;
  } catch (error) {
    console.error("API Error:", error);
    return {
      role: "assistant",
      content: "Sorry, there was an error processing your request. Please try again.",
    };
  }
};

// ✅ Generate Feedback and Notes function
export const AIModelToGenerateFeedbackAndNotes = async (expertType, conversation) => {
  console.log("AIModelToGenerateFeedbackAndNotes called with:", { expertType, conversation });

  const option = ExpertsList.find((item) => item.name === expertType);
  
  if (!option) {
    console.error("Expert type not found:", expertType);
    return {
      role: "assistant",
      content: "Sorry, I could not find the specified expert type. Please try again.",
    };
  }

  const PROMPT = option.summeryPrompt;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        ...conversation,
        { role: "assistant", content: PROMPT },
      ],
    });

    const message = completion?.choices?.[0]?.message;

    // Don't speak the feedback notes via TTS as it's usually long text
    // if (message?.content) {
    //   await ConvertTextToSpeech(message.content);
    // }

    return message;
  } catch (error) {
    console.error("API Error:", error);
    return {
      role: "assistant",
      content: "Sorry, there was an error generating feedback and notes. Please try again.",
    };
  }
};

// ✅ Helper functions to start/stop voice session
export const startVapiSession = async (expertName, topic, expertType) => {
  console.log("startVapiSession called with:", { expertName, topic, expertType });
  console.log("Available expert types:", ExpertsList.map(item => item.name));
  
  const option = ExpertsList.find((item) => item.name === expertType);
  if (!option) {
    console.error("Expert type not found in ExpertsList:", expertType);
    console.error("Available expert types:", ExpertsList.map(item => item.name));
    throw new Error(`Expert type "${expertType}" not found in ExpertsList`);
  }

  const prompt = option.prompt.replace("{user_topic}", topic);
  return await startVapiConversation(expertName, topic, expertType, prompt);
};

export const stopVapiSession = async () => {
  return await stopVapiConversation();
};

export const sendMessageToVapi = async (message) => {
  return await sendVapiMessage(message);
};

// import axios from "axios";
// import OpenAI from "openai";
// import { ExpertsList } from "@/services/Options";
// import { startVapiConversation, stopVapiConversation, sendVapiMessage } from "./VapiService";

// // ✅ OpenRouter setup for chat completion
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
//   dangerouslyAllowBrowser: true,
// });

// // ✅ Vapi TTS: Use expert voice to speak assistant replies
// const ConvertTextToSpeech = async (text) => {
//   try {
//     await sendVapiMessage(text);
//     console.log("Spoken via Vapi:", text);
//   } catch (error) {
//     console.error("Vapi TTS failed:", error);
//   }
// };

// // ✅ Optional token getter
// export const getToken = async () => {
//   try {
//     const result = await axios.get("/api/getToken");
//     return result.data;
//   } catch (error) {
//     console.error("Failed to get token:", error);
//     throw error;
//   }
// };

// // ✅ Main AI + Vapi TTS integration
// export const AIModel = async (topic, expertType, lastTwoConversation) => {
//   console.log("AIModel called with:", { topic, expertType, lastTwoConversation });

//   const option = ExpertsList.find((item) => item.name === expertType);

//   if (!option) {
//     console.error("Expert type not found:", expertType);
//     return {
//       role: "assistant",
//       content: "Sorry, I could not find the specified expert type. Please try again.",
//     };
//   }

//   const PROMPT = option.prompt.replace("{user_topic}", topic);

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "deepseek/deepseek-r1-0528:free",
//       messages: [
//         { role: "assistant", content: PROMPT },
//         ...lastTwoConversation,
//       ],
//     });

//     const message = completion?.choices?.[0]?.message;

//     if (message?.content) {
//       await ConvertTextToSpeech(message.content); // 🔈 Vapi AI speaks
//     }

//     return message;
//   } catch (error) {
//     console.error("API Error:", error);
//     return {
//       role: "assistant",
//       content: "Sorry, there was an error processing your request. Please try again.",
//     };
//   }
// };

// // ✅ Generate Feedback and Notes function
// export const AIModelToGenerateFeedbackAndNotes = async (expertType, conversation) => {
//   console.log("AIModelToGenerateFeedbackAndNotes called with:", { expertType, conversation });
//   console.log("ExpertType received:", expertType);
//   console.log("Available experts:", ExpertsList.map(item => item.name));

//   const option = ExpertsList.find((item) => item.name === expertType);
  
//   if (!option) {
//     console.error("Expert type not found:", expertType);
//     console.error("Type of expertType:", typeof expertType);
//     console.error("Available expert types:", ExpertsList.map(item => item.name));
//     return {
//       role: "assistant",
//       content: "Sorry, I could not find the specified expert type. Please try again.",
//     };
//   }

//   const PROMPT = option.summeryPrompt;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "deepseek/deepseek-r1-0528:free",
//       messages: [
//         ...conversation,
//         { role: "assistant", content: PROMPT },
//       ],
//     });

//     const message = completion?.choices?.[0]?.message;

//     // Don't use TTS for feedback notes as they're usually long

//     return message;
//   } catch (error) {
//     console.error("API Error:", error);
//     return {
//       role: "assistant",
//       content: "Sorry, there was an error generating feedback and notes. Please try again.",
//     };
//   }
// };

// // ✅ Helper functions to start/stop voice session
// export const startVapiSession = async (expertName, topic, expertType) => {
//   console.log("startVapiSession called with:", { expertName, topic, expertType });
//   console.log("Available expert types:", ExpertsList.map(item => item.name));
  
//   const option = ExpertsList.find((item) => item.name === expertType);
//   if (!option) {
//     console.error("Expert type not found in ExpertsList:", expertType);
//     console.error("Available expert types:", ExpertsList.map(item => item.name));
//     throw new Error(`Expert type "${expertType}" not found in ExpertsList`);
//   }

//   const prompt = option.prompt.replace("{user_topic}", topic);
//   return await startVapiConversation(expertName, topic, expertType, prompt);
// };

// export const stopVapiSession = async () => {
//   return await stopVapiConversation();
// };

// export const sendMessageToVapi = async (message) => {
//   return await sendVapiMessage(message);
// };
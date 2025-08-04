import Vapi from '@vapi-ai/web'; // ✅ correct

// Voice configurations for different experts
export const VoiceConfigs = {
  REAVA: {
    provider: "11labs",
    // voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice - professional female
    // voiceId: "EXAVITQu4vr4xnSDxMaL", // new girl voice - professional female
    voiceId: "1zUSi8LeHs9M2mV8X6YS", // priyanka sogam voice - professional female
    model: "eleven_turbo_v2",
    stability: 0.5,
    similarityBoost: 0.8,
    style: 0.2,
    useSpeakerBoost: true
  },
  VANSHIKA: {
    provider: "11labs", 
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella voice - warm female
    model: "eleven_turbo_v2",
    stability: 0.6,
    similarityBoost: 0.7,
    style: 0.3,
    useSpeakerBoost: true
  },
  ERIC: {
    provider: "11labs",
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam voice - confident male
    model: "eleven_turbo_v2", 
    stability: 0.4,
    similarityBoost: 0.9,
    style: 0.1,
    useSpeakerBoost: true
  }
};

// Create assistant configuration for each expert
export const createAssistantConfig = (expertName, topic, expertType, prompt) => {
  const voiceConfig = VoiceConfigs[expertName] || VoiceConfigs.ERIC;
  
  return {
    name: `${expertName} - ${expertType}`,
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt.replace('{user_topic}', topic)
        }
      ],
      maxTokens: 150,
      temperature: 0.7
    },
    voice: voiceConfig,
    firstMessage: `Hello! I'm ${expertName}, your ${expertType.toLowerCase()} assistant for ${topic}. How can I help you today?`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US"
    },
    recordingEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,
    backgroundSound: "off"
  };
};

// Vapi client singleton
let vapiInstance = null;

export const getVapiClient = () => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
};





// Start conversation with specific expert
export const startVapiConversation = async (expertName, topic, expertType, prompt) => {
  const vapi = getVapiClient();
  const assistantConfig = createAssistantConfig(expertName, topic, expertType, prompt);
  
  try {
    await vapi.start(assistantConfig);
    return true;
  } catch (error) {
    console.error('Failed to start Vapi conversation:', error);
    throw error;
  }
};

// Stop conversation
export const stopVapiConversation = async () => {
  const vapi = getVapiClient();
  try {
    await vapi.stop();
    return true;
  } catch (error) {
    console.error('Failed to stop Vapi conversation:', error);
    throw error;
  }
};

// Send message programmatically
export const sendVapiMessage = async (message) => {
  const vapi = getVapiClient();
  try {
    await vapi.send({
      type: "add-message",
      message: {
        role: "user",
        content: message
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to send message to Vapi:', error);
    throw error;
  }
};
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { ExpertsExpert, ExpertsList } from "@/services/Options";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@stackframe/stack";
// import { Loader2Icon, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
// import ChatBox from "./_components/ChatBox";
// import { startVapiSession, stopVapiSession } from "@/services/GlobalService";
// import { getVapiClient as getVapiClientDirect } from "@/services/VapiService";

// function DiscussionRoom() {
//   const { roomid } = useParams();

//   const DiscussionRoomData = useQuery(
//     api.DiscussionRoom.GetDiscussionRoom,
//     roomid ? { id: roomid } : "skip"
//   );

//   const [expert, setExpert] = useState();
//   const [isVapiConnected, setIsVapiConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversation, setConversation] = useState([
//     {
//       role: "assistant",
//       content: "Hello, I'm your voice assistant, developed by Eric Sandhu.",
//     },
//     {
//       role: "user",
//       content: "hi",
//     },
//   ]);
//   const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
//   const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
//   const [vapiStatus, setVapiStatus] = useState("disconnected");
//   const [isMuted, setIsMuted] = useState(false);
//   const [connectionError, setConnectionError] = useState(null);

//   const vapiRef = useRef(null);
//   const seenTranscripts = useRef(new Set());

//   useEffect(() => {
//     if (DiscussionRoomData?.ExpertsExpert) {
//       const Expert = ExpertsExpert.find(
//         (item) => item.name === DiscussionRoomData.ExpertsExpert
//       );
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const vapi = getVapiClientDirect();
//       vapiRef.current = vapi;

//       vapi.on("call-start", () => {
//         setVapiStatus("connected");
//         setIsVapiConnected(true);
//         setConnectionError(null);
//       });

//       vapi.on("call-end", () => {
//         setVapiStatus("disconnected");
//         setIsVapiConnected(false);
//       });

//       vapi.on("speech-start", () => {
//         setVapiStatus("listening");
//       });

//       vapi.on("speech-end", () => {
//         setVapiStatus("processing");
//       });

//       vapi.on("message", (message) => {
//         console.log("Vapi message:", message);

//         if (message.type === "transcript" && message.transcriptType === "final") {
//           const text = message.transcript;
//           if (seenTranscripts.current.has(text)) return;
//           seenTranscripts.current.add(text);

//           setConversation((prev) => [
//             ...prev,
//             { role: "user", content: text },
//             { role: "assistant", content: text }, // Replace this with GPT-generated reply
//              { role: "user", content: text, timestamp: Date.now() }
//           ]);
//         }
//         if (message.type === "assistant-response" || message.type === "response") {
// +          setConversation((prev) => [
// +            ...prev,
// +            { role: "assistant", content: message.content || message.text, timestamp: Date.now() }
// +          ]);
// +        }


//         if (message.type === "function-call") {
//           console.log("Function call:", message);
//         }
//       });

//       vapi.on("error", (error) => {
//         let errorMessage = "Unknown connection error";

//         if (typeof error === "string" && error.trim()) {
//           errorMessage = error;
//         } else if (typeof error === "object" && error !== null) {
//           if (error.message) {
//             errorMessage = error.message;
//           } else if (error.error) {
//             errorMessage = typeof error.error === "string" ? error.error : error.error.message || "Connection failed";
//           } else if (error.code) {
//             errorMessage = `Error code: ${error.code}`;
//           } else if (error.type) {
//             errorMessage = `Error type: ${error.type}`;
//           } else {
//             const errorInfo = Object.entries(error)
//               .filter(([_, value]) => value !== null && value !== undefined)
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//             errorMessage = errorInfo || "Unknown error format";
//           }
//         }

//         setConnectionError(errorMessage);
//         setVapiStatus("error");
//         setIsVapiConnected(false);
//       });

//       return () => {
//         vapi.stop();
//       };
//     }
//   }, []);

//   const connectToVapi = async () => {
//     if (!DiscussionRoomData || !expert) {
//       setConnectionError("Missing discussion room data or expert information");
//       return;
//     }

//     const expertWithPrompt = ExpertsList.find(
//       (item) => item.name === DiscussionRoomData.expertType
//     );

//     if (!expertWithPrompt || !expertWithPrompt.prompt) {
//       setConnectionError(`Expert "${DiscussionRoomData.expertType}" not found in ExpertsList or missing prompt`);
//       return;
//     }

//     setIsLoading(true);
//     setConnectionError(null);

//     try {
//       await startVapiSession(
//         expert.name,
//         DiscussionRoomData.topic,
//         DiscussionRoomData.expertType
//       );
//     } catch (error) {
//       setConnectionError(error.message || "Failed to connect to voice assistant");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const disconnectFromVapi = async () => {
//     setIsLoading(true);
//     try {
//       await stopVapiSession();
//     } catch (error) {
//       console.error("Error stopping Vapi conversation:", error);
//     }

//     setVapiStatus("disconnected");
//     setIsVapiConnected(false);

//     try {
//       await UpdateConversation({
//         id: DiscussionRoomData._id,
//         conversation: conversation,
//       });
//     } catch (error) {
//       console.error("Error updating conversation:", error);
//     }

//     setIsLoading(false);
//     setEnableFeedbackNotes(true);
//   };

//   const toggleMute = () => {
//     if (vapiRef.current && isVapiConnected) {
//       vapiRef.current.setMuted(!isMuted);
//       setIsMuted(!isMuted);
//     }
//   };

//   const getStatusColor = () => {
//     switch (vapiStatus) {
//       case "connected":
//         return "text-green-600";
//       case "listening":
//         return "text-blue-600";
//       case "processing":
//         return "text-yellow-600";
//       case "error":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getStatusText = () => {
//     switch (vapiStatus) {
//       case "connected":
//         return "🎤 Ready to listen";
//       case "listening":
//         return "👂 Listening...";
//       case "processing":
//         return "🤔 Processing...";
//       case "error":
//         return "❌ Connection error";
//       default:
//         return "⚪ Disconnected";
//     }
//   };

//   return (
//     <div className="-mt-12">
//       <h2 className="text-lg font-bold">{DiscussionRoomData?.expertType}</h2>

//       {connectionError && (
//         <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {connectionError}
//         </div>
//       )}

//       <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2">
//           <div className="lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
//             {expert?.avatar && (
//               <>
//                 <Image
//                   src={expert.avatar}
//                   alt="Avatar"
//                   width={200}
//                   height={200}
//                   className={`h-[80px] w-[80px] rounded-full object-cover ${
//                     vapiStatus === "listening"
//                       ? "animate-pulse ring-4 ring-blue-400"
//                       : vapiStatus === "processing"
//                       ? "animate-bounce"
//                       : ""
//                   }`}
//                 />
//                 <h2 className="text-gray-500 mt-2">{expert?.name}</h2>
//                 <div className={`mt-2 text-sm font-medium ${getStatusColor()}`}>
//                   {getStatusText()}
//                 </div>
//                 <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
//                   <UserButton />
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="mt-5 flex items-center justify-center gap-4">
//             {!isVapiConnected ? (
//               <Button
//                 onClick={connectToVapi}
//                 disabled={isLoading || !DiscussionRoomData || !expert}
//                 className="min-w-[120px]"
//               >
//                 {isLoading && <Loader2Icon className="animate-spin mr-2" />}
//                 <Mic className="mr-2 h-4 w-4" />
//                 Connect
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   variant="destructive"
//                   onClick={disconnectFromVapi}
//                   disabled={isLoading}
//                   className="min-w-[120px]"
//                 >
//                   {isLoading && <Loader2Icon className="animate-spin mr-2" />}
//                   <MicOff className="mr-2 h-4 w-4" />
//                   Disconnect
//                 </Button>

//                 <Button
//                   variant="outline"
//                   onClick={toggleMute}
//                   disabled={!isVapiConnected}
//                 >
//                   {isMuted ? (
//                     <VolumeX className="h-4 w-4" />
//                   ) : (
//                     <Volume2 className="h-4 w-4" />
//                   )}
//                 </Button>
//               </>
//             )}
//           </div>

//           {isVapiConnected && (
//             <div className="mt-3 text-center">
//               <p className="text-sm text-gray-600">
//                 Voice AI is active with {expert?.name}'s voice
//               </p>
//             </div>
//           )}
//         </div>

//         <ChatBox
//           conversation={conversation}
//           enableFeedbackNotes={enableFeedbackNotes}
//           expertType={DiscussionRoomData?.expertType}
//         />
//       </div>
//     </div>
//   );
// }

// export default DiscussionRoom;



// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { ExpertsExpert, ExpertsList } from "@/services/Options";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { UserButton } from "@stackframe/stack";
// import { Loader2Icon, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
// import ChatBox from "./_components/ChatBox";
// import { startVapiSession, stopVapiSession } from "@/services/GlobalService";
// import { getVapiClient as getVapiClientDirect } from "@/services/VapiService";

// function DiscussionRoom() {
//   const { roomid } = useParams();

//   const DiscussionRoomData = useQuery(
//     api.DiscussionRoom.GetDiscussionRoom,
//     roomid ? { id: roomid } : "skip"
//   );

//   const [expert, setExpert] = useState();
//   const [isVapiConnected, setIsVapiConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversation, setConversation] = useState([
//     {
//       role: "assistant",
//       content: "Hello, I'm your voice assistant, developed by Eric Sandhu.",
//       timestamp: Date.now()
//     },
//   ]);
//   const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
//   const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
//   const [vapiStatus, setVapiStatus] = useState("disconnected");
//   const [isMuted, setIsMuted] = useState(false);
//   const [connectionError, setConnectionError] = useState(null);

//   const vapiRef = useRef(null);
//   const seenTranscripts = useRef(new Set());

//   useEffect(() => {
//     if (DiscussionRoomData?.ExpertsExpert) {
//       const Expert = ExpertsExpert.find(
//         (item) => item.name === DiscussionRoomData.ExpertsExpert
//       );
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const vapi = getVapiClientDirect();
//       vapiRef.current = vapi;

//       vapi.on("call-start", () => {
//         setVapiStatus("connected");
//         setIsVapiConnected(true);
//         setConnectionError(null);
//       });

//       vapi.on("call-end", () => {
//         setVapiStatus("disconnected");
//         setIsVapiConnected(false);
//       });

//       vapi.on("speech-start", () => {
//         setVapiStatus("listening");
//       });

//       vapi.on("speech-end", () => {
//         setVapiStatus("processing");
//       });

//       vapi.on("message", (message) => {
//         console.log("Vapi message:", message);

//         if (message.type === "transcript" && message.transcriptType === "final") {
//           const text = message.transcript;
//           if (seenTranscripts.current.has(text)) return;
//           seenTranscripts.current.add(text);

//           setConversation((prev) => [
//             ...prev,
//             { role: "user", content: text, timestamp: Date.now() }
            
//           ]);
//         }

//         if (message.type === "transcript" &&  message.transcriptType === "response") {
//           setConversation((prev) => [
//             ...prev,
//             { role: "assistant", content:text, timestamp: Date.now() }
//           ]);
//         }

//         if (message.type === "function-call") {
//           console.log("Function call:", message);
//         }
//       });

//       vapi.on("error", (error) => {
//         let errorMessage = "Unknown connection error";

//         if (typeof error === "string" && error.trim()) {
//           errorMessage = error;
//         } else if (typeof error === "object" && error !== null) {
//           if (error.message) {
//             errorMessage = error.message;
//           } else if (error.error) {
//             errorMessage = typeof error.error === "string" ? error.error : error.error.message || "Connection failed";
//           } else if (error.code) {
//             errorMessage = `Error code: ${error.code}`;
//           } else if (error.type) {
//             errorMessage = `Error type: ${error.type}`;
//           } else {
//             const errorInfo = Object.entries(error)
//               .filter(([_, value]) => value !== null && value !== undefined)
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(", ");
//             errorMessage = errorInfo || "Unknown error format";
//           }
//         }

//         setConnectionError(errorMessage);
//         setVapiStatus("error");
//         setIsVapiConnected(false);
//       });

//       return () => {
//         if (vapi && typeof vapi.stop === 'function') {
//           vapi.stop();
//         }
//       };
//     }
//   }, []);

//   const connectToVapi = async () => {
//     if (!DiscussionRoomData || !expert) {
//       setConnectionError("Missing discussion room data or expert information");
//       return;
//     }

//     const expertWithPrompt = ExpertsList.find(
//       (item) => item.name === DiscussionRoomData.expertType
//     );

//     if (!expertWithPrompt || !expertWithPrompt.prompt) {
//       setConnectionError(`Expert "${DiscussionRoomData.expertType}" not found in ExpertsList or missing prompt`);
//       return;
//     }

//     setIsLoading(true);
//     setConnectionError(null);

//     try {
//       await startVapiSession(
//         expert.name,
//         DiscussionRoomData.topic,
//         DiscussionRoomData.expertType
//       );
//     } catch (error) {
//       setConnectionError(error.message || "Failed to connect to voice assistant");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const disconnectFromVapi = async () => {
//     setIsLoading(true);
//     try {
//       await stopVapiSession();
//     } catch (error) {
//       console.error("Error stopping Vapi conversation:", error);
//     }

//     setVapiStatus("disconnected");
//     setIsVapiConnected(false);

//     try {
//       if (DiscussionRoomData?._id) {
//         await UpdateConversation({
//           id: DiscussionRoomData._id,
//           conversation: conversation,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating conversation:", error);
//     }

//     setIsLoading(false);
//     setEnableFeedbackNotes(true);
//   };

//   const toggleMute = () => {
//     if (vapiRef.current && isVapiConnected && typeof vapiRef.current.setMuted === 'function') {
//       vapiRef.current.setMuted(!isMuted);
//       setIsMuted(!isMuted);
//     }
//   };

//   const getStatusColor = () => {
//     switch (vapiStatus) {
//       case "connected":
//         return "text-green-600";
//       case "listening":
//         return "text-blue-600";
//       case "processing":
//         return "text-yellow-600";
//       case "error":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getStatusText = () => {
//     switch (vapiStatus) {
//       case "connected":
//         return "🎤 Ready to listen";
//       case "listening":
//         return "👂 Listening...";
//       case "processing":
//         return "🤔 Processing...";
//       case "error":
//         return "❌ Connection error";
//       default:
//         return "⚪ Disconnected";
//     }
//   };

//   if (!DiscussionRoomData) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2Icon className="animate-spin h-8 w-8" />
//         <span className="ml-2">Loading discussion room...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="-mt-12">
//       <h2 className="text-lg font-bold">{DiscussionRoomData?.expertType}</h2>

//       {connectionError && (
//         <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {connectionError}
//         </div>
//       )}

//       <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2">
//           <div className="lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
//             {expert?.avatar && (
//               <>
//                 <Image
//                   src={expert.avatar}
//                   alt={`${expert.name} Avatar`}
//                   width={200}
//                   height={200}
//                   className={`h-[80px] w-[80px] rounded-full object-cover ${
//                     vapiStatus === "listening"
//                       ? "animate-pulse ring-4 ring-blue-400"
//                       : vapiStatus === "processing"
//                       ? "animate-bounce"
//                       : ""
//                   }`}
//                 />
//                 <h2 className="text-gray-500 mt-2">{expert?.name}</h2>
//                 <div className={`mt-2 text-sm font-medium ${getStatusColor()}`}>
//                   {getStatusText()}
//                 </div>
//                 <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
//                   <UserButton />
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="mt-5 flex items-center justify-center gap-4">
//             {!isVapiConnected ? (
//               <Button
//                 onClick={connectToVapi}
//                 disabled={isLoading || !DiscussionRoomData || !expert}
//                 className="min-w-[120px]"
//               >
//                 {isLoading && <Loader2Icon className="animate-spin mr-2" />}
//                 <Mic className="mr-2 h-4 w-4" />
//                 Connect
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   variant="destructive"
//                   onClick={disconnectFromVapi}
//                   disabled={isLoading}
//                   className="min-w-[120px]"
//                 >
//                   {isLoading && <Loader2Icon className="animate-spin mr-2" />}
//                   <MicOff className="mr-2 h-4 w-4" />
//                   Disconnect
//                 </Button>

//                 <Button
//                   variant="outline"
//                   onClick={toggleMute}
//                   disabled={!isVapiConnected}
//                 >
//                   {isMuted ? (
//                     <VolumeX className="h-4 w-4" />
//                   ) : (
//                     <Volume2 className="h-4 w-4" />
//                   )}
//                 </Button>
//               </>
//             )}
//           </div>

//           {isVapiConnected && (
//             <div className="mt-3 text-center">
//               <p className="text-sm text-gray-600">
//                 Voice AI is active with {expert?.name}'s voice
//               </p>
//             </div>
//           )}
//         </div>

//         <ChatBox
//           conversation={conversation}
//           enableFeedbackNotes={enableFeedbackNotes}
//           expertType={DiscussionRoomData?.expertType}
//         />
//       </div>
//     </div>
//   );
// }

// export default DiscussionRoom;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ExpertsExpert, ExpertsList } from "@/services/Options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import { Loader2Icon, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { startVapiSession, stopVapiSession } from "@/services/GlobalService";
import { getVapiClient as getVapiClientDirect } from "@/services/VapiService";

function DiscussionRoom() {
  const { roomid } = useParams();

  const DiscussionRoomData = useQuery(
    api.DiscussionRoom.GetDiscussionRoom,
    roomid ? { id: roomid } : "skip"
  );

  const [expert, setExpert] = useState();
  const [isVapiConnected, setIsVapiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello, I'm your voice assistant, developed by Eric Sandhu.",
      timestamp: Date.now()
    },
  ]);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const [vapiStatus, setVapiStatus] = useState("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const vapiRef = useRef(null);
  const seenTranscripts = useRef(new Set());

  useEffect(() => {
    if (DiscussionRoomData?.ExpertsExpert) {
      const Expert = ExpertsExpert.find(
        (item) => item.name === DiscussionRoomData.ExpertsExpert
      );
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vapi = getVapiClientDirect();
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setVapiStatus("connected");
        setIsVapiConnected(true);
        setConnectionError(null);
      });

      vapi.on("call-end", () => {
        setVapiStatus("disconnected");
        setIsVapiConnected(false);
      });

      vapi.on("speech-start", () => {
        setVapiStatus("listening");
      });

      vapi.on("speech-end", () => {
        setVapiStatus("processing");
      });

      vapi.on("message", (message) => {
        console.log("Vapi message:", message);

        if (message.type === "transcript" && message.transcriptType === "final") {
          const text = message.transcript;
          if (seenTranscripts.current.has(text)) return;
          seenTranscripts.current.add(text);

          setConversation((prev) => [
            ...prev,
            { role: "user", content: text, timestamp: Date.now() }
          ]);
        }

        // Fixed: Use message.transcript instead of undefined 'text' variable
        if (message.type === "transcript" && message.transcriptType === "response") {
          const assistantText = message.transcript;
          if (assistantText && assistantText.trim()) {
            setConversation((prev) => [
              ...prev,
              { role: "assistant", content: assistantText, timestamp: Date.now() }
            ]);
          }
        }

        if (message.type === "function-call") {
          console.log("Function call:", message);
        }
      });

      vapi.on("error", (error) => {
        let errorMessage = "Unknown connection error";

        if (typeof error === "string" && error.trim()) {
          errorMessage = error;
        } else if (typeof error === "object" && error !== null) {
          if (error.message) {
            errorMessage = error.message;
          } else if (error.error) {
            errorMessage = typeof error.error === "string" ? error.error : error.error.message || "Connection failed";
          } else if (error.code) {
            errorMessage = `Error code: ${error.code}`;
          } else if (error.type) {
            errorMessage = `Error type: ${error.type}`;
          } else {
            const errorInfo = Object.entries(error)
              .filter(([_, value]) => value !== null && value !== undefined)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");
            errorMessage = errorInfo || "Unknown error format";
          }
        }

        setConnectionError(errorMessage);
        setVapiStatus("error");
        setIsVapiConnected(false);
      });

      return () => {
        if (vapi && typeof vapi.stop === 'function') {
          vapi.stop();
        }
      };
    }
  }, []);

  const connectToVapi = async () => {
    if (!DiscussionRoomData || !expert) {
      setConnectionError("Missing discussion room data or expert information");
      return;
    }

    const expertWithPrompt = ExpertsList.find(
      (item) => item.name === DiscussionRoomData.expertType
    );

    if (!expertWithPrompt || !expertWithPrompt.prompt) {
      setConnectionError(`Expert "${DiscussionRoomData.expertType}" not found in ExpertsList or missing prompt`);
      return;
    }

    setIsLoading(true);
    setConnectionError(null);

    try {
      await startVapiSession(
        expert.name,
        DiscussionRoomData.topic,
        DiscussionRoomData.expertType
      );
    } catch (error) {
      setConnectionError(error.message || "Failed to connect to voice assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromVapi = async () => {
    setIsLoading(true);
    try {
      await stopVapiSession();
    } catch (error) {
      console.error("Error stopping Vapi conversation:", error);
    }

    setVapiStatus("disconnected");
    setIsVapiConnected(false);

    try {
      if (DiscussionRoomData?._id) {
        await UpdateConversation({
          id: DiscussionRoomData._id,
          conversation: conversation,
        });
      }
    } catch (error) {
      console.error("Error updating conversation:", error);
    }

    setIsLoading(false);
    setEnableFeedbackNotes(true);
  };

  const toggleMute = () => {
    if (vapiRef.current && isVapiConnected && typeof vapiRef.current.setMuted === 'function') {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const getStatusColor = () => {
    switch (vapiStatus) {
      case "connected":
        return "text-green-600";
      case "listening":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (vapiStatus) {
      case "connected":
        return "🎤 Ready to listen";
      case "listening":
        return "👂 Listening...";
      case "processing":
        return "🤔 Processing...";
      case "error":
        return "❌ Connection error";
      default:
        return "⚪ Disconnected";
    }
  };

  if (!DiscussionRoomData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading discussion room...</span>
      </div>
    );
  }

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{DiscussionRoomData?.expertType}</h2>

      {connectionError && (
        <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {connectionError}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar && (
              <>
                <Image
                  src={expert.avatar}
                  alt={`${expert.name} Avatar`}
                  width={200}
                  height={200}
                  className={`h-[80px] w-[80px] rounded-full object-cover ${
                    vapiStatus === "listening"
                      ? "animate-pulse ring-4 ring-blue-400"
                      : vapiStatus === "processing"
                      ? "animate-bounce"
                      : ""
                  }`}
                />
                <h2 className="text-gray-500 mt-2">{expert?.name}</h2>
                <div className={`mt-2 text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
                <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
                  <UserButton />
                </div>
              </>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            {!isVapiConnected ? (
              <Button
                onClick={connectToVapi}
                disabled={isLoading || !DiscussionRoomData || !expert}
                className="min-w-[120px]"
              >
                {isLoading && <Loader2Icon className="animate-spin mr-2" />}
                <Mic className="mr-2 h-4 w-4" />
                Connect
              </Button>
            ) : (
              <>
                <Button
                  variant="destructive"
                  onClick={disconnectFromVapi}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading && <Loader2Icon className="animate-spin mr-2" />}
                  <MicOff className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>

                <Button
                  variant="outline"
                  onClick={toggleMute}
                  disabled={!isVapiConnected}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>

          {isVapiConnected && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Voice AI is active with {expert?.name}'s voice
              </p>
            </div>
          )}
        </div>

        <ChatBox
          conversation={conversation}
          enableFeedbackNotes={enableFeedbackNotes}
          expertType={DiscussionRoomData?.expertType}
        />
      </div>
    </div>
  );
}

export default DiscussionRoom;

import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalService';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from "@/convex/_generated/api";
import { toast } from 'sonner';


function ChatBox({ conversation, enableFeedbackNotes, expertType}) {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    // Remove duplicates based on content and role
    const uniqueConversation = conversation?.filter((item, index, arr) => {
        // Keep first occurrence of each unique message
        return arr.findIndex(msg => 
            msg.content === item.content && 
            msg.role === item.role
        ) === index;
    }) || [];

    const [loading,setLoading]=useState(false);
    const UpdateSummery=useMutation(api.DiscussionRoom.UpdateSummery)
    const {roomid}=useParams();
    const GenerateFeedbackNotes= async()=>{
        setLoading(true);
        try{
        const result = await AIModelToGenerateFeedbackAndNotes(expertType, conversation);
        console.log(result.content);
        setLoading(false);
        await UpdateSummery({
            id:roomid,
            summery:result.content
        })
         setLoading(false);
         toast('Feedback/Notes Saved ')
    
          }
          catch(e)
          {
            setLoading(false);
            toast('Internal Server Error , Try Again')

          }
           
    };

    return (
        <div>
            <div className='h-[60vh] bg-secondary border rounded-4xl flex flex-col relative p-4 overflow-auto'>
                {/* Empty state */}
                {(!uniqueConversation || uniqueConversation.length === 0) ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">💬</div>
                            <p className="text-sm">Start your conversation...</p>
                            <p className="text-xs mt-1">Your voice chat will appear here</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-3">
                        {uniqueConversation.map((item, index) => (
                            <div 
                                className={`flex ${item?.role === 'user' ? 'justify-end' : 'justify-start'}`} 
                                key={`${item.role}-${index}-${item.content?.substring(0, 20)}`}
                            >
                                {item?.role === 'assistant' ? (
                                    // Assistant messages - Left side with blue background
                                    <div className="flex items-start space-x-3 max-w-[75%]">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-white text-sm">🤖</span>
                                        </div>
                                        <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tl-sm shadow-sm">
                                            <p className="text-sm leading-relaxed">{item?.content}</p>
                                            <span className="text-xs opacity-80 mt-1 block">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ) : item?.role === 'user' ? (
                                    // User messages - Right side with gray background
                                    <div className="flex items-start space-x-3 max-w-[75%]">
                                        <div className="bg-gray-300 text-black p-3 rounded-lg rounded-tr-sm shadow-sm">
                                            <p className="text-sm leading-relaxed">{item?.content}</p>
                                            <span className="text-xs opacity-70 mt-1 block text-right">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-white text-sm">👤</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                        {/* Auto-scroll target */}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            
            {/* Footer message */}
            {!enableFeedbackNotes ? (
                <h2 className="mt-4 text-gray-400 text-sm flex items-center justify-center">
                    <span className="mr-2">📝</span>
                    At the end of your conversation we will automatically generate feedback/notes from your conversation
                </h2>
            ) : (
                <div className="mt-4 flex justify-center">
                    <Button onClick={GenerateFeedbackNotes} disabled={loading} className="mt-7 w-full">
                        {loading && <LoaderCircle className='animate-spin w-4 h-4'/>}
                        Generate Feedback/Notes
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ChatBox;



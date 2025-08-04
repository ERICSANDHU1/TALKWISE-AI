//  "use client"
 
// // import { UserContext } from '@/app/_context/UserContext';
// import { useConvex } from 'convex/react'
// import React, { useEffect } from 'react'
// import { useAuth } from '@/app/AuthProvider';
// import { api } from '@/convex/_generated/api';

// function History() {

//     const convex=useConvex();
//     // const {userData}=useContext(UserContext);
//     const { userData } = useAuth();

//     useEffect(()=> {
//         userData&&GetDiscussionRoom();
//     },[userData])

//     const GetDiscussionRoom= async()=>{
//         const result=await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
//             uid:userData?._id
//         });
//         console.log(result);

//     }

//     return (
//         <div>
//             <h2 className='font-bold text-xl'>Your Previous Lectures</h2>
//             <h2 className='text-gray-400'>You don't have any Previous Lectures</h2>
//         </div>
//     )
// }

// export default History
    

"use client"
 
import { useConvex } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/AuthProvider';
import { api } from '@/convex/_generated/api';
// import { Card } from "@/components/ui/card";
import { Calendar, MessageSquare, User } from 'lucide-react';

function History() {
    const convex = useConvex();
    const { userData } = useAuth();
    const [discussionRooms, setDiscussionRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userData && GetDiscussionRoom();
    }, [userData])

    const GetDiscussionRoom = async () => {
        try {
            setLoading(true);
            const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom, {
                uid: userData?._id
            });
            console.log("Discussion rooms:", result);
            setDiscussionRooms(result || []);
        } catch (error) {
            console.error("Error fetching discussion rooms:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading your history...</span>
            </div>
        );
    }

    return (
        <div>
            <h2 className='font-bold text-xl mb-4'>Your Previous Lectures</h2>
            
            {discussionRooms.length === 0 ? (
                <h2 className='text-gray-400'>You don't have any Previous Lectures</h2>
            ) : (
                <div className="grid gap-4">
                    {discussionRooms.map((room) => (
                        <Card key={room._id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4 text-blue-600" />
                                        <h3 className="font-semibold text-lg">{room.expertType}</h3>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-2">{room.topic}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(room._creationTime)}</span>
                                        </div>
                                        
                                        {room.conversation && (
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{room.conversation.length} messages</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History

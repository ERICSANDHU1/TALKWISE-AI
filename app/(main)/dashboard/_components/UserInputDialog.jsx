import React, { useContext, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { ExpertsExpert } from '@/services/Options';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useMutation } from 'convex/react';
import{ api } from '@/convex/_generated/api'
import { UserCircle as LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { UserContext } from '@/app/_context/UserContext';
import { useAuth } from '@/app/AuthProvider';




function UserInputDialog({ children, ExpertsList }) {

    const [selectedExpert,setSelectedExpert]=useState();
    const [topic,setTopic]=useState();
    const createDiscussionRoom=useMutation(api.DiscussionRoom.CreateNewRoom);
    const[loading,setLoading]=useState(false);
    const [openDialog,setOpenDialog]=useState(false);
    const router=useRouter();
    // const {userData}=useContext(UserContext);
    const { userData } = useAuth();
     // Add error handling for undefined context
    // const contextValue = useContext(UserContext);
    // const { userData } = contextValue || {};

    // Add loading state check
    // if (contextValue?.loading) {
    //     return <div>Loading...</div>;
    // }
    

    
    const OnClickNext=async()=>{
        setLoading(true);
        try {
            const result=await createDiscussionRoom({
                topic: topic,
                ExpertsExpert: selectedExpert, // ✅ This should be the selected expert avatar name (REAVA, VANSHIKA, ERIC)
                expertType: ExpertsList?.name,   // ✅ This should be the expert type (Lecture on Topic, Mock Interview, etc.)
                uid: userData?._id
                // uid: userData?._id || undefined
            });
            console.log(result);
            setLoading(false);
            setOpenDialog(false);
            router.push('/discussion-room/'+ result);
        } catch (error) {
            console.error("Error creating room:", error);
            setLoading(false);
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ExpertsList.name}</DialogTitle>
              <DialogDescription className="text-black font-semibold mt-1">
                Enter a topic to master your skills in {ExpertsList.name}
              </DialogDescription>

              <div className='mt-3'>
               
                <Textarea placeholder="Enter Your Topic Here... " className='mt-2'
                onChange={(e) => setTopic(e.target.value)}
                />

                 <h2 className="text-black mt-5 font-semibold transition-all">
                  Select Your instructor:
                </h2>
                <div className='grid grid-cols-3 md:grid-cols-5 gap-6'>
                    {ExpertsExpert.map((expert,index)=>( 
                        <div  key={index} onClick={() => setSelectedExpert(expert.name)}
                        // className={'${selectedExpert==expert.name&&'border-2'} p-1'}
                        >
                        <Image
                        src={expert.avatar}
                         alt={expert.name}
                        width={100}
                        height={100}
                        className={`rounded-2xl h-[80px] w-[80px] object-cover mt-3 hover:scale-105 transition-all
                        cursor-pointer p-1 border-primary ${
                          selectedExpert==expert.name ? 'border-2' : ''
                        }`}
                        />
                        <h2 className='text-center'>{expert.name}</h2>
                        </div>
                    )
                )}
                </div>

                <div className='flex gap-5 justify-end mt-5' >
                    <DialogClose asChild>
                    <Button variant={'ghost'}>Cancel</Button> 
                    </DialogClose>
                    {/* <Button>Next</Button> */}
                    <Button disabled={(!topic || !selectedExpert || loading )} onClick={OnClickNext}>
                        {loading&&<LoaderCircle className='animate-spin' />}
                        Next
                    </Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog;
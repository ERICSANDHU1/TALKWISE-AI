"use client"
import { useUser } from '@stackframe/stack'
import { Button } from "@/components/ui/button";
import React from 'react'
import Image from 'next/image'; 
import { ExpertsList } from '/services/options';
import { BlurFade } from '@/components/magicui/blur-fade';
import UserInputDialog from './UserInputDialog';
// Needed for <Image />
// Assuming ExpertsList is defined somewhere

function FeatureAssistant() {
    const user = useUser();

    return (
        <div>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-medium text-gray-500'> My workspace</h2>
                    <h2 className='text-3xl font-bold'> Welcome Back, {user?.displayName} </h2>
                </div>
                <Button>Profile</Button>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10'>
                {ExpertsList.map((option, index) => (
                     <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
                        <div key={index} className='flex flex-col justify-center items-center'>
                        <UserInputDialog ExpertsList={option} >
                    <div key={index} className='p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center'>
                        <Image 
                            src={option.icon} 
                            alt={option.name}
                            width={150}
                            height={150}
                            className='h-[70px] w-[70px] hover:rotate-12 cursor-pointer transition-all'
                        />
                        <h2 className='mt-3'>{option.name}</h2>
                    </div>
                    </UserInputDialog>
                    </div>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistant

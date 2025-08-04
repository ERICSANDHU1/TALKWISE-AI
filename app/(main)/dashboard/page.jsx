import React from 'react'
import FeatureAssistant  from './_components/FeatureAssistant'
// import { History } from 'lucide-react'
import Feedback from './_components/Feedback'
import History from './_components/History'

function Dashboard() {
    return (
        <div>
            <FeatureAssistant />

            <div className='grid grid=cols-1 md:grid-cols-2 gap-10 mt-20'>
                <History/>
                <Feedback />
            </div>
        </div>
    )
}

export default Dashboard
    

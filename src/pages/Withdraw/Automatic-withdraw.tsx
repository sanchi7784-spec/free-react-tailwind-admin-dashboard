import React from 'react'
import { Webhook } from 'lucide-react'
import { Workflow } from 'lucide-react'
import { Landmark } from 'lucide-react'
import { AlarmClockCheckIcon } from 'lucide-react'
import { Calendar } from 'lucide-react'
 import logo from "./../../images/flutterwave.png";
const AutomaticWithdraw = () => {
  return (
    <div>

        <h1 className='text-3xl dark:text-white' style={{fontWeight:"800"}}>Automatic-WithDraw</h1>
                   <div className='h-20 bg-gray-200 mt-10 pt-2 dark:bg-gray-800 flex'>
                <button className=' flex p-5 rounded-xl ml-3 dark:text-white h-15 text-blue'><Webhook />Pending Withdraw</button>
                <button className='bg-sky-700 flex p-5 rounded-xl ml-3 dark:text-white h-15 text-white'><Workflow />Automatic Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Landmark />Manual Method</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><AlarmClockCheckIcon />Withdraw Schedule</button>
                <button className='flex p-5 rounded-xl ml-3 dark:text-white'><Calendar />Withdraw History</button>
            </div>

<div className='bg-gray-200 h-80 mt-10 p-5'>
    <div style={{ borderBottom: '1px solid #928f8fff'}} className='p-5'>
        <h2>Withdraw Methods</h2>
    </div>
    <h2 className='pt-5 px-5 pb-4'>All the Withdraw Methods setup for user</h2>
<div className='p-10 px-2' style={{border:'1px solid #928f8fff'}}>
  <img src={logo} alt=""  className=' w-40' />
</div>
</div>
        </div>

  )
}

export default AutomaticWithdraw
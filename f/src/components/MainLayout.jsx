import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    // <div>
    //      <LeftSidebar/>
    //     <div>
    //         <Outlet/>
    //     </div>
    // </div>
    // MainLayout.jsx
<div>
    <LeftSidebar />
    <div className='lg:ml-[16%]'>
        <Outlet />
    </div>
</div>
  )
}

export default MainLayout
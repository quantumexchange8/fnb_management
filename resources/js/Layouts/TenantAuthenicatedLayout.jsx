import ApplicationLogo from '@/Components/ApplicationLogo';
import { CustomToaster } from '@/Components/CustomToaster';
import Dropdown from '@/Components/Dropdown';
import Navbar from '@/Components/Navbar';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SideBar from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function TenantAuthenicatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

     const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) { // md breakpoint (768px)
                setIsSidebarExpanded(true);
            } else {
                setIsSidebarExpanded(false);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-25">
            <CustomToaster />
            <SideBar expanded={isSidebarExpanded} user={user} showingNavigationDropdown={showingNavigationDropdown} toggleSidebar={toggleSidebar} />

            <div className={`min-h-screen flex flex-col ${isSidebarExpanded ? 'md:ml-60' : 'translate-x-0 md:ml-[74px]'}`}>
                <Navbar header={header} toggleSidebar={toggleSidebar} expanded={isSidebarExpanded}/>

                <main className='w-full flex justify-center'>
                    <div className='max-w-[1440px] w-full rounded-xl'>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

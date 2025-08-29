import { Fragment, useEffect, useState } from 'react';
// import { LogoutIcon, MenuIcon, NotificationIcon, XIcon } from './Icon/outline';
import { useForm, usePage } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
// import PrimeModal from './PrimeModal';
import Modal from './Modal';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import { ConfirmLogoutIcon } from "@/Components/Icon/Brand";
import Button from './Button';
import { LangIcon, LogoutIcon, MenuIcon } from './Icon/Outline';
// import toast from 'react-hot-toast';

export default function Navbar({ user, header, toggleSidebar }) {

    const { auth } = usePage().props;

    const [isOpen, setIsOpen] = useState(false)
    const [scroll, setScroll] = useState(true)

    const { data, setData, post, processing, reset } = useForm({});

    const controlNavbar = () => {
        if (window.scrollY > 100) {
            setScroll(false)
        } else {
            setScroll(true)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar)
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [])

    const logout = () => {
        post(route('tenant.logout'));
    }

    return (
        <nav className={`sticky top-0 z-20 ease-in duration-500 w-full md:shadow-navbar`}>
            <div className='flex items-center justify-between bg-neutral-25 p-4'>
                <div className='flex items-center gap-6'>
                    <div className='p-2.5 border border-neutral-200 shadow-[0_1px_2px_0_rgba(9,9,11,0.05)] cursor-pointer hover:bg-neutral-50 rounded-full' onClick={toggleSidebar}>
                        <MenuIcon />
                    </div>
                    {/* <div className='text-gray-950 text-base font-bold'>
                        {header}
                    </div> */}
                </div>

                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <div className='bg-neutral-25 rounded-full hover:bg-neutral-50 p-2.5 cursor-pointer'>
                            <LangIcon />
                        </div>
                        <div className='bg-neutral-25 rounded-full hover:bg-neutral-50 p-2.5 cursor-pointer' onClick={logout}>
                            <LogoutIcon />
                        </div>
                    </div>
                    
                    <div className='hidden md:flex items-center gap-3 cursor-pointer hover:bg-gray-25 rounded drop-shadow hover:drop-shadow-md' >
                        <div className='flex flex-col items-end'>
                            <div className='text-neutral-950 font-semibold text-sm leading-tight'>
                                {auth.user.name}
                            </div>
                            <div className='text-gray-600 text-xss font-medium leading-tight'>
                                {auth.user.email}
                            </div>
                        </div>
                        <img className='object-cover w-8 h-8 rounded-full' src='https://img.freepik.com/free-icon/user_318-159711.jpg' alt="merchant_pic" />
                    </div>
                </div>
            </div>

            {/* <PrimeModal header='Profile Details' visible={visible} setVisible={setVisible} size="xl">
                <div>
                    test
                </div>
            </PrimeModal> */}
            {/* <Modal 
                title='Profile' 
                maxWidth='md' 
                maxHeight='md' 
                isOpen={isOpen} 
                close={closeModal}
                closeIcon={<XIcon />}
            >
                
            </Modal> */}

            {/* <ConfirmDialog
                group="navbar"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="relative flex flex-col gap-6 items-center p-5 rounded-lg border border-primary-200 max-w-[300px] bg-white">
                        <div className="w-full flex justify-center h-3 pt-4">
                            <div className="absolute top-[-42px]">
                                <ConfirmLogoutIcon />
                            </div>
                        </div>
                        <div className='flex flex-col gap-3 items-center'>
                            <div className="font-bold text-lg text-neutral-950 font-sf-pro" ref={headerRef}>
                                {message.header}
                            </div>
                            <div className='text-neutral-950 text-base font-sf-pro text-center' ref={contentRef}>
                                {message.message}
                            </div>
                        </div>
                        <div className="w-full flex items-center gap-2 " ref={footerRef}>
                            <Button
                                onClick={(event) => {
                                    hide(event);
                                    rejectNavbar();
                                }}
                                size='lg'
                                variant='secondary'
                                className="w-full flex justify-center font-sf-pro"
                            >Cancel</Button>
                            <Button
                                onClick={(event) => {
                                    hide(event);
                                    acceptNavbar();
                                    onSubmit();
                                }}
                                size='lg'
                                className="w-full flex justify-center font-sf-pro bg-[#0060FF]"
                            >Confirm</Button>
                            
                        </div>
                    </div>
                )}
            /> */}
        </nav>
    )
}
import React from "react";
import { Link, useForm, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
// import { EinbillLogo } from "@/Components/Icon/logo";
import { ChevronDown, ChevronUp, ConfigurationIcon, CornerDownRight, DashboardIcon, HistoryIcon, LogoutIcon, MemberIcon, TableIcon, VoucherIcon, WalletIcon, XIcon, PointIcon, OrderIcon, CategoryIcon, ItemIcon, TransactionIcon, MenuIcon, FoodIcon} from "./Icon/Outline";
import { useState } from "react";
import { useEffect } from "react";
import { LogoutImg } from "./Icon/Brand";
import Button from "./Button";
import { Menu } from "antd";

export default function SideBar({ user, showingNavigationDropdown, expanded, toggleSidebar }) {

    const { url } = usePage();
    const [walletExpand, setWalletExpand] = useState(false);
    const [foodExpand, setFoodExpand] = useState(false);
    const [voucherExpand, setVoucherExpand] = useState(false);

    const { datas, setData, post, processing, reset } = useForm({});

    const foodRoutes = [
        { name: "Category List", path: "/items-management/category-list" },
        { name: "Create Category", path: "/items-management/create-category" },
        { name: "Product List", path: "/items-management/product-list" },
        { name: "Create Product", path: "/items-management/create-product" },
        { name: "Create Set Meal", path: "/items-management/create-set-meal" },
        { name: "Modifier Group List", path: "/items-management/modifier-group-list" },
        { name: "Create Modifier Group", path: "/items-management/create-modifier-group" },
        { name: "Manage Modifier Item", path: "/items-management/manage-modifier-item" },
    ];

    const isActive = (paths) => paths.includes(url);


    const confirmLogout = () => {
        post(route('logout'));
    }

    const cancelLogout = () => {

    }

    const walletDropDown = () => {
        setWalletExpand(!walletExpand)
    }

    const voucherDropDown = () => {
        setVoucherExpand(!voucherExpand)
    }

    useEffect(() => {
        if (isActive(foodRoutes.map(r => r.path))) {
            setFoodExpand(true);
        }
    }, [url]);

    const toggleFood = () => setFoodExpand(!foodExpand);

    return (
        <>
            <div className={`${expanded ? 'fixed inset-0 z-20 bg-black/50 md:hidden' : ''} `} onClick={toggleSidebar}></div>
            <aside className={`
                    fixed inset-y-0 z-20 max-w-60 bg-gray-25 overflow-hidden
                    shadow-container min-h-screen bg-neutral-800
                    scrollbar-thin scrollbar-webkit
                    transition-all duration-300 ease-in-out
                    ${expanded 
                    ? 'translate-x-0 w-60' 
                    : 'translate-x-[-100%] md:translate-x-0 md:w-[75px]'
                    }
                `}
            >
                <nav className="flex flex-col gap-5 shadow-container min-h-screen bg-neutral-800">
                    {!expanded ? (
                        <div className="p-4 flex justify-center items-center">
                            {/* <img src="/assets/logo.png" alt="" className="w-8"/> */}
                        </div>
                    ) : (
                        <div className="flex justify-between items-center p-4">
                            {/* <img src="/assets/logo.png" alt="" className="w-12 h-12" /> */}
                            <div className="block cursor-pointer md:hidden" onClick={toggleSidebar}>
                                <XIcon />
                            </div>
                        </div>
                    )}
                    <div className={`flex flex-col gap-2 ${!expanded ? 'items-center': ''}`}>
                        <div className="w-full">
                            {
                                !expanded ? (
                                    <Link href={route('tenant.dashboard')} className={`${
                                        url === '/tenant/dashboard' ? 'w-full text-secondary-700 font-semibold' : 'text-white'
                                    }`}>
                                        <div className={`${url === '/tenant/dashboard' ? 'w-full flex justify-center py-2 drop-shadow bg-primary-500 ' : ' w-full flex justify-center p-2 hover:bg-neutral-900 hover:rounded hover:text-primary-800 hover:drop-shadow-md'}`}>
                                            <DashboardIcon className={`${url === '/tenant/dashboard' ? 'text-primary-100' : 'text-neutral-200'}`}/>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link href={route('tenant.dashboard')} className={`${
                                        url === '/dashboard' ? 'text-secondary-700 font-semibold' : 'text-white'
                                    }`}>
                                        <div className={`${url === '/tenant/dashboard' ? 'bg-primary-500 font-bold text-white px-4 py-2 flex items-center gap-3 drop-shadow hover:drop-shadow-md' : 'px-4 py-2 flex items-center gap-3 hover:bg-neutral-900 hover:text-white '} `}>
                                            <DashboardIcon className={`${url === '/tenant/dashboard' ? 'text-primary-100' : 'text-neutral-200'}`} />
                                            <div className="text-sm">
                                                Dashboard
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }  
                        </div>
                    </div>
                    <div className="w-full">
                        {!expanded ? (
                            <Link
                                href={route('items-management.category-list')}
                                className={`${isActive(foodRoutes.map(r => r.path)) ? 'text-primary-700 font-bold' : 'text-white'}`}
                            >
                                <div className={`w-full flex justify-center py-2 ${isActive(foodRoutes.map(r => r.path)) ? 'bg-primary-500' : 'hover:bg-neutral-900 p-2'}`}>
                                    <FoodIcon className={isActive(foodRoutes.map(r => r.path)) ? 'text-primary-100' : 'text-neutral-200'} />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex flex-col">
                                {/* Dropdown Header */}
                                <div
                                    onClick={toggleFood}
                                    className={`px-4 py-2 flex items-center justify-between gap-3 cursor-pointer rounded hover:drop-shadow-md
                                        ${isActive(foodRoutes.map(r => r.path)) ? 'bg-primary-500 text-white' : 'text-white hover:bg-neutral-900 hover:text-white'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <FoodIcon className={isActive(foodRoutes.map(r => r.path)) ? 'text-primary-100' : 'text-neutral-200'} />
                                        <div className="text-sm">Item Management</div>
                                    </div>
                                    {foodExpand ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
                                </div>

                                {/* Dropdown Items */}
                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out flex flex-col gap-1
                                        ${foodExpand ? 'max-h-screen opacity-100 py-2 bg-[#27272a66]' : 'max-h-0 opacity-0'}
                                        ${isActive(foodRoutes.map(r => r.path)) ? "" : ""}
                                    `}
                                >
                                    {foodRoutes.map((routeItem) => (
                                        <div
                                            key={routeItem.path}
                                            className="flex gap-3 items-center px-4 py-2 hover:bg-neutral-900 hover:text-white"
                                        >
                                            <div className="max-w-5 w-full h-5">{/* Optional icon */}</div>
                                            <Link
                                                href={route(routeItem.path.replace('/items-management/', 'items-management.'))}
                                                className={`${url === routeItem.path ? 'text-neutral-200 font-bold w-full' : 'text-white w-full'}`}
                                            >
                                                <div className={`flex items-center gap-3 ${url === routeItem.path ? 'font-bold text-white' : ''}`}>
                                                    <div className="text-sm">{routeItem.name}</div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`flex flex-col gap-2 ${!expanded ? 'items-center': ''}`}>
                        <div className="w-full">
                            {
                                !expanded ? (
                                    <Link href={route('members.member-listing')} className={`${
                                        url === '/members/member-listing' ? 'w-full text-secondary-700 font-semibold' : 'text-white'
                                    }`}>
                                        <div className={`${url === '/members/member-listing' ? 'w-full flex justify-center py-2 drop-shadow bg-primary-500 ' : ' w-full flex justify-center p-2 hover:bg-neutral-900 hover:rounded hover:text-primary-800 hover:drop-shadow-md'}`}>
                                            <MemberIcon className={`${url === '/members/member-listing' ? 'text-primary-100' : 'text-neutral-200'}`}/>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link href={route('members.member-listing')} className={`${
                                        url === '/members/member-listing' ? 'text-secondary-700 font-semibold' : 'text-white'
                                    }`}>
                                        <div className={`${url === '/members/member-listing' ? 'bg-primary-500 font-bold text-white px-4 py-2 flex items-center gap-3 drop-shadow hover:drop-shadow-md' : 'px-4 py-2 flex items-center gap-3 hover:bg-neutral-900 hover:text-white '} `}>
                                            <MemberIcon className={`${url === '/members/member-listing' ? 'text-primary-100' : 'text-neutral-200'}`} />
                                            <div className="text-sm">
                                                Member
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }  
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    )
}
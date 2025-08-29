import Button from "@/Components/Button";
import { EditIcon, KeyIcon, XIcon } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { DatePicker, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { Switch } from "antd";
import toast from "react-hot-toast";

export default function EditMember({ user, cashWallet, dineWallet, transaction }) {
    const walletType = [
        { name: 'Dine In Wallet' },
        { name: 'Credit Wallet' },
        { name: 'Point' },
    ];

    const balanceType = [
        { name: 'Deposit' },
        { name: 'Withdrawal' },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [userWallet, setUserWallet] = useState([]);
    // const [dineWallet, setDineWallet] = useState(null);
    // const [cashWallet, setCashWallet] = useState(null);
    const [selectedWalletType, setSelectedWalletType] = useState(null);
    const [selectedBalType, setSelectedBalType] = useState(null);
    const [checked, setChecked] = useState(user.status === 'active');

    const handleItemAdded = () => {
        setRefreshTable(prevState => !prevState);
    }

    const changeWallet = (user) => {
        setIsOpen(true)
    }

    const closeWallet = () => {
        setIsOpen(false)
        setSelectedWalletType(null)
        setSelectedBalType(null)
        reset()
    }

    const editProfile = (user) => {
        console.log('clicked')
        setEditProfileOpen(true)
    }

    console.log('editProfileOpen', editProfileOpen)

    const closeEditProfile = () => {
        setEditProfileOpen(false)
        reset()
    }

    const editPassword = (user) => {
        setEditPasswordOpen(true)
    }

    const closeEditPassword = () => {
        setEditPasswordOpen(false)
        reset()
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        id: user.id,
        dine_in_wallet: '',
        cash_wallet: '',
        point_balance: user.point,
        point: "",
        name: user.name,
        phone: user.dial_code + user.phone,
        email: user.email,
        dob: user.dob ? new Date(user.dob) : null,
        gender: user.gender,
        member_id: user.member_id,
        role_id: user.role_id,
        address1: user.address1,
        address2: user.address2,
        address3: user.address3,
        city: user.city,
        state: user.state,
        zip: user.zip,
        password: '',
        password_confirmation: '',
        wallet_type: '',
        bal_type: '',
        status: user.status,
    });

    const saveWallet = (e) => {
        e.preventDefault();
        post('/member/updateMemberWallet', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                handleItemAdded();
                closeWallet();
                toast.success('Succesfully Updated.', {
                    title: 'Succesfully Updated.',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        });
    }

    const saveProfile = (e) => {
        e.preventDefault();
        post('/members/updateMemberProfile', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                handleItemAdded();
                closeEditProfile();
                toast.success('Succesfully Updated.', {
                    title: 'Succesfully Updated.',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        });
    }

    const updateNewPassword = (e) => {
        e.preventDefault();
        post('/members/updateMemberPassword', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                handleItemAdded();
                closeEditPassword();
                toast.success('Succesfully Updated.', {
                    title: 'Succesfully Updated.',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        });
    }

    const handleSwitchChange = (value) => {
        console.log('test')
        setChecked(value); // update UI immediately
        setIsLoading(true);

        post("/members/updateMemberStatus", {
            data: { 
                status: value, 
                id: user.id
            }, // ✅ send new status
            onSuccess: () => {
                setIsLoading(false);
                toast.success("Successfully Updated.", {
                    title: "Successfully Updated.",
                    duration: 3000,
                    variant: "variant3",
                });
            },
            onError: () => {
                // revert state if error
                setChecked(!value);
                setIsLoading(false);
            },
        });
    }

    return (
        <TenantAuthenicatedLayout>

            <div className="flex flex-col gap-5 w-full px-4">
                <div className="flex items-center gap-5">
                    {
                        user !== null ? (
                            <div className="w-full p-4 shadow-container bg-white md:shadow-container rounded-xl grid g gap-3">
                                <div className="flex justify-between items-center border-b border-neutral-200 py-2 px-1">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <img className='object-cover w-8 h-8 rounded-full' src='https://img.freepik.com/free-icon/user_318-159711.jpg' alt="merchant_pic" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-neutral-900 text-sm font-bold leading-none">{user.name}</div>
                                            <div className="text-neutral-900 text-xs font-bold leading-none">{user.role_id ? user.role_id : user.member_id}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <Switch checked={checked} onChange={handleSwitchChange} loading={isLoading} />
                                        </div>
                                        <div className="cursor-pointer" onClick={() => editProfile(user)}>
                                            <EditIcon />
                                        </div>
                                        <div className="cursor-pointer" onClick={() => editPassword(user)}>
                                            <KeyIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-3 gap-3 px-1">
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Name</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.name}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Phone</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.dial_code}{user.phone}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Email</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.email ? user.email : '-'}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Rank</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.rank.name}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Upline</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.upline ? user.upline.name : '-'}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-xs text-neutral-300">Status</div>
                                        <div className="text-sm text-neutral-900 font-bold">{user.verify != null ? <div className="text-green-600">Verified</div> : <div className="text-red-600">Unverify</div>}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {
                                    isLoading ? (
                                        <div className="w-full p-4 shadow-container bg-white md:shadow-container rounded-xl grid g gap-3">
                                            <div className="flex justify-between items-center border-b border-neutral-200 py-2 px-1">
                                                <Skeleton avatar paragraph={{ rows: 4 }} />
                                            </div>
                                            
                                        </div>
                                    ) : (
                                        <div className="w-full p-4 shadow-container bg-white md:shadow-container rounded-xl flex justify-center items-center gap-3">
                                            Failed to load data
                                        </div>
                                    )
                                }
                            </>
                        )
                    }
                    <div className="w-full flex flex-col gap-5">
                        <div className="w-full p-4 shadow-container bg-white md:shadow-container rounded-xl flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-neutral-200 py-2 px-1 h-[49px]">
                                <div className="text-neutral-900 text-base font-bold">Wallet</div>
                                <div className="cursor-pointer" onClick={() => changeWallet(user)}>
                                    <EditIcon />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 px-1">
                                <div className="flex flex-col">
                                    <div className="text-xs text-neutral-300">Dine In Credit Wallet</div>
                                    <div className="text-sm text-neutral-900 font-bold flex items-center gap-1">
                                        <span>RM </span> <CountUp end={dineWallet.balance} duration={2} decimals={2}/>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-xs text-neutral-300">Cash Wallet Credit</div>
                                    <div className="text-sm text-neutral-900 font-bold">
                                        <span>RM </span>  <CountUp end={cashWallet.balance} duration={2} decimals={2}/>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-xs text-neutral-300">Points Balance</div>
                                    <div className="text-sm text-neutral-900 font-bold">
                                        <CountUp end={user.point} duration={2} decimals={2}/> pts
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>

            <Modal
                show={editProfileOpen}
                onClose={closeEditProfile}
                title='Edit Profile'
                closeIcon={<XIcon />}
                maxWidth='lg'
                maxHeight='lg'
                footer={
                    <div className="flex justify-end gap-5 p-4">
                        <Button
                            size="sm"
                            variant="white"
                            className="flex justify-center"
                            onClick={closeEditProfile}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="flex justify-center"
                            type="submit"
                            onClick={saveProfile}
                            disabled={processing}
                        >
                            <span className="px-2">Save</span>
                        </Button>
                    </div>
                }
            >
                <div className="px-5 py-3 flex flex-col gap-5">
                    {/* <div className="w-full flex justify-center items-center">
                        <div>
                            <img className='object-cover md:w-14 ld:w-20 md:h-14 ld:h-20 rounded-full' src='https://img.freepik.com/free-icon/user_318-159711.jpg' alt="merchant_pic" />
                        </div>
                    </div> */}
                    <div className="grid grid-cols-6 md:gap-3 lg:gap-5">
                        <div className="flex flex-col space-y-1 col-span-3">
                            <div className="text-xs text-neutral-300">Name</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.name || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-3">
                            <div className="text-xs text-neutral-300">Email</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='email'
                                    value={data.email || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={false}
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300 col-span-3">Phone</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.phone || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">N2U Role ID</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.role_id || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Existing Card ID</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.member_id || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('member_id', e.target.value)}
                                    // disabled={true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Rank</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={user.rank.name || ""}
                                    className="mt-1 block w-full"
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Date of Birth</div>
                            <div className="text-sm text-neutral-900 flex items-center">
                                <DatePicker 
                                    value={data.dob ? dayjs(data.dob) : null}
                                    onChange={(date) => setData("dob", date ? date.toISOString() : null)}
                                    className="w-full h-[46px] box-border rounded-xl mt-1"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Gender</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput
                                    type="text"
                                    value={data.gender === '0' ? 'Male' : data.gender === '1' ? 'Female' : ''}
                                    className="mt-1 block w-full"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'Male') {
                                        setData('gender', 0);
                                        } else if (value === 'Female') {
                                        setData('gender', 1);
                                        } else {
                                        setData('gender', '');
                                        }
                                    }}
                                />

                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Address</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.address1 || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('address1', e.target.value)}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Address 2</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.address2 || ""}
                                    onChange={(e) => setData('address2', e.target.value)}
                                    className="mt-1 block w-full"
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Address 3</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.address3 || ""}
                                    onChange={(e) => setData('address3', e.target.value)}
                                    className="mt-1 block w-full"
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">City</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.city || ""}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('city', e.target.value)}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">State</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                    type='text'
                                    value={data.state || ""}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="mt-1 block w-full"
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 col-span-2">
                            <div className="text-xs text-neutral-300">Zip</div>
                            <div className="text-sm text-neutral-900">
                                <TextInput 
                                type='text'
                                value={data.zip || ""}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('zip', e.target.value)}
                                disabled={false} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </TenantAuthenicatedLayout>
    )
}
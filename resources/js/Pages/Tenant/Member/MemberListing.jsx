import Button from "@/Components/Button";
import { DeleteIcon, EditIcon, ExportIcon, PlusIcon, SearchIcon, VoucherIcon, XIcon2 } from "@/Components/Icon/Outline";
import TextInput from "@/Components/TextInput";
import { formatDate, formatDateTime } from "@/Composables";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Link } from "@inertiajs/react";
import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MemberListing() {

    const { t, i18n } = useTranslation();
    const [searchFilter, setSearchFilter] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [getMember, setGetMember] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchMember = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/members/getMembers', {
                params: {
                    page: page,
                    per_page: pageSize,
                    search: searchFilter, // <-- send search
                }
            });

            setGetMember(response.data.data); // assuming response.data.data contains items
            setTotal(response.data.total);      // assuming response.data.total contains total count
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMember();
    }, [page, pageSize, searchFilter]);


    const clearFilter = () => {
        setSearchFilter('');
    }

    const columns = [
        {
            title: 'ID',
            key: 'uid',
            dataIndex: 'uid',
            width: 120,
            render: (_, record) => {

                return (
                    <div className="text-neutral-900">
                        {record.uid}
                    </div>
                )
            }
        },
        {
            title: 'Member',
            key: 'member',
            dataIndex: 'member',
            width: 250,
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        <div></div>
                        <div className="flex flex-col">
                            <div>{record.name}</div>
                            <div>{record.phone_no}</div>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Point',
            key: 'point',
            dataIndex: 'point',
            width: 150,
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        {record.point} PTS
                    </div>
                )
            }
        },
        {
            title: 'Tier',
            key: 'tier',
            dataIndex: 'tier',
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        
                    </div>
                )
            }
        },
        {
            title: 'Joined On',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        {formatDate(record.created_at)}
                    </div>
                )
            }
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        {
                            record.status === 'active' && (
                                <Tag color="#E9FCD8" className="custom-tag-active">
                                    Active
                                </Tag>
                            )
                        }
                        {
                            record.status === 'inative' && (
                                <Tag color="#F0F0F3" className="custom-tag-inative">
                                    Inactive
                                </Tag>
                            )
                        }
                        
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: (_, record) => {

                return (
                    <div className="flex items-center gap-3">
                        <div className="p-[9px] border border-neutral-200 bg-white rounded-full shadow-action">
                            <VoucherIcon className={` w-3 h-3`} />
                        </div>
                        <div className="p-[9px] border border-neutral-200 bg-white rounded-full shadow-action cursor-pointer" onClick={() => editUser(record)} >
                            <EditIcon className={` w-3 h-3`} />
                        </div>
                        <div className="p-[9px] border border-neutral-200 bg-white rounded-full shadow-action">
                            <DeleteIcon className={`w-3 h-3`} />
                        </div>
                    </div>
                )
            }
        },
    ];

    const editUser = (record) => {
        window.location.href = `/members/edit-member/${record.uid}`
    }


    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between w-full">
                        <div className="w-full flex flex-col">
                            <div className="text-neutral-900 text-xxl font-bold">{t('member')}</div>
                            <div className="text-neutral-500 text-sm font-medium">{t('last_update_on')}: </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="white" size="md" className="flex items-center gap-2" >
                                <ExportIcon />
                                <span>{t('export')}</span>
                            </Button>
                            <Link href={route('items-management.create-product')}>
                                <Button size="md" className="flex items-center gap-2" >
                                    <PlusIcon />
                                    <span>{t('create_product')}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="w-full flex items-center gap-2">
                        <div className="flex gap-3 items-center max-w-96 w-full">
                            {
                                !isSearching ? (
                                    <div
                                        className="p-3 w-11 h-11 rounded-full bg-white border border-neutral-200 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out"
                                        onClick={() => {
                                            if (searchFilter) {
                                                clearFilter();
                                            } else {
                                                setIsSearching(true);
                                            }
                                        }}
                                    >
                                        {
                                            searchFilter ? <XIcon2 /> : <SearchIcon />
                                        }
                                    </div>
                                ) : (
                                    <TextInput 
                                        type='text'
                                        className={`border border-neutral-300 rounded-lg p-2 transition-all duration-300 ease-in-out ${
                                            isSearching ? "w-48" : "w-0 opacity-0"
                                        }`}
                                        autoFocus
                                        onBlur={() => setIsSearching(false)}
                                        value={searchFilter} 
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                    />
                                )
                            }
                        </div>
                    </div>

                    {/* content */}
                    <div className="flex flex-col gap-5 rounded-lg border border-neutral-100 bg-white">
                        <div className="p-4 flex items-center gap-2">
                            <div className="w-full flex items-center gap-4">
                                <div className="text-neutral-900 text-lg font-bold">{t('list_of_member')}</div>
                                <div></div>
                            </div>
                            <Button size="sm" variant="white" className="flex items-center gap-2"><ExportIcon /><span>{t('export')}</span></Button>
                        </div>
                        <div>
                            <Table 
                                rowKey="id"
                                columns={columns}
                                dataSource={isLoading ? [] : getMember}
                                loading={isLoading}
                                pagination={{ 
                                    current: page,
                                    pageSize: pageSize,
                                    position: ['bottomCenter'],
                                    showSizeChanger: false,
                                    showQuickJumper: false,
                                    pageSizeOptions: ['10', '25', '50', '100'],
                                    total: total,
                                    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize);
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
import Button from "@/Components/Button";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { DeleteIcon, EditIcon, FliterIcon, PlusIcon, SearchIcon } from "@/Components/Icon/Outline";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Link } from "@inertiajs/react";
import { Switch, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ModifierGroupList() {

    const { t, i18n } = useTranslation();
    const [isSearching, setIsSearching] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [getModifierGroupList, setGetModifierGroupList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [switchStates, setSwitchStates] = useState({}); // 用于存储 Switch 的状态
    const [updateQueue, setUpdateQueue] = useState({}); // 用于存储待更新的状态
    const [switchLoading, setswitchLoading] = useState(false);
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchModifier = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getModifierGroup', {
                params: {
                    page: page,
                    per_page: pageSize,
                }
            });

            setGetModifierGroupList(response.data.data); // assuming response.data.data contains items
            setTotal(response.data.total);      // assuming response.data.total contains total count
            
        } catch (error) {
            console.error('Error Fetching modifier: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModifier(page, pageSize);
    }, [page, pageSize]);

    const handleSwitchChange = (id, checked) => {

        const originalVisibility = getModifierGroupList.find(item => item.id === id)?.status === 'active';

        // 检查是否是切换回原始状态
        if (checked === originalVisibility) {
            // 如果是切换回原始状态，直接更新 UI，不发送请求
            setSwitchStates(prev => ({
                ...prev,
                [id]: checked
            }));
            
            // 清除可能存在的待更新计时器
            setUpdateQueue(prev => {
                const newQueue = {...prev};
                if (newQueue[id]) {
                    clearTimeout(newQueue[id].timer);
                    delete newQueue[id];
                }
                return newQueue;
            });
            
            return; // 直接返回，不执行后续代码
        }

        // 如果不是切换回原始状态，继续原有逻辑
        setSwitchStates(prev => ({
            ...prev,
            [id]: checked
        }));
        
        // 设置或重置 3 秒计时器
        setUpdateQueue(prev => {
            if (prev[id]) {
                clearTimeout(prev[id].timer);
            }
            
            const timer = setTimeout(() => {
                updateVisibility(id, checked);
                setUpdateQueue(prev => {
                    const newQueue = {...prev};
                    delete newQueue[id];
                    return newQueue;
                });
            }, 3000);
            
            return {
                ...prev,
                [id]: {
                    checked,
                    timer
                }
            };
        });
    };

    // 实际更新后台的函数
    const updateVisibility = async (id, status) => {
        try {
            setswitchLoading(true);
           
            const response = await axios.post('/items-management/updateModifierGroupStatus', {
                id: id,
                status: status ? 'active' : 'inactive'
            });

            toast.success(`${t('visibility_updated')}`, {
                title: `${t('visibility_updated')}`,
                duration: 3000,
                variant: 'variant1',
            });

            fetchModifier(page, pageSize);

        } catch (error) {
            
            // 如果失败，回滚状态
            setSwitchStates(prev => ({
                ...prev,
                [id]: !status
            }));
        } finally {
            setswitchLoading(false);
        }
    };

    const columns = [
        {
            title: 'Visibility',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (_, record) => {
                
                // 使用 switchStates 中的状态，如果不存在则使用默认值
                const checked = switchStates.hasOwnProperty(record.id) 
                    ? switchStates[record.id]
                    : record.status === 'active';

                return (
                    <Switch 
                        checked={checked}
                        onChange={(checked) => handleSwitchChange(record.id, checked)}
                        loading={switchLoading && updateQueue[record.id]?.checked === checked}
                    />
                )
            }
        },
        {
            title: 'Group ID',
            key: 'modifier_group_id',
            dataIndex: 'modifier_group_id',
            render: (_, record) => {
                return (
                    <div className="text-neutral-900 text-sm">
                        {record.modifier_group_id}
                    </div>
                )
            }
        },
        {
            title: 'Group Name & Item',
            key: 'group_name',
            dataIndex: 'group_name',
            render: (_, record) => {

                const modifierNames = record.modifier_group_items
                    .map(item => item.modifier_name)
                    .join(', ');

                return (
                    <div className="flex flex-col">
                        <div className="text-neutral-900 font-bold text-sm">
                            {record.group_name} ({record.modifier_group_items.length})
                        </div>
                        <div className="text-neutral-400 text-sm">
                            {modifierNames}
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Type',
            key: 'group_type',
            dataIndex: 'group_type',
            render: (_, record) => {
                return (
                    <div className="flex flex-col">
                        <div className="text-neutral-900 font-bold text-sm">
                            {record.group_type === 'required' ? 'Required' : 'Optional' }
                        </div>
                        <div className="text-neutral-400 text-sm">
                            min. {record.min_selection} - max. {record.max_selection}
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Linked Item',
            key: 'item',
            dataIndex: 'item',
            render: (_, record) => {
                return (
                    <div className="text-neutral-900 text-sm">
                        {record.total_link_meal_item.length}
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: '110px',
            align: 'center',
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-[9px] border border-neutral-200 bg-white shadow-action rounded-full hover:bg-neutral-100 cursor-pointer" onClick={() => openEditAction(record)} >
                            <EditIcon />
                        </div>
                        <div className="p-[9px] border border-neutral-200 bg-white shadow-action rounded-full hover:bg-neutral-100 cursor-pointer" onClick={() => openDeleteAction(record)}>
                            <DeleteIcon />
                        </div>
                    </div>
                )
            }
        },
    ];

    const openEditAction = (record) => {
        window.location.href = `/items-management/edit-modifier-group/${record.modifier_group_id}`
    }

    const openDeleteAction = (record) => {
        setSelectedDelete(record.id);
        setOpenConfirmDelete(true)
    }
    const closeDeleteAction = () => {
        setSelectedDelete(null);
        setOpenConfirmDelete(false);
        setErrorMessage(null);
    }

    const confirmDelete = async () => {
        setIsLoading(true)

        try {
            const response = await axios.post('/items-management/delete-modifier-group', {
                id: selectedDelete,
            });

            fetchModifier(page, pageSize);
            closeDeleteAction();

        } catch (error) {
            console.error('error', error);

            if (error.response) {
                const status = error.response.status;

                if (status === 400) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Unexpected error occurred.');
                }
            } else {
                setErrorMessage('Network or server error occurred.');
            }

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between w-full">
                        <div className="w-full flex flex-col">
                            <div className="text-neutral-900 text-xxl font-bold">{t('modifier_group_list')}</div>
                            <div className="text-neutral-500 text-sm font-medium">{t('last_update_on')}: </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={route('items-management.create-modifier-group')}>
                                <Button size="md" className="flex items-center gap-2" >
                                    <PlusIcon />
                                    <span>{t('create_modifier_group')}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex gap-3 items-center">
                            {
                                !isSearching ? (
                                    <div
                                        className="p-3 w-11 h-11 rounded-full bg-white border border-neutral-200 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out"
                                        onClick={() => setIsSearching(true)}
                                    >
                                        <SearchIcon />
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
                        <div className="box-border max-h-11 py-3 px-4 border border-neutral-200 rounded-xl bg-white shadow-input flex items-center gap-3 ">
                            <FliterIcon />
                            <span>Filter</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col bg-white rounded-lg shadow-sec-voucher">
                        <div className="p-4 flex justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-neutral-900 font-bold">{t('list_of_modifier_group')}</div>
                                <div>
                                    <Tag color="#FDD3A6" className="rounded-full" >
                                        <span className="text-primary-500 font-bold text-xss">
                                            {/* {filterData.length > 0 ? filterData.length : 0} */} {t('modifier_group')}
                                        </span>
                                    </Tag>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Table 
                                rowKey="id"
                                columns={columns}
                                dataSource={isLoading ? [] : getModifierGroupList}
                                loading={isLoading}
                                pagination={{ 
                                    current: page,
                                    pageSize: pageSize,
                                    position: ['bottomCenter'],
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '25', '50', '100'],
                                    defaultPageSize: 10, 
                                    showQuickJumper: false,
                                    total: total,
                                    showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                    onChange: (newPage, newPageSize) => {
                                        setPage(newPage);
                                        setPageSize(newPageSize);
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog show={openConfirmDelete}>
                <div className="p-6 flex flex-col gap-8">
                    {
                        errorMessage ? (
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-gray-950 text-center">{errorMessage}</div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-gray-950 text-center">Confirm Delete?</div>
                            </div>
                        )
                    }
                    
                    <div className="flex items-center justify-center gap-4">
                        <Button size="md" variant="white" onClick={closeDeleteAction} >cancel</Button>
                        <Button size="md" onClick={confirmDelete} disabled={errorMessage || isLoading} >Delete</Button>
                    </div>
                </div>
            </ConfirmDialog>

        </TenantAuthenicatedLayout>
    )
}
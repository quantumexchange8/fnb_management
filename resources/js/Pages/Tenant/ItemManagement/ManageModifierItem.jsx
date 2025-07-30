import Button from "@/Components/Button";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { DeleteIcon, EditIcon, PlusIcon } from "@/Components/Icon/Outline";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { useForm } from "@inertiajs/react";
import { InputNumber, Switch, Table } from "antd";
import { defaultConfig } from "antd/es/theme/context";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ManageModifierItem() {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getModifierItem, setGetModifierItem] = useState([]);
    const [switchStates, setSwitchStates] = useState({});
    const [switchLoading, setswitchLoading] = useState(false);
    const [updateQueue, setUpdateQueue] = useState({});
    const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);
    const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const fetchModifierItems = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getModifierItem');

            setGetModifierItem(response.data.all); // assuming response.data.data contains items
            
        } catch (error) {
            console.error('Error Fetching modifier items: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModifierItems();
    }, []);

    const { data, setData, post, processing, errors, reset, isDirty, clearErrors } = useForm({
        id: '',
        modifier_name: '',
        price: '',
    }); 

    const handleSwitchChange = (id, checked) => {

        const originalVisibility = getModifierItem.find(item => item.id === id)?.status === 'active';

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

    const updateVisibility = async (id, status) => {
        try {
            setswitchLoading(true);
           
            const response = await axios.post('/items-management/updateModifierItemStatus', {
                id: id,
                status: status ? 'active' : 'inactive'
            });

            toast.success(`${t('status_updated')}`, {
                title: `${t('status_updated')}`,
                duration: 3000,
                variant: 'variant1',
            });

            fetchCategories(page, pageSize);

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

    const openCreateItem = () => {
        setIsCreateItemOpen(true)
    }
    const closeCreateItem = () => {
        reset();
        setIsCreateItemOpen(false);
    }

    const openEditAction = (record) => {
        setOpenEditItem(true);
        setSelectedItemToEdit(record);
        setData({'id': record.id, modifier_name: record.modifier_name, price: record.price})
    }
    const closeEditAction = () => {
        setOpenEditItem(false);
        setSelectedItemToEdit(null);
        reset();
    }

    const openDeleteAction =  (record) => {
        setIsConfirmDeleteOpen(true);
        setSelectedItemToEdit(record);
        setData('id', record.id)
    }
    const closeDeleteAction =  () => {
        setIsConfirmDeleteOpen(false);
        setSelectedItemToEdit(null);
        reset();
        clearErrors();
    }

    const columns = [
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (_, record) => {

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
            title: 'Modifier Name',
            key: 'modifier_name',
            dataIndex: 'modifier_name',
            render: (_, record) => {
                return (
                    <div className="text-neutral-900 font-bold text-sm">
                        {record.modifier_name}
                    </div>
                )
            }
        },
        {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
            width: '100px',
            align: 'center',
            render: (_, record) => {
                return (
                    <div className="text-neutral-900 text-sm text-center">
                        + RM {record.price}
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            align: 'right',
            width: '100px',
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-3">
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

    const create = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.store-modifier-item'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('modifier_item_created_success')}`, {
                    title: `${t('modifier_item_created_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                closeCreateItem();
                fetchModifierItems();

            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

    const confirmUpdate = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.update-modifier-item'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('modifier_item_updated')}`, {
                    title: `${t('modifier_item_updated')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                closeCreateItem();
                fetchModifierItems();

            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

    const confirmDelete = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.delete-modifier-item'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('modifier_item_updated')}`, {
                    title: `${t('modifier_item_updated')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                closeCreateItem();
                fetchModifierItems();

            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between w-full">
                        <div className="w-full flex flex-col">
                            <div className="text-neutral-900 text-xxl font-bold">{t('modifier_item_list')}</div>
                            <div className="text-neutral-500 text-sm font-medium">{t('last_modifier_created_on')}: </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="md" className="flex items-center gap-2" onClick={openCreateItem} >
                                <PlusIcon />
                                <span>{t('create_item')}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5">
                        <Table 
                            rowKey="id"
                            columns={columns}
                            dataSource={isLoading ? [] : getModifierItem}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>

            <Modal
                show={isCreateItemOpen}
                onClose={closeCreateItem}
                title={t('create_modifier_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeCreateItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={create}>
                            {t('create')}
                        </Button>
                    </div>
                }
            >
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <InputLabel value={t('modifier_name')} />
                        <TextInput 
                            type='text'
                            value={data.modifier_name}
                            className="w-full "
                            onChange={(e) => setData('modifier_name', e.target.value)}
                            placeholder={t('eg_large')}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <InputLabel value={t('price')} />
                        <InputNumber 
                            prefix='RM '
                            value={data.price || 0.00}
                            min='0.00'
                            step="0.01"
                            onChange={(value) => setData('price', value)}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            placeholder='12.90'
                            className="w-full"
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                show={openEditItem}
                onClose={closeEditAction}
                title={t('edit_modifier_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeEditAction}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={confirmUpdate}>
                            {t('update')}
                        </Button>
                    </div>
                }
            >
                {
                    selectedItemToEdit && (
                        <div className="p-5 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <InputLabel value={t('modifier_name')} />
                                <TextInput 
                                    type='text'
                                    value={data.modifier_name}
                                    className="w-full "
                                    onChange={(e) => setData('modifier_name', e.target.value)}
                                    placeholder={t('eg_large')}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <InputLabel value={t('price')} />
                                <InputNumber 
                                    prefix='RM '
                                    value={data.price || 0.00}
                                    min='0.00'
                                    step="0.01"
                                    onChange={(value) => setData('price', value)}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    placeholder='12.90'
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )
                }
            </Modal>

            <ConfirmDialog show={isConfirmDeleteOpen} >
                {
                    !!errors.Errors ? (
                        <div className="p-6 flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-gray-950 text-center">
                                    {t('this_item_cannot_be_deleted')}
                                </div>
                                <div className="text-base text-gray-700 text-center text-wrap">
                                    {t('this_item_has_been_assign_in_modifier_group')}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button variant="white" size="sm" onClick={closeDeleteAction}>Cancel</Button>
                                <Button size="sm" variant="red" disabled={true} onClick={confirmDelete}>Confirm</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-gray-950 text-center">Confirm Delete?</div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button variant="white" size="sm" onClick={closeDeleteAction}>Cancel</Button>
                                <Button size="sm" variant="red" onClick={confirmDelete}>Confirm</Button>
                            </div>
                        </div>
                    )
                }
            </ConfirmDialog>

        </TenantAuthenicatedLayout>
    )
}
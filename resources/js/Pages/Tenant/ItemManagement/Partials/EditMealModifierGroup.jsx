import Button from "@/Components/Button";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { DeleteIcon, EditIcon, PlusIcon, SearchIcon, XIcon } from "@/Components/Icon/Outline";
import NoModifier from "@/Components/Illustration/NoModifier";
import Modal from "@/Components/Modal";
import SearchInput from "@/Components/SearchInput";
import { Checkbox, Form, InputNumber, Switch, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function EditMealModifierGroup({ data, setData, isDirty }) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getModifier, setGetModifier] = useState([]);
    const [isModifierOpen, setIsModifierOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
    const [selectedModifierItem, setSelectedModifierItem] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectToEditItem, setSelectToEditItem] = useState(null);

    const fetchModifier = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getModifier');

            setGetModifier(response.data);
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModifier();
    }, []);

    useEffect(() => {
        if (data?.modifier_group?.length > 0) {
            setSelectedModifierItem(data.modifier_group);
        }
    }, [data.modifier_group]);


    const openAddModifier = () => {
        setIsModifierOpen(true)
    }
    const closeAddModifier = () => {
        setIsModifierOpen(false);
    }

    const filterGetModifier = getModifier.filter((item) =>
        item.group_name.toLowerCase().includes(searchFilter.toLowerCase())
    );
    
    const clearFilter = () => {
        setSearchFilter('');
    }

    const directCreateModifier = () => {
        window.location.href = `/items-management/create-modifier-group`
    }

    const confirmStay = () => {
        setOpenConfirmLeaveDialog(false);
        setIsModifierOpen(false);
    }
    const confirmLeave = () => {
        directCreateModifier();
    }

    const confirm = () => {
        setData('modifier_group', selectedModifierItem); // will send full object
        setIsModifierOpen(false);
    };

    const openEditModal = (group) => {
        setSelectToEditItem(group);
        setIsEditModalOpen(true);
    }
    const closeEditModal = () => {
        setSelectToEditItem(null);
        setIsEditModalOpen(false);
    }
    const columns = [
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, record) => {
            
                return (
                    <Switch
                        checked={record.status === 'active'}
                        onChange={(checked) => {
                            const updatedStatus = checked ? 'active' : 'inactive';

                            setSelectToEditItem((prev) => ({
                            ...prev,
                            modifier_group_items: prev.modifier_group_items.map((item) =>
                                item.id === record.id
                                ? { ...item, status: updatedStatus }
                                : item
                            ),
                            }));
                        }}
                    />
                )
            }
        },
        {
            title: 'Modifier Name',
            key: 'name',
            dataIndex: 'name',
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
            dataIndex: 'modifier_price',
            width: '130px',
            align: 'center',
            render: (_, record, index) => (
                <InputNumber
                    prefix="RM "
                    min={0}
                    step={0.01}
                    value={record.modifier_price || 0}
                    onChange={(value) => {
                        setSelectToEditItem((prev) => ({
                        ...prev,
                        modifier_group_items: prev.modifier_group_items.map((item) =>
                            item.id === record.id
                            ? { ...item, modifier_price: value }
                            : item
                        ),
                        }));
                    }}
                    className="w-full text-center border-none rounded-lg"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
            ),
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     dataIndex: 'action',
        //     align: 'center',
        //     width: '80px',
        //     render: (_, record) => {
        //         return (
        //             <div className="flex justify-center items-center cursor-pointer" onClick={() => removeModifierItem(record)}>
        //                 <DeleteIcon />
        //             </div>
        //         )
        //     }
        // }
    ];
    const saveChange = () => {
        const updatedGroupId = selectToEditItem.id;
        const updatedItems = selectToEditItem.modifier_group_items;

        setData({
            ...data,
            modifier_group: data.modifier_group.map((group) => {
                if (group.id === updatedGroupId) {
                    return {
                        ...group,
                        modifier_group_items: updatedItems, // ✅ safely update nested items
                    };
                }
                return group;
            }),
        });

        setIsEditModalOpen(false);
    }

    const removeModifierItem = (record) => {
        setIsEditModalOpen(false);
    }

    const removeModifierGroup = (group) => {
        const updatedGroupId = group.id;

        setData((prevData) => ({
            ...prevData,
            modifier_group: (prevData.modifier_group || []).filter(g => g.id !== updatedGroupId),
            deleted_modifier_group: [updatedGroupId],
        }));
    };
    
    return (
        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                <div className="text-neutral-900 text-lg font-bold">{t('modifier_group')}</div>
                {
                    data.modifier_group?.length > 0 ? (
                        <Button size="md" variant="textOnly" className="flex items-center gap-2" onClick={openAddModifier}>
                            <PlusIcon />
                            <span>{t('add_another_group')}</span>
                        </Button>
                    ) : (
                        <div className="text-neutral-300 text-xs">{t('allow_meal_customization')}</div>
                    )
                }
                
            </div>
            {
                data.modifier_group?.length > 0 ? (
                    <div className="grid grid-cols-3 w-full p-5 gap-5 "> 
                        {
                            data.modifier_group.map((group, index) => (
                                <div key={index} className="flex flex-col gap-8 p-4 border border-neutral-50 bg-white shadow-sec-voucher rounded-xl">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex">
                                            {
                                                group.group_type === 'required' ? (
                                                    <div className="flex rounded-[100px] bg-error-500 py-0.5 px-3 uppercase text-error-50 text-xss font-bold">
                                                        {t('required')}
                                                    </div>
                                                ) : group.modifier_group?.group_type === 'required' ? (
                                                    <div className="flex rounded-[100px] bg-error-500 py-0.5 px-3 uppercase text-error-50 text-xss font-bold">
                                                        {t('required')}
                                                    </div>
                                                ) : (
                                                    <div className="flex rounded-[100px] bg-neutral-50 py-0.5 px-3 uppercase text-neutral-300 text-xss font-bold">
                                                        {t('optional')}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-neutral-950 text-base font-bold truncate">{group.modifier_group ? group.modifier_group.group_name : group.group_name} ({group.modifier_group_items?.length})</div>
                                            <div className="text-wrap text-neutral-400 text-sm ">
                                                {
                                                    group.modifier_group_items?.map(g => g.modifier_name).join(', ')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <Switch
                                                checked={group.status === 'active'}
                                                onChange={(checked) => {
                                                    const updatedStatus = checked ? 'active' : 'inactive';

                                                    // Safely update the specific item in modifier_item array
                                                    setData('modifier_group', (data.modifier_group || []).map(item =>
                                                    item.id === group.id
                                                        ? { ...item, status: updatedStatus }
                                                        : item
                                                    ));
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-[9px] bg-neutral-25 rounded-full cursor-pointer hover:bg-neutral-50" onClick={() => openEditModal(group)} >
                                                <EditIcon />
                                            </div>
                                            <div className="p-[9px] bg-neutral-25 rounded-full cursor-pointer hover:bg-neutral-50" onClick={() => removeModifierGroup(group)} >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>  
                ) : (
                    <div className="p-5 ">
                        <Button size="md" className="flex items-center gap-2" onClick={openAddModifier} >
                            <PlusIcon />
                            <span>{t('add_group')}</span>
                        </Button>
                    </div>
                )
            }
            


            <Modal
                show={isModifierOpen}
                onClose={closeAddModifier}
                title={t('select_modifier')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeAddModifier}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={confirm} disabled={selectedModifierItem && selectedModifierItem.length === 0} >
                            {t('confirm')}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col">
                    {/* Search Filter */}
                    <div className="px-5 pb-4 border-b border-neutral-100">
                        <SearchInput 
                            withIcon
                            IconComponent={searchFilter ? null : SearchIcon}
                            placeholder='Search'
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            dataValue={searchFilter != ''}
                            clearfunc={
                                <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 cursor-pointer" onClick={clearFilter}>
                                    <XIcon className="w-4 h-4" />
                                </div>
                            }
                        />
                    </div>
                    {
                        filterGetModifier && filterGetModifier.length > 0 ? (
                            <div>
                                {
                                    filterGetModifier.map((item, index) => (
                                        <div key={index} className="flex items-center gap-8 py-4 px-5">
                                            <div className="flex flex-col gap-1 w-full">
                                                <div className="text-neutral-900 text-base font-bold">{item.group_name} ({item.modifier_group_items.length})</div>
                                                <div className="text-neutral-400 text-base">
                                                    {
                                                        item.modifier_group_items.length > 0 ? (
                                                            <>
                                                               {item.modifier_group_items.map(m => m.modifier_name).join(', ')}
                                                            </>
                                                        ) : (
                                                            <>

                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <Checkbox 
                                                    checked={selectedModifierItem.some(i => i.id === item.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;

                                                        if (checked) {
                                                            setSelectedModifierItem(prev => [...prev, item]);
                                                        } else {
                                                            setSelectedModifierItem(prev => prev.filter(i => i.id !== item.id));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 min-h-[50vh] py-5">
                                <div className="flex flex-col gap-2">
                                    <NoModifier />
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-neutral-800 text-xl font-bold">{t('oops')}!</div>
                                        <div className="text-neutral-500 text-base">{t('no_modifier_yet_create_one')}</div>
                                    </div>
                                </div>
                                <Button size="md"  
                                     onClick={() => {
                                        if (isDirty) {
                                            setOpenConfirmLeaveDialog(true);
                                        } else {
                                            directCreateModifier(); // <- don't forget to call it
                                        }
                                    }}
                                >
                                    {t('go_to_create')}
                                </Button>
                            </div>
                        )
                    }
                </div>
            </Modal>

            <ConfirmDialog show={openConfirmLeaveDialog} >
                <div className="flex flex-col">
                    <div className="p-5 flex flex-col items-start gap-5">
                        <div className="text-lg font-bold text-gray-950 text-center">{t('you_are_leaving_this_page')}...</div>
                        <div className="text-neutral-900 text-base">
                            {t('any_change_you_made_wont_be_saved')}?
                        </div>
                    </div>
                     <div className="flex justify-end gap-4 py-4 px-5">
                        <Button variant="white" size="md" onClick={confirmStay}>{t('stay')}</Button>
                        <Button size="md" variant="red" onClick={confirmLeave}>{t('leave')}</Button>
                    </div>
                </div>
                
            </ConfirmDialog>

            <Modal
                show={isEditModalOpen}
                onClose={closeEditModal}
                title={t('edit_modifier')}
                maxWidth='md'
                maxHeight='md'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeEditModal}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={saveChange} >
                            {t('confirm')}
                        </Button>
                    </div>
                }
            >
                {
                    selectToEditItem && (
                        <div className="flex flex-col gap-5 px-5 py-4">
                            {/* Header */}
                            <div className="text-neutral-900 text-base font-bold">{selectToEditItem.group_name}</div>

                            {/* content */}
                            <div>
                                <Table 
                                    rowKey="id"
                                    columns={columns}
                                    dataSource={selectToEditItem.modifier_group_items}
                                    pagination={false}
                                />
                            </div>
                        </div>
                    )
                }
            </Modal>
        </div>
    )
}
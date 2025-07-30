import Button from "@/Components/Button";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { DeleteIcon, EditIcon, ExportIcon, GripVerticalIcon, PlusIcon, SearchIcon } from "@/Components/Icon/Outline";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Link, useForm } from "@inertiajs/react";
import { ColorPicker, Radio, Switch, Table, Tag } from "antd";
import axios from "axios";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ReactSortable } from "react-sortablejs";

export default function CategoryList() {

    const { t, i18n } = useTranslation();
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [getCategory, setGetCategory] = useState([]);
    const [visibility, setVisibility] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6); // default 6 per page
    const [switchLoading, setswitchLoading] = useState(false);
    const [switchStates, setSwitchStates] = useState({}); // 用于存储 Switch 的状态
    const [updateQueue, setUpdateQueue] = useState({}); // 用于存储待更新的状态
    const [lastVisibilityState, setLastVisibilityState] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [isOrderCategoryOpen, setIsOrderCategoryOpen] = useState(false);

    const fetchCategories = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getCategories', {
                params: {
                    page: page,
                    per_page: pageSize,
                }
            });

            setGetCategory(response.data.data); // assuming response.data.data contains items
            setTotal(response.data.total);      // assuming response.data.total contains total count
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories(page, pageSize);
    }, [page, pageSize]);

    const filterData = getCategory.filter((category) =>
        category.name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const handleTableChange = (pagination) => {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };


    // 处理 Switch 变化
    const handleSwitchChange = (id, checked) => {

        const originalVisibility = getCategory.find(item => item.id === id)?.visibility === 'display';

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
    const updateVisibility = async (id, visibility) => {
        try {
            setswitchLoading(true);
           
            const response = await axios.post('/items-management/updateCategoryVisibility', {
                id: id,
                visibility: visibility ? 'display' : 'hidden'
            });

            toast.success(`${t('visibility_updated')}`, {
                title: `${t('visibility_updated')}`,
                duration: 3000,
                variant: 'variant1',
            });

            fetchCategories(page, pageSize);

        } catch (error) {
            
            // 如果失败，回滚状态
            setSwitchStates(prev => ({
                ...prev,
                [id]: !visibility
            }));
        } finally {
            setswitchLoading(false);
        }
    };

    const columns = [
        {
            title: 'Visibility',
            key: 'visibility',
            dataIndex: 'visibility',
            width: 120,
            render: (_, record) => {
                
                // 使用 switchStates 中的状态，如果不存在则使用默认值
                const checked = switchStates.hasOwnProperty(record.id) 
                    ? switchStates[record.id]
                    : record.visibility === 'display';

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
            title: 'Category Name',
            key: 'category_name',
            dataIndex: 'name',
            render: (_, record) => {
                return (
                    <div className="text-neutral-900 font-bold text-sm">
                        {record.name}
                    </div>
                )
            }
        },
        {
            title: 'No.of Product',
            key: 'no_of_product',
            dataIndex: 'no_of_product',
            width: 130,
            render: (_, record) => {
                return (
                    <div>
                        0
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 130,
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className="border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 shadow-action p-[9px] cursor-pointer" onClick={() => handleEditCategory(record)} >
                            <EditIcon />
                        </div>
                        <div className="border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 shadow-action p-[9px] cursor-pointer" onClick={() => handleDeleteCategory(record)} >
                            <DeleteIcon />
                        </div>
                    </div>
                )
            }
        }
    ]

    const handleEditCategory = (category) => {
        setIsEditOpen(true);
        setSelectedDetails(category);
    };
    const closeEditCategory = () => {
        setIsEditOpen(false);
        setSelectedDetails(null);
    };

    const handleDeleteCategory = (category) => {
        setIsConfirmDeleteOpen(true);
        setSelectedDetails(category);
    }
    const cancelDeleteCategory = () => {
        setIsConfirmDeleteOpen(false);
    }

    const presets = [
        {
            label: 'Recommended',
            colors: ['#1677ff', '#ff4d4f', '#52c41a', '#faad14', '#722ed1', '#13c2c2'],
        },
        {
            label: 'Pastel',
            colors: ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'],
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        name: '',
        visibility: 'display',
        category_color: '',
        description: '',
        category_sorting: [
            
        ],
    });

    useEffect(() => {
        if (selectedDetails) {
            setData('id', selectedDetails.id);
            setData('name', selectedDetails.name);
            setData('visibility', selectedDetails.visibility);
            setData('category_color', selectedDetails.color);
            setData('description', selectedDetails.description);
        }
    }, [selectedDetails]);

    useEffect(() => {
        const sorted = getCategory.map((cat, index) => ({
            id: cat.id,
            order_no: index + 1,
        }));

        setData("category_sorting", sorted);

    }, [getCategory]);

    const handleColorChange = (color) => {
        setData('category_color', color.toHexString());
    };

    const renderHeader  = () =>{
        return (
            <>
                <span className="ql-formats">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                </span>
                <span className="ql-formats">

                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered" />
                    <button className="ql-list" value="bullet" />
                </span>
                <span className="ql-formats">
                    <button className="ql-align" value="" />
                    <button className="ql-align" value="center" />
                    <button className="ql-align" value="right" />
                </span>
            </>
        )
        
    }

    const header = renderHeader();

    const openMangeCategoryOrder = () => {
        setIsOrderCategoryOpen(true)
    }
    const clolseMangeCategoryOrder = () => {
        setIsOrderCategoryOpen(false)
    }

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.update-category'), {
            onSuccess: () => {
                setIsLoading(false);
                closeEditCategory();
                fetchCategories(page, pageSize);
                setSelectedDetails(null);
                
                toast.success(`${t('category_updated_success')}`, {
                    title: `${t('category_updated_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
            }
        })
    }
    
    const updateOrders = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.update-category-orders'), {
            onSuccess: () => {
                setIsLoading(false);
                clolseMangeCategoryOrder();
                fetchCategories(page, pageSize);
                
                toast.success(`${t('category_updated_success')}`, {
                    title: `${t('category_updated_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
            }
        })
    }

    const confirmDelete = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.delete-category'), {
            onSuccess: () => {
                setIsLoading(false);
                cancelDeleteCategory();
                fetchCategories(page, pageSize);
                setSelectedDetails(null);
                
                toast.success(`${t('category_deleted_success')}`, {
                    title: `${t('category_deleted_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
            }
        })
    }

    return (
        <TenantAuthenicatedLayout>
            <div className="py-2 px-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col ">
                        <div className="text-neutral-900 text-xxl font-bold">{t('category_list')}</div>
                        <div className="text-neutral-500 text-sm font-medium">{t('last_updated_on')}: {}</div>
                    </div>
                    <Link href={route('items-management.create-category')}>
                        <Button size="md" className="flex items-center gap-2"  >
                            <PlusIcon />
                            <span>{t('create_category')}</span>
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex gap-3 items-center max-w-96 w-full">
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
                    <div></div>
                </div>
                <div className="flex flex-col bg-white rounded-lg shadow-sec-voucher">
                    <div className="p-4 flex justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-neutral-900 font-bold">{t('list_of_category')}</div>
                            <div>
                                <Tag color="#FDD3A6" className="rounded-full" >
                                    <span className="text-primary-500 font-bold text-xss">
                                        {filterData.length > 0 ? filterData.length : 0} {t('categories')}
                                    </span>
                                </Tag>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="white" size="md" onClick={openMangeCategoryOrder}>
                                {t('reorder_categories')}
                            </Button>
                            <Button size="md" className="flex items-center gap-2">
                                <ExportIcon className="text-white" />
                                <span>{t('export')}</span>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Table 
                            rowKey="id"
                            columns={columns}
                            dataSource={isLoading ? [] : filterData}
                            loading={isLoading}
                            pagination={{ 
                                current: page,
                                pageSize: pageSize,
                                position: ['bottomCenter'],
                                showSizeChanger: false,
                                pageSizeOptions: ['10', '25', '50', '100'],
                                defaultPageSize: 10, 
                                showQuickJumper: false,
                                total: filterData?.length,
                                showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            }}
                            onChange={handleTableChange}
                        />
                    </div>
                </div>
            </div>

            <Modal 
                show={isEditOpen} 
                onClose={closeEditCategory} 
                title={t('edit_category')}
                maxWidth='md'
                maxHeight='md'
                footer={
                    <div className="flex items-center justify-end gap-4 w-full p-4">
                        <Button variant="white" size="md" onClick={closeEditCategory}>Cancel</Button>
                        <Button size="md" onClick={submit} >Save Changes</Button>
                    </div>
                }
            > 
                {
                    selectedDetails && (
                        <div className="flex flex-col gap-5 px-6 py-4">
                            <div className="flex flex-col gap-2">
                                <div className="text-neutral-900 text-sm font-medium">{t('category_name')}</div>
                                <TextInput 
                                    type='text'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('eg_enter_category_name')}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-neutral-900 text-sm font-medium">{t('visibility')}</div>
                                <div>
                                    <Radio.Group 
                                        value={data.visibility}
                                        onChange={(e) => setData('visibility', e.target.value)}
                                        options={[
                                            { label: t('display'), value: 'display' },
                                            { label: t('hidden'), value: 'hidden' }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-neutral-900 text-sm font-medium">{t('category_colour')}</div>
                                <div className="w-full">
                                    <ColorPicker 
                                        presets={presets}
                                        value={data.category_color || '#1677ff'}
                                        onChange={handleColorChange}
                                        className="rounded-full custom-color-picker"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-neutral-900 text-sm font-medium">{t('description')}</div>
                                <Editor 
                                    value={data.description} 
                                    onTextChange={(e) => setData('description', e.htmlValue)} 
                                    style={{ height: '280px', borderRadius: '0px 0px 8px 8px', border: '0px solid' }} 
                                    headerTemplate={header}
                                />
                            </div>
                        </div>
                    )
                }
            </Modal>

            <Modal 
                show={isOrderCategoryOpen}
                onClose={clolseMangeCategoryOrder} 
                title={t('reorder_categories')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="flex items-center justify-end gap-4 w-full p-4">
                        <Button variant="white" size="md" onClick={clolseMangeCategoryOrder}>Cancel</Button>
                        <Button size="md" onClick={updateOrders} >Save Changes</Button>
                    </div>
                }
            >
                {
                    (getCategory && getCategory.length > 0) && (
                        <div >
                            <ReactSortable
                                list={getCategory}
                                setList={(newState) => setGetCategory(newState)}
                                animation={200}
                                handle=".drag-handle"
                                className="px-4 py-3 flex flex-col gap-3"
                            >
                                {
                                    getCategory.map((category,index) => (
                                        <div key={category.id} className="flex items-center gap-3">
                                            <div className="drag-handle p-3 cursor-move"><GripVerticalIcon /></div>
                                            <div className="text-neutral-900 font-semibold">
                                                {category.name}
                                            </div>
                                        </div>
                                    ))
                                }
                            </ReactSortable>
                        </div>
                    )
                }
            </Modal>
  
            <ConfirmDialog show={isConfirmDeleteOpen}>
                <div className="p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <div className="text-lg font-bold text-gray-950 text-center">Confirm Delete?</div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button variant="white" size="sm" onClick={cancelDeleteCategory}>Cancel</Button>
                        <Button size="sm" variant="red" onClick={confirmDelete}>Confirm</Button>
                    </div>
                </div>
            </ConfirmDialog>
        </TenantAuthenicatedLayout>
    )
}
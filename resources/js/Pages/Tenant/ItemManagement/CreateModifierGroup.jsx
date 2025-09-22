import Button from "@/Components/Button";
import { DeleteIcon, EditIcon, GripLine2lIcon, PlusIcon, RemoveProductIcon, SearchIcon, TooltipIcon, XIcon } from "@/Components/Icon/Outline";
import NoModifier from "@/Components/Illustration/NoModifier";
import Modal from "@/Components/Modal";
import SearchInput from "@/Components/SearchInput";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { useForm } from "@inertiajs/react";
import { Badge, Checkbox, Collapse, InputNumber, Radio, Spin, Switch, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CreateModifierItem from "./Partials/CreateModifierItem";
import toast from "react-hot-toast";
import InputLabel from "@/Components/InputLabel";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandle } from "@/Components/DragHandle";
import InputError from "@/Components/InputError";


export default function CreateModifierGroup() {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModifierItemOpen, setIsAddModifierItemOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [searchFilterMeal, setSearchFilterMeal] = useState('');
    const [getModifierItem, setGetModifierItem] = useState([]);
    const [isCreateModifierOpen, setIsCreateModifierOpen] = useState(false);
    const [selectedModifierItem, setSelectedModifierItem] = useState([]);
    const [openEditItem, setOpenEditItem] = useState(false);
    const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
    const [openAddMealItem, setOpenAddMealItem] = useState(false);
    const [getMealItem, setGetMealItem] = useState([]);

    const fetchModifierItem = async () => {
        setIsLoading(true);

         try {

            const response = await axios.get('/items-management/getModifierItem');

            setGetModifierItem(response.data.active);
            
        } catch (error) {
            console.error('Error Fetching Modifier Item: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchMealItem = async () => {
        setIsLoading(true);

         try {

            const response = await axios.get('/items-management/getMealItem');

            const mealItems = data.meal_items || [];
            const currentSelectedIds = new Set(mealItems.map(item => item.id));

            const syncedItems = response.data.map(category => ({
                ...category,
                product: category.product.map(prod => ({
                    ...prod,
                    checked: currentSelectedIds.has(prod.id),
                })),
            }));

            setGetMealItem(syncedItems);
            
        } catch (error) {
            console.error('Error Fetching Meal Item: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        group_name: '',
        display_name: '',
        group_type: 'required',
        min_value: '',
        max_value: '',
        // overide: 'not_allowed',
        modifier_item: null,
        meal_items: null,
    });

    useEffect(() => {
        if (isAddModifierItemOpen) {
            fetchModifierItem();
        }
        if (openAddMealItem) {
            fetchMealItem();
        }
    }, [isAddModifierItemOpen, openAddMealItem, data.meal_items]);

    const addModifierItem = () => {
        setIsAddModifierItemOpen(true);
    }
    const closeModifierItem = () => {
        setIsAddModifierItemOpen(false);
    }

    const addItem = () => {
        toast.success(`${t('modifier_item_added_success')}`, {
            title: `${t('modifier_item_created_success')}`,
            description: `${t('selected_modifier_item_has_been_added')}`,
            duration: 3000,
            variant: 'variant1',
        });

        const existingItems = Array.isArray(data.modifier_item) ? data.modifier_item : [];

        const existingDefault = existingItems.find(item => item.default === true);

        // Prepare new items
        const newItems = selectedModifierItem.map((item, index) => ({
            id: item.id,
            modifier_name: item.modifier_name,
            price: item.price,
            sort_order: index + 1,
            default: false,
            status: item.status || 'active'
        }));

        // Filter out duplicates
        const uniqueNewItems = newItems.filter(newItem =>
            !existingItems.some(existing => existing.id === newItem.id)
        );

        let mergedItems = [...existingItems, ...uniqueNewItems];

        // Ensure one item is default: keep existing default, or set first one as default
        if (!existingDefault && mergedItems.length > 0) {
            mergedItems = mergedItems.map((item, index) => ({
                ...item,
                default: index === 0 // First item becomes default
            }));
        }

        // Re-assign sort_order
        mergedItems = mergedItems.map((item, index) => ({
            ...item,
            sort_order: index + 1
        }));

        setData('modifier_item', mergedItems);
        setIsAddModifierItemOpen(false);
    };

    const clearFilter = () => {
        setSearchFilter('');
    }

    const clearSearchFilter = () => {
        setSearchFilter('');
    }

    const createModifierItem = () => {
        setIsCreateModifierOpen(true);
    }
    const closeCreateModifierItem = () => {
        setIsCreateModifierOpen(false);
    }

    const openEditAction = (record) => {
        setOpenEditItem(true);
        setSelectedItemToEdit(record);
    }
    const closeEditAction = () => {
        setOpenEditItem(false);
        setSelectedItemToEdit(null);
    }
    const confirmUpdate = () => {
        const updatedItem = selectedItemToEdit;

        setData({
            ...data,
            modifier_item: data.modifier_item.map(item =>
                item.id === updatedItem.id
                    ? { ...item, ...updatedItem }
                    : item
            )
        });

        closeEditAction();

    }


    const openDeleteAction = (record) => {
        const idToRemove = record.id;

        const existingItems = data.modifier_item || [];

        // Check if the item being removed is the default one
        const removedWasDefault = existingItems.find(item => item.id === idToRemove)?.default;

        // Remove the item
        let updatedItems = existingItems.filter(item => item.id !== idToRemove);

        // If the removed item was default, set default to the first item (if any left)
        if (removedWasDefault && updatedItems.length > 0) {
            updatedItems = updatedItems.map((item, index) => ({
                ...item,
                default: index === 0
            }));
        }

        // Update both form state and selected list
        setData('modifier_item', updatedItems);
        setSelectedModifierItem(prev => prev.filter(item => item.id !== idToRemove));
    };

    const modifierItemColumns = [
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (_, record) => {

                return (
                    <Switch
                        checked={record.status === 'active'}
                        onChange={(checked) => {
                            const updatedStatus = checked ? 'active' : 'inactive';

                            // Safely update the specific item in modifier_item array
                            setData('modifier_item', (data.modifier_item || []).map(item =>
                            item.id === record.id
                                ? { ...item, status: updatedStatus }
                                : item
                            ));
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
            title: 'Default',
            key: 'default',
            dataIndex: 'default',
            align: 'center',
            width: '100px',
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-3">
                        <Radio
                            checked={record.default === true}
                            onChange={() => {
                                setData('modifier_item', (data.modifier_item || []).map(item => ({
                                ...item,
                                default: item.id === record.id,
                                })));
                            }}
                        />
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
        {
            title: '',
            key: 'sort_order',
            dataIndex: 'sort_order',
            width: '70px',
            render: (_, record) => <DragHandle id={record.id} />
        },
    ]

    const Row = ({ children, ...props }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: props['data-row-key']
        });

        const style = {
            ...props.style,
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: 'move'
        };

        return (
            <tr ref={setNodeRef} style={style} {...props} {...attributes} {...listeners}>
            {children}
            </tr>
        );
    };

    const DraggableTable = ({ dataSource, onChange }) => {
        const sensors = useSensors(useSensor(PointerSensor));
        const ids = dataSource.map((item) => item.id);

        const handleDragEnd = (event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = ids.indexOf(active.id);
            const newIndex = ids.indexOf(over.id);

            const newOrder = arrayMove(dataSource, oldIndex, newIndex).map((item, index) => ({
            ...item,
            sort_order: index + 1,
            }));

            onChange(newOrder);
        };

        return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <Table
                        rowKey="id"
                        columns={modifierItemColumns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </SortableContext>
            </DndContext>
        );
    };

    const addMealItem = () => {
        setOpenAddMealItem(true);
    }
    const closeMealItem = () => {
        setOpenAddMealItem(false);
    }
    const addInMealItem = () => {
        const newlySelected = getMealItem
            .flatMap(category => category.product.filter(prod => prod.checked));

        // Filter out duplicates (by ID)
        const uniqueItems = [
            ...data.meal_items || [],
            ...newlySelected.filter(
                newItem => !(data.meal_items || []).some(existing => existing.id === newItem.id)
            ),
        ];

        setData('meal_items', uniqueItems);
        setOpenAddMealItem(false);
    };

    const removeFromItemMeal = (item) => {
        const removeId = item.id;

        const existingItems = data.meal_items || [];
        let updatedItems = existingItems.filter(item => item.id !== removeId);

        setData('meal_items', updatedItems);
    }

    const handleCategoryCheckAll = (categoryId, checked) => {
        const updated = getMealItem.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
            ...cat,
            product: cat.product.map(prod => ({
                ...prod,
                checked: checked,
            })),
            };
        });

        setGetMealItem(updated);
    };

    const collapseItems = getMealItem.map((category, index) => {
        const total = category.product.length;
        const checkedCount = category.product.filter(p => p.checked).length;
        const allChecked = total > 0 && checkedCount === total;
        const partiallyChecked = checkedCount > 0 && checkedCount < total;

        return {
            key: String(index + 1),
            label: (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-neutral-800 text-base font-bold">{category.name}</div>
                        <Tag color="#FEECD2" className="custom-tag-orange">
                            {checkedCount} selected
                        </Tag>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            indeterminate={partiallyChecked}
                            checked={allChecked}
                            onChange={(e) => handleCategoryCheckAll(category.id, e.target.checked)}
                        />
                    </div>
                </div>
            ),
            children: (
                <div className="space-y-3">
                    {
                        category.product.length > 0 ? (
                            <>
                                {
                                    category.product.map((product, pIndex) => (
                                        <div
                                            key={pIndex}
                                            className="flex items-center gap-4 border rounded-lg p-2"
                                        >
                                            <img
                                                src={product.product_image}
                                                alt={product.name}
                                                className="w-[52px] h-[52px] rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 font-semibold text-neutral-900 text-base">
                                                    <span>{product.item_code}</span>
                                                    <span className=" truncate">{product.name}</span>
                                                </div>
                                                <div className="text-base text-neutral-900">RM {product.prices}</div>
                                            </div>
                                            <Checkbox
                                                checked={product.checked || false}
                                                onChange={(e) =>
                                                    handleProductSelect(category.id, product.id, e.target.checked)
                                                }
                                            />
                                        </div>
                                    ))
                                }
                            </>
                        ) : (
                            <div className="flex justify-center items-center py-3 gap-2">
                                <span className="text-error-500">✖</span> {t('no_product_found_in_this_category')}
                            </div>
                        )
                    }
                    
                </div>
            ),
        };
    });

    const handleProductSelect = (categoryId, productId, checked) => {
        const updated = getMealItem.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
            ...cat,
            product: cat.product.map(prod =>
                prod.id === productId ? { ...prod, checked } : prod
            )
            };
        });
        setGetMealItem(updated);
    };

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.store-modifier-group'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('product_created_success')}`, {
                    title: `${t('product_created_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
                setSelectedItemToEdit(null);
                setSelectedModifierItem([]);
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
                    <div className="w-full flex flex-col">
                        <div className="text-neutral-900 text-xxl font-bold">{t('create_modifier_group')}</div>
                        <div className="text-neutral-500 text-sm font-medium">{t('add_modifier_group_for_customer')}</div>
                    </div>

                    {/* content */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="text-neutral-900 text-lg font-bold">{t('group_details')}</div>
                                <div className="text-neutral-300 text-xs">{t('general_details_about_modifier_group')}</div>
                            </div>
                            <div className="py-5 flex flex-col gap-5">
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('group_name')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                        <div>
                                            <Tooltip placement="top" title='This name will be displayed for customer (e.g. Select your rice portion.)' className="custom-tooltip" >
                                                <div>
                                                    <TooltipIcon className="hover:text-primary-500 cursor-help" />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-1">
                                        <TextInput 
                                            type='text'
                                            value={data.group_name}
                                            className="w-full max-w-[328px]"
                                            onChange={(e) => setData('group_name', e.target.value)}
                                            placeholder={t('eg_rice_portion')}
                                        />
                                        <InputError message={errors.group_name} />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('display_name')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-1">
                                        <TextInput 
                                            type='text'
                                            value={data.display_name}
                                            className="w-full max-w-[328px]"
                                            onChange={(e) => setData('display_name', e.target.value)}
                                            placeholder={t('eg_select_your_rice_portion')}
                                        />
                                        <InputError message={errors.display_name} />
                                    </div>
                                </div>
                                <div className="px-5 py-2.5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('group_type')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-1">
                                        <Radio.Group 
                                            value={data.group_type}
                                            onChange={(e) => setData('group_type', e.target.value)}
                                            options={[
                                                { label: <div className="flex items-center gap-2">
                                                    <span>{t('required')}</span>
                                                    <Tooltip placement="top" title='If ‘Required’ is chosen, the customer must select any item(s) from this modifier group.' >
                                                        <div>
                                                            <TooltipIcon className="hover:text-primary-500 cursor-help" />
                                                        </div>
                                                    </Tooltip>
                                                </div>, 
                                                value: 'required' },
                                                { label: <div className="flex items-center gap-2">
                                                    <span>{t('optional')}</span>
                                                    <Tooltip placement="top" title='If ‘Optional’ is selected, the customer decides if they want to choose anything from this group.' >
                                                        <div>
                                                            <TooltipIcon className="hover:text-primary-500 cursor-help" />
                                                        </div>
                                                    </Tooltip>
                                                    </div>, 
                                                    value: 'optional' }
                                            ]}
                                        />
                                        <InputError message={errors.display_name} />
                                    </div>
                                </div>
                                <div className="px-5 py-2.5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('min_n_max_selection')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <InputNumber 
                                                    prefix='Min. '
                                                    value={data.min_value}
                                                    min={data.group_type === 'required' ? '1' : '0'}
                                                    max='1'
                                                    step="1"
                                                    onChange={(value) => setData('min_value', value)}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    placeholder='1'
                                                    className="w-full max-w-[136px] custom-input-min"
                                                />
                                            </div>
                                            <div className="w-10 h-[1px] bg-neutral-100"></div>
                                            <div>
                                                <InputNumber 
                                                    prefix='Max. '
                                                    value={data.max_value}
                                                    min='1'
                                                    step="1"
                                                    onChange={(value) => setData('max_value', value)}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    placeholder='1'
                                                    className="w-full max-w-[136px] custom-input-min"
                                                />
                                            </div>
                                        </div>
                                        <InputError message={errors.min_value || errors.max_value} />
                                    </div>
                                </div>
                                {/* <div className="px-5 py-2.5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('allow_overide')}?</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
                                        <Radio.Group 
                                            value={data.overide}
                                            onChange={(e) => setData('overide', e.target.value)}
                                            options={[
                                                { label: t('not_allow'), value: 'not_allowed' },
                                                { label: t('allow'), value: 'allowed' }
                                            ]}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="flex items-center gap-3">
                                    <div className="text-neutral-900 text-lg font-bold">{t('add_modifier_item')}</div>
                                    <div>
                                        {
                                            data.modifier_item && data.modifier_item.length > 0 && (
                                                <Tag color="#FEECD2" className="custom-tag-orange" >{data.modifier_item.length} Items</Tag>
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    data.modifier_item && data.modifier_item.length > 0 && (
                                        <Button size="sm" variant="textOnly" className="flex items-center gap-2" onClick={addModifierItem} >
                                            <PlusIcon className='w-4 h-4' />
                                            <span>{t('add_another_item')}</span>
                                        </Button>
                                    )
                                }
                            </div>
                            <div className={`${data.modifier_item && data.modifier_item.length > 0 ? 'p-0' : 'p-5 '} flex flex-col gap-5 `}>
                                {
                                    data.modifier_item && data.modifier_item.length > 0 ? (
                                        <>
                                            <DraggableTable
                                                dataSource={data.modifier_item}
                                                onChange={(newItems) => setData('modifier_item', newItems)}
                                            />
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Button size="md" className="flex items-center gap-2" onClick={addModifierItem} >
                                                <PlusIcon />
                                                <span>{t('add')}</span>
                                            </Button>
                                            <InputError message={errors.modifier_item} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="flex items-center gap-3">
                                    <div className="text-neutral-900 text-lg font-bold">{t('add_to_meal_item')}</div>
                                    <div className="text-neutral-300 text-xs">

                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col gap-5">
                                {
                                    data.meal_items ? (
                                        <div className="flex flex-wrap gap-4">
                                            {
                                                data.meal_items.map((item, index) => (
                                                    <div key={index} className="w-[120px] h-[120px] border border-neutral-100 rounded-lg bg-neutral-50 relative p-5">
                                                        {item.name}

                                                        <div className="absolute top-2 right-2 cursor-pointer " onClick={() => removeFromItemMeal(item)} >
                                                            <RemoveProductIcon /> 
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <div className="w-[120px] h-[120px] border border-dashed border-primary-500 rounded-lg bg-[#fff3e166] hover:bg-primary-50 flex flex-col justify-center items-center cursor-pointer" onClick={addMealItem}>
                                                <PlusIcon className='text-primary-400' />
                                                <div className="text-primary-500 font-medium">Add more</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Button size="md" className="flex items-center gap-2" onClick={addMealItem} >
                                                <PlusIcon />
                                                <span>{t('add')}</span>
                                            </Button>

                                            <InputError message={errors.modifier_item} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* sticky bar */}
                <div className="sticky bottom-0 w-full px-4">
                    <div className="w-full py-4 px-5 bg-white flex items-center justify-between border-t border-[#d0471833] shadow-footer">
                        <Button size="md" variant="white">
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={submit} disabled={isLoading} >
                            {t('create_new')}
                        </Button>
                    </div>
                </div>
            </div>


            <Modal
                show={isAddModifierItemOpen}
                onClose={closeModifierItem}
                title={t('select_modifier_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeModifierItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={addItem}>
                            {t('add')}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col">
                    <div className="px-5 pb-4 flex items-center gap-5 border-b border-gray-100">
                        <div className="w-full">
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
                        <Button variant="black" size="md" className="flex items-center gap-2" onClick={createModifierItem} >
                            <PlusIcon />
                            <span>{t('create')}</span>
                        </Button>
                    </div>

                    {/* content */}
                    <div className="flex flex-col">
                        {
                            getModifierItem && getModifierItem.length > 0 ? (
                                <>
                                    {
                                        getModifierItem.map((item, index) => (
                                            <div key={index} className="py-4 px-5 flex items-center gap-4">
                                                <div className="w-full flex flex-col gap-1">
                                                    <div className="text-neutral-900 text-base font-bold">{item.modifier_name}</div>
                                                    <div className="text-neutral-900 text-base" >+ RM {item.price}</div>
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
                                </>
                            ) : isLoading ? (
                                <div className="py-10 flex flex-col items-center justify-center">
                                    <Spin size="large" />
                                </div>
                            ) : (
                                <div className="py-5 flex flex-col items-center justify-center">
                                    <NoModifier />
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-neutral-800 text-xl font-bold">{t('oops')}!</div>
                                        <div className="text-neutral-500 text-base">{t('no_modifier_items_found_create_one')}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Modal>

            <CreateModifierItem 
                isCreateModifierOpen={isCreateModifierOpen} 
                setIsCreateModifierOpen={setIsCreateModifierOpen} 
                closeCreateModifierItem={closeCreateModifierItem} 
                fetchModifierItem={fetchModifierItem}
            />

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
                                    value={selectedItemToEdit.modifier_name}
                                    className="w-full "
                                    onChange={(e) => setSelectedItemToEdit(prev => ({ ...prev, modifier_name: e.target.value }))}
                                    placeholder={t('eg_large')}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <InputLabel value={t('price')} />
                                <InputNumber 
                                    prefix='RM '
                                    value={selectedItemToEdit.price || 0.00}
                                    min='0.00'
                                    step="0.01"
                                    onChange={(value) => setSelectedItemToEdit(prev => ({ ...prev, price: value }))}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    placeholder='12.90'
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )
                }
            </Modal>

            <Modal
                show={openAddMealItem}
                onClose={closeMealItem}
                title={t('select_meal_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeMealItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={addInMealItem}>
                            {t('update')}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col">
                    <div className="px-5 pb-4 border-b border-neutral-100">
                        <SearchInput 
                            withIcon
                            IconComponent={searchFilterMeal ? null : SearchIcon}
                            placeholder='Search'
                            value={searchFilterMeal}
                            onChange={(e) => setSearchFilterMeal(e.target.value)}
                            dataValue={searchFilterMeal != ''}
                            clearfunc={
                                <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 cursor-pointer" onClick={clearSearchFilter}>
                                    <XIcon className="w-4 h-4" />
                                </div>
                            }
                        />
                    </div>
                    <div>
                        {
                            isLoading ? (
                                <div></div>
                            ) : (
                                <>
                                    {
                                        getMealItem.length > 0 ? (
                                            <>
                                                <Collapse items={collapseItems} ghost defaultActiveKey={['1']} />
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
            </Modal>

        </TenantAuthenicatedLayout>
    )
}
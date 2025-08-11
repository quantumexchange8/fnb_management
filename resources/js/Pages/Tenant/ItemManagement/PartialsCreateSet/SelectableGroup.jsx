import Button from "@/Components/Button";
import { DeleteIcon, EditIcon, MinusIcon, NextIcon, PlusIcon, PreviousIcon, SearchIcon, XIcon } from "@/Components/Icon/Outline";
import NoGroupIllus from "@/Components/Illustration/NoGroup";
import Modal from "@/Components/Modal";
import SearchInput from "@/Components/SearchInput";
import TextInput from "@/Components/TextInput";
import { Checkbox, Collapse, InputNumber, Radio, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SelectableGroup({ 
    isSelectableGrpOpen,
    setIsSelectableGrpOpen,
    closeGroup,
    data,
    setData,
    editSelectableItem,
    isEditSelectableGrpOpen,
    closeEditSelectableGroup,
}) {

    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [getMealItem, setGetMealItem] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditOptionOpen, setIsEditOptionOpen] = useState(false);
    const [selectedEditOption, setSelectedEditOption] = useState(null);

    const [groupData, setGroupData] = useState({
        uid: Date.now(),
        group_name: '',
        group_type: 'single-select',
        group_option: null,
        group_selectable_type: 'unlimited',
        min_select: 0,
        max_select: 0,
    });

    useEffect(() => {
        if (editSelectableItem) {
            setGroupData({
                uid: editSelectableItem.uid,
                group_name: editSelectableItem.group_name,
                group_type: editSelectableItem.group_type,
                group_option: editSelectableItem?.group_option ?? editSelectableItem?.set_meal_group_item,
                group_selectable_type: editSelectableItem.group_selectable_type,
                min_select: editSelectableItem.min_select ? editSelectableItem.min_select : 0,
                max_select: editSelectableItem.max_select ? editSelectableItem.max_select : 0,
            })
        }
    }, [editSelectableItem]);

    const fetchMealItem = async () => {
        setIsLoading(true);

         try {

            const response = await axios.get('/items-management/getMealItem');

            const mealItems = groupData.group_option || [];
            const currentSelectedMap = new Map(mealItems.map(item => [item.id, item]));

            const syncedItems = response.data.map(category => ({
                ...category,
                product: category.product.map(prod => {
                    const matchedItem = currentSelectedMap.get(prod.id);
                    return {
                        ...prod,
                        checked: !!matchedItem,
                        quantity: matchedItem?.quantity ?? 1,
                        additional_charge: matchedItem?.additional_charge ?? 0,
                    };
                }),
            }));

            setGetMealItem(syncedItems);
            
        } catch (error) {
            console.error('Error Fetching Meal Item: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isAddOptionOpen) {
            fetchMealItem();
        }
    }, [isAddOptionOpen]);

    const nextStep = () => {
        setStep (2);
    }
    const prevStep = () => {
        setStep (1);
    }

    const openAddOption = () => {
        setIsAddOptionOpen(true);
    }
    const closeAddOption = () => {
        setIsAddOptionOpen(false);
    }
    
    const clearFilter = () => {
        setSearchFilter('');
    }

    const closeCreateGroup = () => {
        setStep(1);
        closeGroup();
        setGroupData({
            uid: Date.now(),
            group_name: '',
            group_type: 'single-select',
            group_option: null,
            group_selectable_type: 'unlimited',
            min_select: 0,
            max_select: 0,
        })
    }

    const collapseItems = getMealItem.map((category, index) => {
        const total = category.product.length;
        const checkedCount = category.product.filter(p => p.checked).length;
        const allChecked = total > 0 && checkedCount === total;
        const partiallyChecked = checkedCount > 0 && checkedCount < total;

        const filteredProducts = category.product.filter(product =>
            product.name.toLowerCase().includes(searchFilter.toLowerCase()) || product.item_code.toLowerCase().includes(searchFilter.toLowerCase()) || category.name.toLowerCase().includes(searchFilter.toLowerCase())
        );

        // Skip this category if no products match the search
        if (searchFilter && filteredProducts.length === 0) return null;

        return {
            key: String(index + 1),
            label: (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`${partiallyChecked ? 'text-primary-500' : 'text-neutral-800'} text-base font-bold`}>{category.name}</div>
                    </div>
                    {/* <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            indeterminate={partiallyChecked}
                            checked={allChecked}
                            onChange={(e) => handleCategoryCheckAll(category.id, e.target.checked)}
                        />
                    </div> */}

                </div>
            ),
            children: (
                <div className="space-y-3">
                    {
                        filteredProducts.length > 0 ? (
                            <>
                                {
                                    filteredProducts.map((product, pIndex) => (
                                        <div key={pIndex} className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4 border rounded-lg p-2">
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
                                            {
                                                product.checked && (
                                                    <div className="flex flex-col">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-neutral-500 text-xs font-medium" >{t('additional_charge')}</div>
                                                            <InputNumber 
                                                                prefix='RM '
                                                                value={product.additional_charge ?? 0}
                                                                min={0}
                                                                step="0.01"
                                                                onChange={(value) => handleAdditionalChargeChange(category.id, product.id, value)}
                                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                placeholder='0.00'
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div className="w-full flex items-center gap-2 py-4">
                                                            <Button
                                                                variant="textOnly"
                                                                className={`p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 max-w-11 ${
                                                                    product.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                                }`}
                                                                disabled={product.quantity <= 1}
                                                                onClick={() => updateQuantity(category.id, product.id, -1)}
                                                            >
                                                                <MinusIcon className={`${product.quantity > 0 ? 'text-neutral-900' : 'text-neutral-100'}`} />
                                                            </Button>
                                                            <div className="w-full">
                                                                <TextInput
                                                                    className="border border-neutral-100 rounded-xl bg-white shadow-input w-full text-center"
                                                                    readOnly
                                                                    value={product.quantity || 1}
                                                                />
                                                            </div>
                                                            <Button
                                                                variant="textOnly"
                                                                className="p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 max-w-11"
                                                                onClick={() => updateQuantity(category.id, product.id, 1)}
                                                            >
                                                                <PlusIcon className="text-neutral-900" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
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
    }).filter(item => item !== null);

    const updateQuantity = (categoryId, productId, change) => {
        const updated = getMealItem.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                product: cat.product.map(prod => {
                    if (prod.id !== productId) return prod;
                    const newQty = Math.max(1, (prod.quantity || 1) + change);
                    return { ...prod, quantity: newQty };
                })
            };
        });
        setGetMealItem(updated);
    };

    const handleAdditionalChargeChange = (categoryId, productId, value) => {
        const updatedItems = getMealItem.map(category => {
            if (category.id !== categoryId) return category;

            const updatedProducts = category.product.map(product => {
                if (product.id !== productId) return product;

                return {
                    ...product,
                    additional_charge: value
                };
            });

            return { ...category, product: updatedProducts };
        });

        setGetMealItem(updatedItems);
    };

    
    const handleProductSelect = (categoryId, productId, checked) => {
        const updatedItems = getMealItem.map(category => {
            if (category.id !== categoryId) return category;

            const updatedProducts = category.product.map(product => {
                if (product.id !== productId) return product;

                return {
                    ...product,
                    checked,
                    quantity: product.quantity || 1,
                    additional_charge: checked ? (product.additional_charge || 0.00) : 0.00
                };
            });

            return { ...category, product: updatedProducts };
        });

        setGetMealItem(updatedItems);
    };

    // const handleCategoryCheckAll = (categoryId, checked) => {
    //     const updated = getMealItem.map(cat => {
    //         if (cat.id !== categoryId) return cat;
    //         return {
    //             ...cat,
    //             product: cat.product.map(prod => ({
    //                 ...prod,
    //                 checked: checked,
    //             })),
    //         };
    //     });

    //     setGetMealItem(updated);
    // };
    const addOption = () => {
        const selectedItems = getMealItem.flatMap(cat =>
            cat.product.filter(p => p.checked).map(p => ({
                id: p.id,
                name: p.name,
                item_code: p.item_code,
                quantity: p.quantity || 1,
                prices: p.prices ?? 0,
                additional_charge: p.additional_charge ?? 0,
                product_image: p.product_image ?? null,
            }))
        );

        setGroupData(prev => ({
            ...prev,
            group_option: selectedItems
        }))
        setIsAddOptionOpen(false);
        clearFilter();
    };

    const editOptionItem = (option) => {
        setSelectedEditOption(option);
        setIsEditOptionOpen(true);
    }
    const closeEditOptionItem = () => {
        setSelectedEditOption(null);
        setIsEditOptionOpen(false);
    }
    const updateOption = () => {
        setGroupData(prev => ({
            ...prev,
            group_option: (prev.group_option || []).map(option => 
            option.id === selectedEditOption.id ? selectedEditOption : option
            )
        }));
        closeEditOptionItem();
    }

    const removeFromOption = (removeId) => {
        setGroupData(prev => ({
            ...prev,
            group_option: (prev.group_option || []).filter(option => option.id !== removeId)
        }));
    };

    const confirm = () => {
        setData('selectable_group', [...(data.selectable_group || []), groupData]);
        setStep(1);
        setGroupData({
            group_name: '',
            group_type: 'single-select',
            group_option: null,
        });
        closeCreateGroup(false);
    }

    const updateSelectedItem = () => {
        const prevGroups = data.selectable_group || [];
        const existingIndex = prevGroups.findIndex((g) => g.uid === groupData.uid);

        let updatedGroups;
        if (existingIndex !== -1) {
            // Update existing
            updatedGroups = [...prevGroups];
            updatedGroups[existingIndex] = groupData;
        } else {
            // Add new
            updatedGroups = [...prevGroups, groupData];
        }

        setData('selectable_group', updatedGroups);

        setStep(1);
        setGroupData({
            uid: Date.now(),
            group_name: '',
            group_type: 'single-select',
            group_option: null,
            group_selectable_type: 'unlimited',
            min_select: 0,
            max_select: 0,
        });
        closeEditSelectableGroup();
    };

    return (
        <>
            <Modal
                show={isSelectableGrpOpen}
                onClose={closeCreateGroup}
                title={t('create_group')}
                maxWidth='lg'
                maxHeight='lg'
                footer={
                    <div className="w-full flex items-center justify-between gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeCreateGroup}>
                            {t('cancel')}
                        </Button>
                        {
                            step === 1 && (
                                <Button size="md" className="flex items-center gap-2" 
                                    disabled={
                                        !groupData.group_name ||
                                        (
                                        groupData.group_type === 'multi-select' &&
                                        groupData.group_selectable_type === 'limited' &&
                                        groupData.min_select === 0
                                        )
                                    }
                                    onClick={nextStep} 
                                >
                                    {t('next')}
                                    <NextIcon />
                                </Button>
                            )
                        }
                        {
                            step === 2 && (
                                <div className="flex items-center gap-2">
                                    <Button variant="white" size="md" onClick={prevStep} className="flex items-center gap-2" >
                                        <PreviousIcon />
                                        {t('previous')}
                                    </Button>
                                    <Button size="md" disabled={!groupData.group_option || groupData?.group_option.length === 0} onClick={confirm} >
                                        {t('confirm')}
                                    </Button>
                                </div>
                            )
                        }
                        
                    </div>
                }
            >
                <div className="flex w-full border-t border-neutral-100 ">
                    <div className="p-4 flex flex-col gap-2 border-r border-neutral-100 ">
                        <div className={`${step === 1 ? 'bg-active-step' : 'bg-white'} py-3 px-4 flex items-center gap-3 rounded-lg`}>
                            <div className={`${step === 1 ? 'bg-primary-500 text-neutral-25' : 'bg-neutral-25 text-neutral-200'} w-5 h-5 rounded-full  py-1 px-[3px] flex items-center justify-center text-xs  font-bold`}>1</div>
                            <div className={`${step === 1 ? 'text-neutral-500 font-bold' : 'text-neutral-200 font-medium'}  text-base`}>{t('group_detail')}</div>
                        </div>
                        <div className={`${step === 2 ? 'bg-active-step' : 'bg-white'} py-3 px-4 flex items-center gap-3 rounded-lg`}>
                            <div className={`${step === 2 ? 'bg-primary-500 text-neutral-25' : 'bg-neutral-25 text-neutral-200'} w-5 h-5 rounded-full  py-1 px-[3px] flex items-center justify-center text-xs  font-bold`}>2</div>
                            <div className={`${step === 2 ? 'text-neutral-500 font-bold' : 'text-neutral-200 font-medium'}  text-base`}>{t('add_option')}</div>
                        </div>
                    </div>
                    <div className="p-5 w-full max-w-[520px] lg:max-w-none">
                        {
                            step === 1 && (
                                <div className="flex flex-col gap-7">
                                    <div className="flex flex-col gap-3">
                                        <div className="text-neutral-900 text-base font-bold">{t('enter_your_group_name')}</div>
                                        <TextInput 
                                            type="text"
                                            value={groupData.group_name ?? ''}
                                            className="w-full"
                                            onChange={(e) =>
                                                setGroupData(prev => ({
                                                    ...prev,
                                                    group_name: e.target.value,
                                                }))
                                            }
                                            placeholder={t('eg_select_a_drink')}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="text-neutral-900 text-base font-bold">{t('group_type')}</div>
                                        <div className="w-full flex flex-col gap-3 py-2">
                                            <Radio.Group
                                                onChange={(e) => setGroupData({ ...groupData, group_type: e.target.value })}
                                                value={groupData.group_type}
                                                className="w-full flex flex-col gap-3 py-2"
                                            >
                                                {/* Single Select */}
                                                <div
                                                    onClick={() => setGroupData({ ...groupData, group_type: 'single-select' })}
                                                    className={`cursor-pointer ${
                                                        groupData.group_type === 'single-select'
                                                            ? 'border-primary-500 bg-primary-25'
                                                            : 'border-neutral-400 bg-white'
                                                    } border rounded-lg p-4 flex items-center gap-5`}
                                                >
                                                    <div className="flex flex-col w-full">
                                                        <div className="text-neutral-900 text-sm font-bold">{t('single_select_only')}</div>
                                                        <div className="text-neutral-400 text-sm">
                                                            {t('customer_can_choose_only_one_item_from_the_group')}
                                                        </div>
                                                    </div>
                                                    <Radio value="single-select" />
                                                </div>

                                                {/* Multi Select */}
                                                <div
                                                    onClick={() => setGroupData({ ...groupData, group_type: 'multi-select' })}
                                                    className={`cursor-pointer ${
                                                        groupData.group_type === 'multi-select'
                                                            ? 'border-primary-500 bg-primary-25'
                                                            : 'border-neutral-400 bg-white'
                                                    } border rounded-lg p-4 flex items-center gap-5`}
                                                >
                                                    <div className="flex flex-col w-full">
                                                        <div className="text-neutral-900 text-sm font-bold">{t('multi-select')}</div>
                                                        <div className="text-neutral-400 text-sm">
                                                            {t('customer_can_choose_more_than_one_item_from_the_group')}
                                                        </div>
                                                    </div>
                                                    <Radio value="multi-select" />
                                                </div>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                    {
                                        groupData.group_type === 'multi-select' && (
                                            <div className="flex flex-col gap-7">
                                                <div className="flex flex-col gap-3">
                                                    <div className="text-neutral-900 text-base font-bold">{t('selectable_type')}</div>
                                                    <Radio.Group
                                                        value={groupData.group_selectable_type}
                                                        onChange={(e) => setGroupData({ ...groupData, group_selectable_type: e.target.value })}
                                                        options={[
                                                            { label: t('unlimited'), value: 'unlimited'},
                                                            { label: t('limited'), value: 'limited'},
                                                        ]}
                                                    />
                                                </div>
                                                {
                                                    groupData.group_selectable_type === 'limited' && (
                                                        <div className="flex flex-col gap-3">
                                                            <div className="text-neutral-900 text-base font-bold">{t('min_max')}</div>
                                                            <div className="flex items-center gap-3">
                                                                <InputNumber 
                                                                    prefix='Min. '
                                                                    value={groupData.min_select ?? 0}
                                                                    min={0}
                                                                    step="1"
                                                                    onChange={(value) => setGroupData(prev => ({ ...prev, min_select: value }))}
                                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    placeholder='1'
                                                                    className="w-full"
                                                                />
                                                                <div className="w-10 h-[1px] bg-neutral-100"></div>
                                                                <InputNumber 
                                                                    prefix='Max. '
                                                                    value={groupData.max_select ?? 0}
                                                                    min={0}
                                                                    step="1"
                                                                    onChange={(value) => setGroupData(prev => ({ ...prev, max_select: value }))}
                                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    placeholder='1'
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            step === 2 && (
                                <div className="flex flex-col items-center gap-5">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-xl text-neutral-900 font-bold">{groupData.group_name}</span>
                                        <div className="text-neutral-400 text-sm">
                                            {
                                                groupData.group_type === 'single-select' && <span>{t('select_one(1)_item_only')}</span>
                                            }
                                            {
                                                (groupData.group_type === 'multi-select' && groupData.group_selectable_type === 'limited') && (
                                                    <div className="flex items-center gap-4">
                                                        <span>{t('min_selection')}: {groupData.min_select}</span>
                                                        <span>{t('max_selection')}: {groupData.max_select}</span>
                                                    </div>
                                                )
                                            }
                                            {
                                                (groupData.group_type === 'multi-select' && groupData.group_selectable_type === 'unlimited') && (
                                                    <span>{t('unlimited')}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {
                                        groupData.group_option && groupData.group_option.length > 0 ? (
                                            <div className="flex flex-col gap-4 w-full">
                                                {
                                                    groupData.group_option.map((option, index) => (
                                                        <div key={index} className="p-4 flex items-center gap-4 w-full border border-neutral-100 rounded-xl" >
                                                            <div className="p-2 border border-neutral-200 rounded-xl shadow-input text-center">
                                                                <div className="w-6 text-neutral-900 text-sm font-bold">{option.quantity}x</div>
                                                            </div>
                                                            <div className="flex items-center gap-4 w-full">
                                                                <div className="py-1 px-1.5 bg-neutral-50 rounded-lg border border-neutral-100 max-w-[52px] h-[52px] w-full flex items-center justify-center">
                                                                    {/* <span className="text-xss">{option.item_code}</span> */}
                                                                    {
                                                                        option.product_image ? (
                                                                            <img src={option.product_image} alt={option.product_image} className="object-cover" />
                                                                        ) : (
                                                                            <span className="text-xss">{option.item_code}</span>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="flex flex-col gap-1 w-full">
                                                                    <div className="text-neutral-900 text-base font-bold">{option.item_code} {option.name}</div>
                                                                    <div>RM {option.additional_charge ? Number(option.additional_charge).toFixed(2) : 0}</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-[9px] cursor-pointer hover:bg-neutral-25 rounded-lg" onClick={() => editOptionItem(option)} >
                                                                        <EditIcon />
                                                                    </div>
                                                                    <div className="p-[9px] cursor-pointer hover:bg-neutral-25 rounded-lg" onClick={() => removeFromOption(option.id)} >
                                                                        <DeleteIcon />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                <div className="w-full" onClick={openAddOption}>
                                                    <Button size="md" variant="secondary" className="flex justify-center items-center gap-2 w-full">
                                                        <PlusIcon />
                                                        <span>{t('add_another_option')}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="min-h-[300px] flex">
                                                <div className="flex flex-col gap-2 justify-center items-center max-w-[276px]">
                                                    <NoGroupIllus />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="text-neutral-800 text-lg font-bold">{t('oops')}!</div>
                                                        <div className="text-neutral-500 text-sm">{t('it_look_like_you_havent_added_any_option_into_this_group_yet')}</div>
                                                    </div>
                                                    <Button size="md" onClick={openAddOption} >
                                                        {t('add_option_now')}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </Modal>

            <Modal
                show={isAddOptionOpen}
                onClose={closeAddOption}
                title={t('add_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeAddOption}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={addOption}>
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
                    </div>
                    {/* content */}
                    <div>
                        {
                            isLoading ? (
                                <div className="py-10 flex flex-col items-center justify-center">
                                    <Spin size="large" />
                                </div>
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

            {/* Edit Option */}
            <Modal
                show={isEditOptionOpen}
                onClose={closeEditOptionItem}
                title={t('edit_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeEditOptionItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={updateOption}>
                            {t('save_changes')}
                        </Button>
                    </div>
                }
            >
                {
                    selectedEditOption && (
                        <div className="flex flex-col gap-5 px-5 py-4">
                            <div className="flex items-center gap-4 border rounded-lg p-2">
                                <img
                                    src={selectedEditOption.product_image}
                                    alt={selectedEditOption.item_code}
                                    className="w-[52px] h-[52px] rounded object-cover bg-neutral-200"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-semibold text-neutral-900 text-base">
                                        <span>{selectedEditOption.item_code}</span>
                                        <span className=" truncate">{selectedEditOption.name}</span>
                                    </div>
                                    <div className="text-base text-neutral-900">RM {selectedEditOption.prices}</div>
                                </div>
                            </div>
                            {/* additional charge */}
                            <div className="flex flex-col gap-1">
                                <div className="text-neutral-500 text-xs font-medium" >{t('additional_charge')}</div>
                                <InputNumber 
                                    prefix='RM '
                                    value={selectedEditOption.additional_charge ?? 0}
                                    min={0}
                                    step="0.01"
                                    onChange={(value) => {
                                        setSelectedEditOption(prev => ({
                                            ...prev,
                                            additional_charge: value,
                                        }));
                                    }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    placeholder='0.00'
                                    className="w-full"
                                />
                            </div>
                            <div className="w-full flex items-center gap-2 py-4">
                                <Button
                                    variant="textOnly"
                                    className={`p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 max-w-11 ${
                                        selectedEditOption.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={selectedEditOption.quantity <= 1}
                                    onClick={() => {
                                        setSelectedEditOption(prev => ({
                                            ...prev,
                                            quantity: Math.max(1, (prev.quantity || 1) - 1)
                                        }));
                                    }}
                                >
                                    <MinusIcon className={`${selectedEditOption.quantity > 0 ? 'text-neutral-900' : 'text-neutral-100'}`} />
                                </Button>
                                <div className="w-full">
                                    <TextInput
                                        className="border border-neutral-100 rounded-xl bg-white shadow-input w-full text-center"
                                        readOnly
                                        value={selectedEditOption.quantity || 1}
                                    />
                                </div>
                                <Button
                                    variant="textOnly"
                                    className="p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-25 bg-white shadow-button box-border max-h-11 max-w-11"
                                    onClick={() => {
                                        setSelectedEditOption(prev => ({
                                            ...prev,
                                            quantity: (prev.quantity || 1) + 1
                                        }));
                                    }}
                                >
                                    <PlusIcon className="text-neutral-900" />
                                </Button>
                            </div>
                        </div>
                    )
                }
            </Modal>

            <Modal
                show={isEditSelectableGrpOpen}
                onClose={closeEditSelectableGroup}
                title={t('edit_group')}
                maxWidth='lg'
                maxHeight='lg'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeEditSelectableGroup}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={updateSelectedItem} >
                            {t('confirm')}
                        </Button>
                    </div>
                }
            >
                {
                    editSelectableItem && (
                        <div className="p-5 flex flex-col gap-7">
                            <div className="flex flex-col gap-3">
                                <div className="text-neutral-900 text-base font-bold">{t('group_name')}</div>
                                <div>
                                    <TextInput 
                                        className='w-full'
                                        value={groupData.group_name}
                                        onChange={(e) =>
                                            setGroupData((prev) => ({
                                            ...prev,
                                            group_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-neutral-900 text-base font-bold">{t('group_type')}</div>
                                <div className="py-2 flex flex-col gap-1">
                                    <div className="text-neutral-900 text-sm font-bold">{groupData.group_type === 'single-select' ? t('single_select_only') : t('multi-select')}</div>
                                    <div className="text-neutral-400 text-sm">{groupData.group_type === 'single-select' ? t('customer_can_choose_only_one_item_from_the_group') : t('customer_can_choose_more_than_one_item_from_the_group')}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-neutral-900 text-base font-bold">{t('option_from_this_group')}</div>
                                <div className="flex flex-col gap-4">
                                    {
                                        groupData.group_option?.length > 0 && (
                                            <div className="flex flex-col gap-4 w-full">
                                                {
                                                    groupData.group_option.map((opt, i) => (
                                                        <div key={i} className="p-4 flex items-center gap-4 w-full border border-neutral-100 rounded-xl">
                                                            <div className="p-2 border border-neutral-200 rounded-xl shadow-input text-center">
                                                                <div className="w-6 text-neutral-900 text-sm font-bold">{opt.quantity}x</div>
                                                            </div>
                                                            <div className="flex items-center gap-4 w-full">
                                                                <div className="py-1 px-1.5 bg-neutral-50 rounded-lg border border-neutral-100 max-w-[52px] h-[52px] w-full flex items-center justify-center">
                                                                    {
                                                                        opt.product_image ? (
                                                                            <img src={opt.product_image} alt={opt.product_image} className="object-cover" />
                                                                        ) : (
                                                                            <span className="text-xss">{opt.item_code}</span>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="flex flex-col gap-1 w-full">
                                                                    <div className="text-neutral-900 text-base font-bold">{opt.item_code} {opt.name}</div>
                                                                    <div>RM {opt.additional_charge ? Number(opt.additional_charge).toFixed(2) : '0.00'}</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-[9px] cursor-pointer hover:bg-neutral-25 rounded-lg" onClick={() => editOptionItem(opt)} >
                                                                        <EditIcon />
                                                                    </div>
                                                                    <div className="p-[9px] cursor-pointer hover:bg-neutral-25 rounded-lg" onClick={() => removeFromOption(opt.id)} >
                                                                        <DeleteIcon />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                <div className="w-full" onClick={openAddOption}>
                                                    <Button size="md" variant="secondary" className="flex justify-center items-center gap-2 w-full">
                                                        <PlusIcon />
                                                        <span>{t('add_another_option')}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </Modal>
        </>
    )
} 
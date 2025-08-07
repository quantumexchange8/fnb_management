import Button from "@/Components/Button";
import { GripLine2lIcon, MinusIcon, PlusIcon, QtyBg, RemoveGroupIcon, SearchIcon, SuccessIcon, XIcon, XIcon2, XIcon4 } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import Modal from "@/Components/Modal";
import SearchInput from "@/Components/SearchInput";
import TextInput from "@/Components/TextInput";
import { Checkbox, Collapse, InputNumber, Radio, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectableGroup from "./SelectableGroup";
import { motion, AnimatePresence } from 'framer-motion';

export default function AddItemSet({ data, setData, errors, getErrors }) {

    const { t, i18n } = useTranslation();
    const [getCategory, setGetCategory] = useState();
    const [getMealItem, setGetMealItem] = useState([]);
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchFilterMeal, setSearchFilterMeal] = useState('');
    const [isSelectableGrpOpen, setIsSelectableGrpOpen] = useState(false);
    const [enableDeleteOpen, setEnableDeleteOpen] = useState(false);
    const [tempSelectableGroup, setTempSelectableGroup] = useState(null);

    const fetchMealItem = async () => {
        setIsLoading(true);

         try {

            const response = await axios.get('/items-management/getMealItem');

            setGetMealItem(response.data);
            
        } catch (error) {
            console.error('Error Fetching Meal Item: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMealItem();
    }, [])

    const clearSearchFilter = () => {
        setSearchFilterMeal('');
    }

    const openAddItem = () => {
        setIsAddItemOpen(true);
    }
    const closeAddItem = () => {
        setIsAddItemOpen(false);
        fetchMealItem();
    }

    const openGroup = () => {
        setIsSelectableGrpOpen(true);
    }
    const closeGroup = () => {
        setIsSelectableGrpOpen(false);
    }

    const enableDeleteGroup = () => {
        setEnableDeleteOpen(true);
    }
    const closeEnableDeleteGroup = () => {
        setTempSelectableGroup(null); // reset to discard temp change
        setEnableDeleteOpen(false);
    }

    const removeGroupOption = (groupToRemove) => {
        const currentGroups = tempSelectableGroup ?? data.selectable_group ?? [];
        const updatedGroups = currentGroups.filter(
            group => group.uid !== groupToRemove.uid
        );

        setTempSelectableGroup(updatedGroups);
    };
    const updateNewDeletedGroup = () => {
        console.log('tempSelectableGroup', tempSelectableGroup)
        if (tempSelectableGroup && tempSelectableGroup.length > 0) {
            setData('selectable_group', tempSelectableGroup);
        }
        
        setTempSelectableGroup(null);
        closeEnableDeleteGroup();
    }

    const collapseItems = getMealItem.map((category, index) => {
            // Apply product filter based on search string
            const filteredProducts = category.product.filter(product =>
                product.name.toLowerCase().includes(searchFilterMeal.toLowerCase()) || product.item_code.toLowerCase().includes(searchFilterMeal.toLowerCase())
            );

            // Skip this category if no products match the search
            if (searchFilterMeal && filteredProducts.length === 0) return null;

            return {
                key: String(index + 1),
                label: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-neutral-800 text-base font-bold">{category.name}</div>
                        </div>
                    </div>
                ),
                children: (
                    <div className="space-y-3">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, pIndex) => (
                                <div key={pIndex} className="flex flex-col">
                                    {/* product card here */}
                                    <div className="flex items-center gap-4 border rounded-lg p-2">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-[52px] h-[52px] rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 font-semibold text-neutral-900 text-base">
                                                <span>{product.item_code}</span>
                                                <span className="truncate">{product.name}</span>
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

                                    {product.checked && (
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
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center py-3 gap-2">
                                <span className="text-error-500">✖</span> {t('no_product_found_in_this_category')}
                            </div>
                        )}
                    </div>
                ),
            };
        }).filter(item => item !== null);

    const handleProductSelect = (categoryId, productId, checked) => {
        const updated = getMealItem.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                product: cat.product.map(prod =>
                    prod.id === productId
                        ? { ...prod, checked, quantity: checked ? 1 : undefined }
                        : prod
                )
            };
        });
        setGetMealItem(updated);
    };


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


    const confirm = () => {
        const selectedItems = getMealItem.flatMap(cat =>
            cat.product.filter(p => p.checked).map(p => ({
                id: p.id,
                name: p.name,
                item_code: p.item_code,
                quantity: p.quantity || 1
            }))
        );
        
        setData('fixed_item', selectedItems);
        setIsAddItemOpen(false);

    };

    const displayedGroups = tempSelectableGroup ?? data.selectable_group ?? [];

    // console.log('data.selectable_group', data.selectable_group)
    

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Fixed Item */}
                <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                    <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('fixed_item')}</div>
                    </div>
                    <div className="p-5 flex gap-5">
                        {
                            data.fixed_item ? (
                                <>
                                    {
                                        data.fixed_item.map((selectedFixedItem, index) => (
                                            <div key={index} className="max-w-[120px] max-h-[120px] w-full h-[120px] bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                {selectedFixedItem.item_code}

                                                <div className="absolute top-2 right-2">
                                                    <XIcon4 />
                                                </div>
                                                <div className="absolute top-0 left-0">
                                                    <div className="relative">
                                                        <QtyBg />

                                                        <span className="absolute top-1 left-1 text-primary-25 text-xs font-bold">x{selectedFixedItem.quantity}</span>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="bg-[#fff3e166] max-w-[120px] max-h-[120px] w-full h-[120px] flex flex-col gap-1 justify-center items-center border border-dashed border-primary-500 rounded-lg cursor-pointer " onClick={openAddItem}>
                                        <PlusIcon className='text-primary-400' />
                                        <span className="text-primary-500 text-sm font-medium">{t('add_more')}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex">
                                        <Button size="md" className="flex items-center gap-2" onClick={openAddItem} >
                                            <PlusIcon />
                                            <span>{t('add_item')}</span>
                                        </Button>
                                    </div>

                                    <InputError message={getErrors.fixed_item} />
                                </div>
                            )
                        }
                    </div>
                </div>
                {/* Selectable group */}
                <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                    <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('selectable_group')}</div>
                        {
                            data.selectable_group && (
                                <div className="flex items-center gap-3">
                                    {
                                        enableDeleteOpen ? (
                                            <>
                                                <Button variant="textOnly" size="sm" className="flex items-center gap-1" onClick={closeEnableDeleteGroup} >
                                                    <XIcon2 className='text-error-500' />
                                                    <span className="text-error-500">{t('cancel_delete')}</span>
                                                </Button>
                                                <Button variant="textOnly" size="sm" className="flex items-center gap-2" onClick={updateNewDeletedGroup} >
                                                    <SuccessIcon className='text-success-600 w-5 h-5' />
                                                    <span className="text-success-600">{t('done_delete')}</span>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="textOnly" size="sm" className="flex items-center gap-2" disabled={data.selectable_group.length === 0} onClick={enableDeleteGroup} >
                                                    <MinusIcon className='text-error-500' />
                                                    <span className="text-error-500">{t('delete_group')}</span>
                                                </Button>
                                                <Button variant="textOnly" size="sm" className="flex items-center gap-2" onClick={openGroup} >
                                                    <PlusIcon />
                                                    <span>{t('add_another_group')}</span>
                                                </Button>
                                            </>
                                        )
                                    }
                                    
                                </div>
                            )
                        }
                    </div>
                    <div className="p-5 flex gap-5">
                        {
                            data.selectable_group ? (
                                <div className="flex flex-col gap-4 w-full">
                                    <AnimatePresence mode="popLayout">
                                        {
                                            displayedGroups.map((group, i) => (
                                                <motion.div
                                                    key={i}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8, height: 0, marginBottom: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="flex items-center gap-5"
                                                >
                                                        {
                                                            enableDeleteOpen && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="cursor-pointer bg-error-500 p-0.5 rounded-full"
                                                                    onClick={() => removeGroupOption(group)}
                                                                >
                                                                    <RemoveGroupIcon />
                                                                </motion.div>
                                                            )
                                                        }
                                                    <motion.div
                                                        layout
                                                        className="p-4 border border-neutral-50 bg-white shadow-sec-voucher w-full flex items-center rounded-xl"
                                                    >
                                                        <div className="flex flex-col gap-3 w-full">
                                                            <div className="flex justify-start">
                                                                <div className="bg-primary-500 px-3 py-0.5 text-primary-25 text-xss font-bold rounded-[100px]">
                                                                    <span>{t('step')}</span> <span>{i + 1}/{data.selectable_group.length}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-5">
                                                                <div className="flex flex-col gap-1 max-w-[250px] w-full">
                                                                    <div className="text-neutral-900 text-lg font-bold">
                                                                        {group.group_name}
                                                                    </div>
                                                                    <div className="text-neutral-400 text-sm">
                                                                        {
                                                                            group.group_type === 'single-select' ? (
                                                                                <>{t('select_one_1_item_only')}</>
                                                                            ) : (
                                                                                <>{t('min_selection')}: {} {t('max_selection')}: {}</>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {/*  selected product */}
                                                                <div className="flex items-center gap-3">
                                                                    {
                                                                        group.group_option.map((opt, index) => (
                                                                            <div key={index} className="p-1 w-[52px] h-[52px] flex items-center justify-center border border-neutral-100 bg-neutral-50 rounded-lg">
                                                                                <span className="text-xss">{opt.item_code}</span>
                                                                                
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div><GripLine2lIcon /></div>
                                                    </motion.div>
                                                </motion.div>
                                            ))
                                        }
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex ">
                                        <Button size="md" className="flex items-center gap-2" onClick={openGroup} >
                                            <PlusIcon />
                                            <span>{t('add_group')}</span>
                                        </Button>
                                    </div>
                                    <InputError message={getErrors.selectable_group} />
                                </div>
                            )
                        }
                    </div>
                </div>
                {/* Price setting */}
                <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                    <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('price_setting')}</div>
                    </div>
                    <div className="py-5 flex flex-col gap-5">
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('settings')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div>
                                <Radio.Group 
                                    value={data.price_setting}
                                    onChange={(e) => setData('price_setting', e.target.value)}
                                    options={[
                                        { label: t('follow_sum_of_item_price'), value: 'sum_item'},
                                        { label: t('customize_base_price'), value: 'customize'}
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('total_base_price')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div className="w-full">
                                <InputNumber 
                                    prefix='RM '
                                    value={data.base_price ?? 0}
                                    min={0.00}
                                    step="0.01"
                                    onChange={(value) => setData('base_price', value)}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    placeholder='1'
                                    className="w-full max-w-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={isAddItemOpen}
                onClose={closeAddItem}
                title={t('select_an_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={closeAddItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={confirm} >
                            {t('confirm')}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col">
                    <div className="px-5 pb-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
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

            <SelectableGroup data={data} setData={setData} isSelectableGrpOpen={isSelectableGrpOpen} setIsSelectableGrpOpen={setIsSelectableGrpOpen} closeGroup={closeGroup} />
        </>
    )
}
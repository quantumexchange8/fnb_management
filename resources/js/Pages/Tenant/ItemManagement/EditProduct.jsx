import { PlusIcon } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { useForm } from "@inertiajs/react";
import { InputNumber, Popconfirm, Radio, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditMealModifierGroup from "./Partials/EditMealModifierGroup";
import Button from "@/Components/Button";
import { Editor } from "primereact/editor";
import toast from "react-hot-toast";

export default function EditProduct({ product }) {
    
    const { t, i18n } = useTranslation();
    const [getCategory, setGetCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    
    const fetchCategories = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getCategories');

            setGetCategory(response.data.data);
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        id: '',
        item_code: '',
        name: '',
        category_id: null,
        new_category: null,
        category_name: '',
        visibility: 'display',
        category_color: '#1677ff',
        category_visibility: 'display',
        category_description: '',
        sale_price: '',
        modifier_group: null,
        product_image: null,
        description: '',
        deleted_modifier_group: null,
    });

    useEffect(() => {
        if (product) {
            setData({
                id: product.id,
                item_code: product.item_code,
                name: product.name,
                category_id: product.category_id,
                sale_price: product.prices,
                visibility: product.visibility,
                description: product.description,
            })
            
            if (product.modifier_groups && product.modifier_groups.length > 0) {
                setData('modifier_group', product.modifier_groups)
            }
        }
    }, [product])

    const openAddCategory = () => {
        setIsCategoryOpen(true)
    }
    const closeAddCategory = () => {
        setIsCategoryOpen(false)
    }

    const handleImageChange = (info) => {
        setUploading(true);

        const file = info.file;

        setFileList([file]);
        setData('product_image', file); // `image` key matches your form field
        
        setTimeout(() => {
            setUploading(false);
        }, 600);
    }
    const handleImageRemove = () => {
        setFileList([]);
        setData('product_image', null);
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

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.update-product'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('product_created_success')}`, {
                    title: `${t('product_created_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

    const confirmReset = () => {
        if (product) {
            setData({
                item_code: product.item_code,
                name: product.name,
                category_id: product.category_id,
                sale_price: product.prices,
                visibility: product.visibility,
                description: product.description,
            })
            
            if (product.modifier_groups && product.modifier_groups.length > 0) {
                setData('modifier_group', product.modifier_groups)
            }

            toast.success(`${t('resetted')}`, {
                title: `${t('resetted')}`,
                duration: 3000,
                variant: 'variant3',
            });
        }
    }
    const cancelReset = () => {

    }

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="text-neutral-900 text-xxl font-bold">{t('edit_meal_item')} - {product.item_code}</div>
                        <div className="text-neutral-500 text-sm font-medium">{t('creaft_perfect_meal_item')}</div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        {/* Meal Item Details */}
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="text-neutral-900 text-lg font-bold">{t('meal_item_detail')}</div>
                                <div className="text-neutral-300 text-xs">{t('general_detail_about_this_meal')}</div>
                            </div>
                            <div className="py-5 flex flex-col gap-5">
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('item_code')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <TextInput 
                                            type='text'
                                            value={data.item_code}
                                            className="w-full max-w-[328px]"
                                            onChange={(e) => setData('item_code', e.target.value)}
                                            placeholder={t('eg_p01')}
                                        />
                                        <InputError message={errors.item_code} />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('item_name')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <TextInput 
                                            type='text'
                                            value={data.name}
                                            className="w-full max-w-[328px]"
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('eg_signature_pork')}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('category')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <Select 
                                            value={data.category_id}
                                            onChange={(value) => setData('category_id', value)}
                                            options={[
                                                ...getCategory.map((item) => ({
                                                    label: (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full" style={{ background: item.color }}></div>
                                                            <span className="text-sm text-neutral-900">{item.name}</span>
                                                        </div>
                                                    ),
                                                    value: item.id
                                                }))
                                            ]}
                                            popupRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <div className="w-full py-3 px-4 flex items-center gap-2 sticky bottom-0 hover:bg-neutral-50 cursor-pointer rounded-xl" onClick={openAddCategory}>
                                                        <PlusIcon className='text-neutral-400 w-5 h-5' />
                                                        <span className="text-neutral-400 font-medium text-sm">Create New Category</span>
                                                    </div>
                                                </>
                                            )}
                                            className="w-full max-w-[328px]"
                                        />
                                        <InputError message={errors.category_id} />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('sale_price')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <InputNumber 
                                            prefix='RM '
                                            value={data.sale_price}
                                            min='0.01'
                                            step="0.01"
                                            onChange={(value) => setData('sale_price', value)}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            placeholder='12.90'
                                            className="w-full max-w-[328px]"
                                        />
                                        <InputError message={errors.sale_price} />
                                    </div>
                                </div>
                                <div className="px-5 py-2.5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('visibility')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
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
                            </div>
                        </div>

                        {/* Modifier group */}
                        <EditMealModifierGroup data={data} setData={setData} isDirty={isDirty} />

                        {/* Image */}
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="text-neutral-900 text-lg font-bold">{t('image')}</div>
                                <div className="text-neutral-300 text-xs">{t('supported_format_&_size')}</div>
                            </div>
                            <div className="p-5 flex flex-col gap-5">
                                <Upload
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={handleImageChange}
                                    onRemove={handleImageRemove}
                                    maxCount={1}
                                >
                                    <Button size="md" className="flex items-center gap-2" >
                                        <PlusIcon />
                                        <span>{t('upload')}</span>
                                    </Button>
                                </Upload>
                                <InputError message={errors.product_image} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="text-neutral-900 text-lg font-bold">{t('description')}</div>
                                <div className="text-neutral-300 text-xs">{t('for_internal_use_only')}</div>
                            </div>
                            <Editor
                                value={data.description} 
                                onTextChange={(e) => setData('description', e.htmlValue)} 
                                style={{ height: '280px', borderRadius: '0px 0px 8px 8px', border: '0px solid' }} 
                                headerTemplate={header}
                                placeholder={t('enter_here_optional')}
                            />
                        </div>

                    </div>
                </div>

                {/* sticky bar */}
                <div className="sticky bottom-0 w-full px-4">
                    <div className="w-full py-4 px-5 bg-white flex items-center justify-between border-t border-[#d0471833] shadow-footer">
                        <Popconfirm
                            title="Cancel Editing?"
                            description="All edited data will reset."
                            onConfirm={confirmReset}
                            onCancel={cancelReset}
                        >
                            <div>
                                <Button size="md" variant="white">
                                    {t('cancel')}
                                </Button>
                            </div>
                        </Popconfirm>
                        
                        <Button size="md" onClick={submit} disabled={isLoading} >
                            {t('save_changes')}
                        </Button>
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
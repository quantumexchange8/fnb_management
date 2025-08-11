import Button from "@/Components/Button";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { useForm } from "@inertiajs/react";
import { ColorPicker, Radio, Select, theme } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from 'primereact/editor';
import toast from "react-hot-toast";

export default function CreateCategory() {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        name: '',
        visibility: 'display',
        category_color: '',
        description: '',
    });

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
                    {/* <select className="ql-color" defaultValue="">
                        <option value="black"></option>
                        <option value="red"></option>
                        <option value="green"></option>
                        <option value="blue"></option>
                        <option value="orange"></option>
                        <option value="violet"></option>
                        <option value="#d0d1d2"></option>
                        <option value="" />
                    </select> */}
                    {/* <select className="ql-background" defaultValue="">
                        <option value="black"></option>
                        <option value="red"></option>
                        <option value="green"></option>
                        <option value="blue"></option>
                        <option value="orange"></option>
                        <option value="violet"></option>
                    </select> */}
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
                {/* <span className="ql-formats">
                    <button className="ql-clean" />
                </span> */}
            </>
        )
        
    }

    const header = renderHeader();

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.store-category'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('category_created_success')}`, {
                    title: `${t('category_created_success2')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
            }
        })
    }
    
    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="text-neutral-900 text-xxl font-bold">{t('create_category')}</div>
                        <div className="text-neutral-500 text-sm font-medium">{t('add_a_new_category')}</div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                                <div className="text-neutral-900 text-lg font-bold">{t('category_detail')}</div>
                                <div className="text-neutral-300 text-xs">{t('general_details_about_category')}</div>
                            </div>
                            <div className="py-5 flex flex-col gap-5">
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('category_type')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
                                        <Select 
                                            allowClear
                                            placeholder="Please select"
                                            value={data.type}
                                            onChange={(value) => setData('type', value)}
                                            options={[
                                                { label: 'Meal', value: 'single'},
                                                { label: 'Set Meal', value: 'set'},
                                            ]}
                                            className="w-full max-w-[328px]"
                                        />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('category_name')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
                                        <TextInput 
                                            type='text'
                                            value={data.name}
                                            className="w-full max-w-[328px]"
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('eg_enter_category_name')}
                                        />
                                    </div>
                                </div>
                                <div className="px-5 flex items-center gap-5">
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
                                <div className="px-5 flex items-center gap-5">
                                    <div className="max-w-40 w-full flex items-center gap-1">
                                        <span className="text-neutral-900 text-sm font-medium">{t('category_colour')}</span>
                                        <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
                                        <ColorPicker 
                                            presets={presets}
                                            value={data.category_color || '#1677ff'}
                                            onChange={handleColorChange}
                                            className="rounded-full custom-color-picker"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                            <div className="py-3 px-5 flex items-center justify-between ">
                                <div className="text-neutral-900 text-lg font-bold">{t('description')}</div>
                                <div className="text-neutral-300 text-xs">{t('for_internal_use_only')}</div>
                            </div>
                            <div>
                                <Editor 
                                    value={data.description} 
                                    onTextChange={(e) => setData('description', e.htmlValue)} 
                                    style={{ height: '280px', borderRadius: '0px 0px 8px 8px', border: '0px solid' }} 
                                    headerTemplate={header}
                                />
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
        </TenantAuthenicatedLayout>
    )
}
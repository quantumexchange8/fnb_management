import Button from "@/Components/Button";
import { PlusIcon, UploadIcon } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { ColorPicker, InputNumber, Radio, Select, Upload } from "antd";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function GeneralDetails({ data, setData, errors, getErrors }) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getCategory, setGetCategory] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categoryType, setCategoryType] = useState('set');

    const fetchCategories = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getCategories', {
                params: {categoryType}
            });

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
        setData('set_image', file); // `image` key matches your form field
        
        setTimeout(() => {
            setUploading(false);
        }, 600);
    }
    const handleImageRemove = () => {
        setFileList([]);
        setData('set_image', null);
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

    const createCategory = () => {
        const newId = Date.now(); // or generate uuid if needed
        
        const newCategory = {
            id: newId,
            name: data.category_name,
            category_visibility: data.category_visibility,
            color: data.category_color,  // Note: changed from category_color to color to match your options mapping
            description: data.category_description,
        };
        
        // Add the new category to getCategory state
        setGetCategory([...getCategory, newCategory]);
        
        // Set the new_category data and select it
        setData({
            ...data,
            new_category: [newCategory],
            category_id: newId
        });
        
        // Close the modal
        closeAddCategory();
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

    const handleColorChange = (color) => {
        setData('category_color', color.toHexString());
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                    <div className="text-neutral-900 text-lg font-bold">{t('set_detail')}</div>
                    <div className="text-neutral-300 text-xs">{t('general_detail_about_this_set_meal')}</div>
                </div>
                <div className="py-5 flex flex-col gap-5">
                    <div className="px-5 flex items-center gap-5">
                        <div className="max-w-40 w-full flex items-center gap-1">
                            <span className="text-neutral-900 text-sm font-medium">{t('set_code ')}</span>
                            <span className="text-error-500 text-xs font-medium">*</span>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <TextInput 
                                type='text'
                                value={data.set_code}
                                className="w-full max-w-[328px]"
                                onChange={(e) => setData('set_code', e.target.value)}
                                placeholder={t('eg_set0001')}
                            />
                            <InputError message={getErrors.set_code} />
                        </div>
                    </div>
                    <div className="px-5 flex items-center gap-5">
                        <div className="max-w-40 w-full flex items-center gap-1">
                            <span className="text-neutral-900 text-sm font-medium">{t('set_name ')}</span>
                            <span className="text-error-500 text-xs font-medium">*</span>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <TextInput 
                                type='text'
                                value={data.set_name}
                                className="w-full max-w-[328px]"
                                onChange={(e) => setData('set_name', e.target.value)}
                                placeholder={t('eg_set0001')}
                            />
                            <InputError message={getErrors.set_name} />
                        </div>
                    </div>
                    <div className="px-5 flex items-center gap-5">
                        <div className="max-w-40 w-full flex items-center gap-1">
                            <span className="text-neutral-900 text-sm font-medium">{t('no_of_pax ')}</span>
                            <span className="text-error-500 text-xs font-medium">*</span>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <InputNumber 
                                suffix=' pax'
                                value={data.no_of_pax}
                                min='1'
                                step="1"
                                onChange={(value) => setData('no_of_pax', value)}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                placeholder='2'
                                className="w-full max-w-[328px]"
                            />
                            <InputError message={getErrors.no_of_pax} />
                        </div>
                    </div>
                    <div className="px-5 flex items-center gap-5">
                        <div className="max-w-40 w-full flex items-center gap-1">
                            <span className="text-neutral-900 text-sm font-medium">{t('category ')}</span>
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
                            <InputError message={getErrors.category_id} />
                        </div>
                    </div>
                </div>
            </div>
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
                    >
                        <Button size="md" className="flex items-center gap-2" >
                            <UploadIcon />
                            <span>{t('upload')}</span>
                        </Button>
                    </Upload>
                    <InputError message={getErrors.set_image} />
                </div>
            </div>
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

            <Modal
                show={isCategoryOpen}
                onClose={closeAddCategory}
                title={t('create_new_category')}
                maxWidth='lg'
                maxHeight='lg'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="sm" onClick={closeAddCategory}>
                            {t('cancel')}
                        </Button>
                        <Button size="sm" onClick={createCategory}>
                            {t('create')}
                        </Button>
                    </div>
                }
            >
                <div className="p-5 flex flex-col gap-6">
                    <div className="w-full flex items-center gap-6">
                        <div className="flex flex-col gap-3 w-full">
                            <InputLabel value={t('category_name')} />
                            <TextInput 
                                type='text'
                                value={data.category_name}
                                className="w-full max-w-[328px]"
                                onChange={(e) => setData('category_name', e.target.value)}
                                placeholder={t('eg_enter_category_name')}
                            />
                            <InputError message={errors.category_name} />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <InputLabel value={t('visibility')} />
                            <Radio.Group 
                                value={data.category_visibility}
                                onChange={(e) => setData('category_visibility', e.target.value)}
                                options={[
                                    { label: t('display'), value: 'display' },
                                    { label: t('hidden'), value: 'hidden' }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-6">
                        <div className="flex flex-col gap-3">
                            <InputLabel value={t('category_colour')} />
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
                    <div className="flex flex-col gap-3 w-full">
                        <InputLabel value={t('description')} />
                        <Editor
                            value={data.category_description} 
                            onTextChange={(e) => setData('category_description', e.htmlValue)} 
                            style={{ height: '280px', borderRadius: '0px 0px 8px 8px', border: '0px solid' }} 
                            headerTemplate={header}
                            placeholder={t('enter_here_optional')}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
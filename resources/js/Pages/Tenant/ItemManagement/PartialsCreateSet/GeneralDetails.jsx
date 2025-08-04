import Button from "@/Components/Button";
import { PlusIcon, UploadIcon } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { InputNumber, Select, Upload } from "antd";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function GeneralDetails({ data, setData, errors }) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getCategory, setGetCategory] = useState([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
                            <InputError message={errors.set_code} />
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
                                value={data.set_code}
                                className="w-full max-w-[328px]"
                                onChange={(e) => setData('set_code', e.target.value)}
                                placeholder={t('eg_set0001')}
                            />
                            <InputError message={errors.set_code} />
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
                                value={data.pax}
                                min='1'
                                step="1"
                                onChange={(value) => setData('pax', value)}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                placeholder='2'
                                className="w-full max-w-[328px]"
                            />
                            <InputError message={errors.set_code} />
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
                            <InputError message={errors.set_code} />
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
                    <InputError message={errors.product_image} />
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
        </div>
    )
}
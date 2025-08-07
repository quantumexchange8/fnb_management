import Button from "@/Components/Button";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { InputNumber } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function CreateModifierItem({
    isCreateModifierOpen,
    setIsCreateModifierOpen,
    closeCreateModifierItem,
    fetchModifierItem,
}) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        modifier_name: '',
        price: 0.00,
    }); 

    const cancelModifierItem = () => {
        reset();
        closeCreateModifierItem();
    }

    const createItem = (e) => {
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
                cancelModifierItem();
                fetchModifierItem();

            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

    return (
        <>
            <Modal
                show={isCreateModifierOpen}
                onClose={cancelModifierItem}
                title={t('create_modifier_item')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="md" onClick={cancelModifierItem}>
                            {t('cancel')}
                        </Button>
                        <Button size="md" onClick={createItem}>
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
                            value={data.price ?? 0.00}
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
        </>
    )
}
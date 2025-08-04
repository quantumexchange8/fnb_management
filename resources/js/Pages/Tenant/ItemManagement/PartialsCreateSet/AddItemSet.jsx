import Button from "@/Components/Button";
import { PlusIcon } from "@/Components/Icon/Outline";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AddItemSet({ data, setData, errors }) {

    const { t, i18n } = useTranslation();


    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                    <div className="text-neutral-900 text-lg font-bold">{t('set_detail')}</div>
                    <div className="text-neutral-300 text-xs">{t('general_detail_about_this_set_meal')}</div>
                </div>
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex">
                        <Button size="md" className="flex items-center gap-2" >
                            <PlusIcon />
                            <span>{t('add_item')}</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
    )
}
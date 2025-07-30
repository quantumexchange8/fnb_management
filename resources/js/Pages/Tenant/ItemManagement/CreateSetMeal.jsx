import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateSetMeal() {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="w-full flex flex-col">
                        <div className="text-neutral-900 text-xxl font-bold">{t('create_set_meal')}</div>
                        <div className="text-neutral-500 text-sm font-medium">{t('creaft_perfect_meal_bundle')}</div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Stepper */}
                        <div className="flex items-center gap-4">

                        </div>
                        
                        {/* content */}
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
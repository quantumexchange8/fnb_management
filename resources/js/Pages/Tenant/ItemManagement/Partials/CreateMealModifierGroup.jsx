import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateMealModifierGroup({ data, setData }) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getModifier, setGetModifier] = useState([]);

    const fetchModifier = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getModifier');

            setGetModifier(response.data.data);
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModifier();
    }, []);
    
    return (
        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                <div className="text-neutral-900 text-lg font-bold">{t('modifier_group')}</div>
                <div className="text-neutral-300 text-xs">{t('allow_meal_customization')}</div>
            </div>
            <div className="grid grid-cols-3 w-full">
                {
                    data.modifier_group.length > 0 ? (
                        <>

                        </>
                    ) : (
                        <>

                        </>
                    )
                }
            </div>
        </div>
    )
}
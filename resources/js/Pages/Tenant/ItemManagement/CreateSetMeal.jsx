import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GeneralDetails from "./PartialsCreateSet/GeneralDetails";
import AddItemSet from "./PartialsCreateSet/AddItemSet";
import AvailabilityInventory from "./PartialsCreateSet/AvailabilityInventory";
import Button from "@/Components/Button";
import { NextIcon, PreviousIcon } from "@/Components/Icon/Outline";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import axios from "axios";

export default function CreateSetMeal() {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [getErrors, setGetErrors] = useState([]);

    const next = async () => {

        try {
            const payload = {
                ...data,
                step: step,
            };

            // Validate current step via backend
            await axios.post(route('items-management.validate-set-meals'), payload);

            // If validation passes, move to next step
            setGetErrors([]);
            setStep(step + 1);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Laravel validation errors
                setGetErrors(error.response.data.errors)
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }
    const prev = () => {
        const prev = step - 1;
        setStep(prev)
    }

    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        set_code: '',
        set_name: '',
        no_of_pax: '',
        category_id: '',
        set_image: null,
        description: '',

        // Add item to this set
        fixed_item: null,
        selectable_group: null,
        price_setting: 'sum_item',
        base_price: 0.00,

        // availability
        branch: [],
        available_day: 'all-day',
        specify_day: [],
        available_time: 'all-time',
        specify_start_time: '',
        specify_end_time: '',
        stock_alert: 'enable',
        low_stock: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('items-management.store-set-meals'), {
            onSuccess: () => {
                setIsLoading(false);
                toast.success(`${t('set_meal_created_success')}`, {
                    title: `${t('set_meal_created_success')}`,
                    duration: 3000,
                    variant: 'variant3',
                });
                reset();
                setStep(1);
                
            },
            onError: () => {
                setIsLoading(false);
            }
        })
    }

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
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-primary-500 rounded-full text-neutral-25 text-xs font-bold text-center"> 
                                    <div className="w-[14px]">1</div>
                                </div>
                                <div className="text-neutral-900 text-base font-bold">{t('general_detail')}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`${step === 2 || step === 3 ? 'bg-primary-500 text-neutral-25' : 'bg-neutral-50 text-neutral-200'} p-1 rounded-full text-xs font-bold text-center`}> 
                                    <div className="w-[14px]">2</div>
                                </div>
                                <div className={`${step === 2 || step === 3 ? 'text-neutral-900' : 'text-neutral-200'}  text-base `}>{t('add_item_to_this_set')}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`${step === 3 ? 'bg-primary-500 text-neutral-25' : 'bg-neutral-50 text-neutral-200'} p-1 rounded-full text-xs font-bold text-center`}> 
                                    <div className="w-[14px]">3</div>
                                </div>
                                <div className={`${step === 3 ? 'text-neutral-900' : 'text-neutral-200'}  text-base `}>{t('availability_&_inventory')}</div>
                            </div>
                        </div>
                        
                        {/* content */}
                        {
                            step === 1 && (
                                <GeneralDetails data={data} setData={setData} errors={errors} getErrors={getErrors} />
                            )
                        }
                        {
                            step === 2 && (
                                <AddItemSet data={data} setData={setData} errors={errors} getErrors={getErrors} />
                            )
                        }
                        {
                            step === 3 && (
                                <AvailabilityInventory data={data} setData={setData} errors={errors} getErrors={getErrors} />
                            )
                        }
                    </div>
                </div>

                {/* sticky bar */}
                <div className="sticky bottom-0 w-full px-4">
                    <div className="w-full py-4 px-5 bg-white flex items-center justify-between border-t border-[#d0471833] shadow-footer">
                        <Button size="md" variant="white">
                            {t('cancel')}
                        </Button>
                        {
                            step === 1  && (
                                <Button size="md" onClick={next} disabled={isLoading} className="flex items-center gap-2" >
                                    <span>{t('next')}</span>
                                    <NextIcon />
                                </Button>
                            )
                        }
                        {
                            step === 2 && (
                                <div className="flex items-center gap-3">
                                    <Button size="md" variant="white" onClick={prev} className="flex items-center gap-2">
                                        <PreviousIcon />
                                        <span>{t('previous')}</span>
                                    </Button>
                                    <Button size="md" onClick={next} className="flex items-center gap-2">
                                        <span>{t('next')}</span>
                                        <NextIcon />
                                    </Button>
                                </div>
                            )
                        }
                        {
                            step === 3 && (
                                <div className="flex items-center gap-3">
                                    <Button size="md" variant="white" onClick={prev} className="flex items-center gap-2">
                                        <PreviousIcon />
                                        <span>{t('previous')}</span>
                                    </Button>
                                    <Button size="md" onClick={submit}>{t('create_now')}</Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
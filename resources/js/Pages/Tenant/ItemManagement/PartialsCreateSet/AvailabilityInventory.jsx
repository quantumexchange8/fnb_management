import TextInput from "@/Components/TextInput";
import { Label } from "@headlessui/react";
import { Radio, Select, TimePicker } from "antd";
import { defaultConfig } from "antd/es/theme/context";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AvailabilityInventory({
    data,
    setData,
    errors,
}) {

    const daysOption = [
        { label: 'Monday', value: 'monday'},
        { label: 'Tuesday', value: 'tuesday'},
        { label: 'Wednesday', value: 'wednesday'},
        { label: 'Thursday', value: 'thursday'},
        { label: 'Friday', value: 'friday'},
        { label: 'Saturday', value: 'saturday'},
        { label: 'Sunday', value: 'sunday'},
    ]

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getBranch, setGetBranch] = useState([]);

    const fetchBranch = async () => {
        setIsLoading(true);

         try {
            const response = await axios.get('/getBranch');

            setGetBranch(response.data);
            
        } catch (error) {
            console.error('Error Fetching Branch: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBranch();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* Availability */}
                <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                    <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('availability')}</div>
                        <div className="text-neutral-300 text-xs italic">{t('define_the_availability_of_this_set_meal ')}</div>
                    </div>
                    <div className="py-5 flex flex-col gap-5">
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('branch')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div className="w-full">
                                <Select 
                                    mode="multiple"
                                    allowClear
                                    placeholder="Please select"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    value={data.branch}
                                    onChange={(value) => setData('branch', value)}
                                    options={getBranch.map(item => ({
                                        label: item.name,
                                        value: item.id,
                                    }))}
                                    className="w-full max-w-80 custom-select"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('available_day')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div>
                                <Radio.Group 
                                    value={data.available_day}
                                    onChange={(e) => setData('available_day', e.target.value)}
                                    options={[
                                        { label: t('all_day'), value: 'all-day'},
                                        { label: t('specific_day_only'), value: 'specific-day'}
                                    ]}
                                />
                            </div>
                        </div>
                        {
                            data.available_day === 'specific-day' && (
                                <div className="flex items-center gap-5 px-5">
                                    <div className="w-full max-w-40">
                                        <span className="text-neutral-900 text-sm font-medium">{t('specify_days')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="w-full">
                                        <Select 
                                            mode="multiple"
                                            maxTagCount='responsive'
                                            allowClear
                                            placeholder="Please select"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            value={data.specify_day}
                                            onChange={(value) => setData('specify_day', value)}
                                            options={daysOption}
                                            className="w-full max-w-80 custom-select"
                                        />
                                    </div>
                                </div>
                            )
                        }
                        
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('available_time')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div>
                                <Radio.Group 
                                    value={data.available_time}
                                    onChange={(e) => setData('available_time', e.target.value)}
                                    options={[
                                        { label: t('all_time'), value: 'all-time'},
                                        { label: t('specific_time_only'), value: 'specific-time'}
                                    ]}
                                />
                            </div>
                        </div>
                        {
                            data.available_time === 'specific-time' && (
                                <div className="flex items-center gap-5 px-5">
                                    <div className="w-full max-w-40">
                                        <span className="text-neutral-900 text-sm font-medium">{t('specify_time')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full ">
                                        <TimePicker 
                                            format='HH:mm'
                                            value={data.specify_start_time}
                                            onChange={(time) => setData('specify_start_time', time)}
                                            className="py-3 px-4 text-sm leading-4 rounded-xl box-border h-11 shadow-input"
                                        />
                                        <div className="bg-neutral-100 w-6 h-[1px]"></div>
                                        <TimePicker 
                                            format='HH:mm'
                                            value={data.specify_end_time}
                                            onChange={(time) => setData('specify_end_time', time)}
                                            className="py-3 px-4 text-sm leading-4 rounded-xl box-border h-11 shadow-input"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Inventory */}
                {/* <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
                    <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                        <div className="text-neutral-900 text-lg font-bold">{t('inventory')}</div>
                    </div>
                    <div className="py-5 flex flex-col gap-5">
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('stock_alert')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div className="w-full py-2.5">
                                <Radio.Group 
                                    value={data.stock_alert}
                                    onChange={(e) => setData('stock_alert', e.target.value)}
                                    options={[
                                        { label: t('enable'), value: 'enable'},
                                        { label: t('disable'), value: 'disable'}
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-5 px-5">
                            <div className="w-full max-w-40">
                                <span className="text-neutral-900 text-sm font-medium">{t('low_stock_threshold')}</span> <span className="text-error-500 text-xs font-medium">*</span>
                            </div>
                            <div className="w-full py-2.5">
                                <TextInput 
                                    type="number"
                                    name="low_stock"
                                    value={data.low_stock}
                                    onChange={(e) => setData('low_stock', e.target.value)}
                                    className='w-full max-w-80'
                                    placeholder={t('e.g._20')}
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}
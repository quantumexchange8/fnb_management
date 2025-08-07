import Button from "@/Components/Button";
import { ExportIcon, HiddenIcon, PlusIcon, SearchIcon, XIcon, XIcon2 } from "@/Components/Icon/Outline";
import TextInput from "@/Components/TextInput";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Link } from "@inertiajs/react";
import { Pagination, Spin, Switch } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function SetMealListing() {

    const { t, i18n } = useTranslation();
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [getMeal, setGetMeal] = useState([]);
    const [switchLoading, setswitchLoading] = useState(false);
    const [updateQueue, setUpdateQueue] = useState({});
    const [switchStates, setSwitchStates] = useState({});
    const [searchFilter, setSearchFilter] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchSetMeal = async (page = 1) => {
        setIsProductLoading(true);

        try {

            const response = await axios.get('/items-management/getSetMeal', {
                params: { page }
            });

            setGetMeal(response.data.data);
            setPagination({
                current: response.data.current_page,
                total: response.data.total,
                last_page: response.data.last_page
            });
            
        } catch (error) {
            console.error('Error Fetching products: ', error)
        } finally {
            setIsProductLoading(false);
        }
    }

    useEffect(() => {
        fetchSetMeal(page);
    }, [page]);

    const handleSwitchChange = (id, checked) => {

        const originalVisibility = getMeal.find(item => item.id === id)?.visibility === 'display';

         if (checked === originalVisibility) {
            // 如果是切换回原始状态，直接更新 UI，不发送请求
            setSwitchStates(prev => ({
                ...prev,
                [id]: checked
            }));
            
            // 清除可能存在的待更新计时器
            setUpdateQueue(prev => {
                const newQueue = {...prev};
                if (newQueue[id]) {
                    clearTimeout(newQueue[id].timer);
                    delete newQueue[id];
                }
                return newQueue;
            });
            
            return; // 直接返回，不执行后续代码
        }

        // 如果不是切换回原始状态，继续原有逻辑
        setSwitchStates(prev => ({
            ...prev,
            [id]: checked
        }));

        // 设置或重置 3 秒计时器
        setUpdateQueue(prev => {
            if (prev[id]) {
                clearTimeout(prev[id].timer);
            }
            
            const timer = setTimeout(() => {
                updateVisibility(id, checked);
                setUpdateQueue(prev => {
                    const newQueue = {...prev};
                    delete newQueue[id];
                    return newQueue;
                });
            }, 3000);
            
            return {
                ...prev,
                [id]: {
                    checked,
                    timer
                }
            };
        });
    }

    const updateVisibility = async (id, visibility) => {
        try {
            setswitchLoading(true);
           
            const response = await axios.post('/items-management/updateMealVisibility', {
                id: id,
                visibility: visibility ? 'display' : 'hidden'
            });

            toast.success(`${t('visibility_updated')}`, {
                title: `${t('visibility_updated')}`,
                duration: 3000,
                variant: 'variant1',
            });

            fetchSetMeal(page);

        } catch (error) {
            
            // 如果失败，回滚状态
            setSwitchStates(prev => ({
                ...prev,
                [id]: !visibility
            }));
        } finally {
            setswitchLoading(false);
        }
    };

    const filterData = getMeal.filter((meal) =>
        meal.set_name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const clearFilter = () => {
        setSearchFilter('');
    }

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between w-full">
                        <div className="w-full flex flex-col">
                            <div className="text-neutral-900 text-xxl font-bold">{t('set_meal_list')}</div>
                            <div className="text-neutral-500 text-sm font-medium">{t('last_product_created_on')}: </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="white" size="md" className="flex items-center gap-2" >
                                <ExportIcon />
                                <span>{t('export')}</span>
                            </Button>
                            <Link href={route('items-management.create-set-meal')}>
                                <Button size="md" className="flex items-center gap-2" >
                                    <PlusIcon />
                                    <span>{t('create_set_meal')}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="w-full flex items-center gap-2">
                        <div className="flex gap-3 items-center max-w-96 w-full">
                            {
                                !isSearching ? (
                                    <div
                                        className="p-3 w-11 h-11 rounded-full bg-white border border-neutral-200 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out"
                                        onClick={() => {
                                            if (searchFilter) {
                                                clearFilter();
                                            } else {
                                                setIsSearching(true);
                                            }
                                        }}
                                    >
                                        {
                                            searchFilter ? <XIcon2 /> : <SearchIcon />
                                        }
                                    </div>
                                ) : (
                                    <TextInput 
                                        type='text'
                                        className={`border border-neutral-300 rounded-lg p-2 transition-all duration-300 ease-in-out ${
                                            isSearching ? "w-48" : "w-0 opacity-0"
                                        }`}
                                        autoFocus
                                        onBlur={() => setIsSearching(false)}
                                        value={searchFilter} 
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                    />
                                )
                            }
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5">
                        {
                            isProductLoading ? (
                                <div className="flex items-center justify-center min-h-[60vh] bg-neutral-50 rounded-xl">
                                    <Spin size="large" >
                                        <div className="h-[80px]" />
                                    </Spin>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 pb-5">
                                    {
                                        filterData.length > 0 ? (
                                            <>
                                                {
                                                    filterData.map((meal, i) => {
                                                        const checked = switchStates.hasOwnProperty(meal.id) 
                                                                    ? switchStates[meal.id]
                                                                    : meal.visibility === 'display';

                                                        return (
                                                            <div key={i} className="p-4 flex flex-col gap-4 rounded-xl bg-white border border-neutral-50 shadow-sec-voucher cursor-pointer">
                                                                <div className='py-10 px-4 relative bg-neutral-50 rounded-xl'>
                                                                    <img src='' alt="" className="max-w-[180px] h-[140px] " />
                                                                    {meal.visibility === 'hidden' && (
                                                                        <div className="absolute inset-0 z-10 bg-gradient-hidden rounded-xl flex flex-col items-center justify-center gap-3">
                                                                            <div><HiddenIcon /></div>
                                                                            <div className="text-primary-300 text-sm font-bold text-center">
                                                                                This item has been hidden
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col gap-3">
                                                                    <div className="text-neutral-800 text-base font-bold text-wrap h-[50px]">{meal.set_code} - {meal.set_name}</div>
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="text-neutral-700 font-medium text-base">RM {meal.base_price}</div>
                                                                        <div>
                                                                            <Switch 
                                                                                value={checked}
                                                                                onChange={(checked) => handleSwitchChange(meal.id, checked)}
                                                                                loading={switchLoading && updateQueue[meal.id]?.checked === checked}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </>
                                        ) : (
                                            <div>

                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        
                    </div>

                    <Pagination 
                        current={pagination.current} 
                        total={pagination.total} 
                        pageSize={12} 
                        align="center"
                        onChange={(newPage) => {
                            setPage(newPage); // update your state
                            fetchSetMeal(newPage); // refetch data
                        }}
                        showSizeChanger={false}
                        showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`}
                        disabled={switchLoading}
                    />
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
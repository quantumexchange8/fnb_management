import Button from "@/Components/Button";
import { ExportIcon, HiddenIcon, PlusIcon } from "@/Components/Icon/Outline";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Link } from "@inertiajs/react";
import { Pagination, Skeleton, Spin, Switch } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function ProductList() {

    const { t, i18n } = useTranslation();
    const [getProduct, setGetProduct] = useState([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [getCategory, setGetCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [switchStates, setSwitchStates] = useState({});
    const [updateQueue, setUpdateQueue] = useState({});
    const [switchLoading, setswitchLoading] = useState(false);

    const fetchCategories = async () => {
        setIsCategoryLoading(true);

        try {
            const res = await axios.get('/items-management/getCategories');
            setGetCategory([{ id: 'all', name: 'All' }, ...res.data.data]);

        } catch (err) {
            console.error(err);
        } finally {
            setIsCategoryLoading(false)
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async (category_id = 'all', page = 1) => {
        setIsProductLoading(true);

        try {

            const response = await axios.get('/items-management/getProducts', {
                params: { category_id, page }
            });

            setGetProduct(response.data.data);
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
        fetchProducts(selectedCategory, page);
    }, [selectedCategory, page]);

    const handleSwitchChange = (id, checked) => {

        const originalVisibility = getProduct.find(item => item.id === id)?.visibility === 'display';

        // 检查是否是切换回原始状态
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
    };

    const updateVisibility = async (id, visibility) => {
        try {
            setswitchLoading(true);
           
            const response = await axios.post('/items-management/updateProductVisibility', {
                id: id,
                visibility: visibility ? 'display' : 'hidden'
            });

            toast.success(`${t('visibility_updated')}`, {
                title: `${t('visibility_updated')}`,
                duration: 3000,
                variant: 'variant1',
            });

            fetchProducts(selectedCategory, page);

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

    const editProduct = (product) => {
        window.location.href = `/items-management/edit-product/${product.item_code}`
    }

    return (
        <TenantAuthenicatedLayout>
            <div className="flex flex-col w-full">
                <div className="py-2 px-4 flex flex-col gap-5 w-full min-h-screen">
                    {/* Header */}
                    <div className="flex justify-between w-full">
                        <div className="w-full flex flex-col">
                            <div className="text-neutral-900 text-xxl font-bold">{t('product_list')}</div>
                            <div className="text-neutral-500 text-sm font-medium">{t('last_product_created_on')}: </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="white" size="md" className="flex items-center gap-2" >
                                <ExportIcon />
                                <span>{t('export')}</span>
                            </Button>
                            <Link href={route('items-management.create-product')}>
                                <Button size="md" className="flex items-center gap-2" >
                                    <PlusIcon />
                                    <span>{t('create_product')}</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-5">
                        {/* Category */}
                        {
                            isCategoryLoading ? (
                                <>
                                    <Skeleton.Button active block={true} />
                                </>
                            ) : (
                                <div className="flex items-center gap-3 flex-nowrap overflow-x-auto bg-neutral-25 sticky top-[74px] z-20">
                                    {
                                        getCategory.length > 0 && getCategory.map((category) => (
                                            <div
                                                key={category.id}
                                                onClick={() => {
                                                    setSelectedCategory(category.id); // 🔁 switch to `category.id`
                                                    setPage(1); // optional: reset to page 1 on new category
                                                }}
                                                className={`cursor-pointer whitespace-nowrap py-3 px-4 rounded-xl
                                                    ${selectedCategory === category.id ? 'bg-primary-500 border border-primary-400' : 'bg-neutral-50'}`}
                                            >
                                                <span className={`${selectedCategory === category.id ? 'text-white' : 'text-neutral-700'} text-sm font-bold`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }

                        {/* Product */}
                        {
                            isProductLoading ? (
                                <div className="flex items-center justify-center min-h-[60vh] bg-neutral-50 rounded-xl">
                                    <Spin size="large" >
                                        <div className="h-[80px]" />
                                    </Spin>
                                </div>
                            ) : (
                                <div>
                                    {
                                        getProduct.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 pb-5">
                                                    {
                                                        getProduct.map((product, index) => {
                                                            const checked = switchStates.hasOwnProperty(product.id) 
                                                            ? switchStates[product.id]
                                                            : product.visibility === 'display';


                                                            return (
                                                                <div key={index} className="p-4 flex flex-col gap-4 rounded-xl bg-white border border-neutral-50 shadow-sec-voucher cursor-pointer" onClick={() => editProduct(product)} >
                                                                    <div className='py-10 px-4 relative bg-neutral-50 rounded-xl'>
                                                                        {
                                                                            product.product_image ? (
                                                                                <img src={product.product_image} alt="" className="max-w-[180px] h-[140px] " />
                                                                            ) : (
                                                                                <div className="max-w-[180px] h-[140px] flex justify-center items-center font-bold text-xs">{product.item_code}</div>
                                                                            )
                                                                        }
                                                                        
                                                                        {product.visibility === 'hidden' && (
                                                                            <div className="absolute inset-0 z-10 bg-gradient-hidden rounded-xl flex flex-col items-center justify-center gap-3">
                                                                                <div><HiddenIcon /></div>
                                                                                <div className="text-primary-300 text-sm font-bold text-center">
                                                                                    This item has been hidden
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        
                                                                    </div>
                                                                    <div className="flex flex-col gap-3">
                                                                        <div className="text-neutral-800 text-base font-bold text-wrap h-[50px]">{product.item_code} - {product.name}</div>
                                                                        <div className="flex justify-between items-center">
                                                                            <div className="text-neutral-700 font-medium text-base">RM {product.prices}</div>
                                                                            <div>
                                                                                <Switch 
                                                                                    value={checked}
                                                                                    onChange={(checked) => handleSwitchChange(product.id, checked)}
                                                                                    loading={switchLoading && updateQueue[product.id]?.checked === checked}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                No Product found
                                            </>
                                        )
                                    }
                                </div>
                            )
                        }
                        <Pagination 
                            current={pagination.current} 
                            total={pagination.total} 
                            pageSize={12} 
                            align="center"
                            onChange={(newPage) => {
                                setPage(newPage); // update your state
                                // fetchProducts(selectedCategory, newPage); // refetch data
                            }}
                            showSizeChanger={false}
                            showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`}
                            disabled={switchLoading}
                        />
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
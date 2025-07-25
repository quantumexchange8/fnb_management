import Button from "@/Components/Button";
import { ExportIcon, PlusIcon } from "@/Components/Icon/Outline";
import TenantAuthenicatedLayout from "@/Layouts/TenantAuthenicatedLayout";
import { Skeleton, Switch } from "antd";
import React, { useEffect, useState } from "react";
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
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsProductLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts(selectedCategory, page);
    }, [selectedCategory, page]);


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
                            <Button size="md" className="flex items-center gap-2" >
                                <PlusIcon />
                                <span>{t('create_product')}</span>
                            </Button>
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
                                <div className="flex items-center gap-3 flex-nowrap overflow-x-auto">
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
                                <div className="flex items-center justify-center">

                                </div>
                            ) : (
                                <div>
                                    {
                                        getProduct.length > 0 ? (
                                            <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                                                {
                                                    getProduct.map((product, index) => (
                                                        <div key={index} className="p-4 flex flex-col gap-4 rounded-xl bg-white border border-neutral-50 shadow-sec-voucher">
                                                            <div className="py-10 px-4">
                                                                <img src="" alt="" className="max-w-[180px] " />
                                                            </div>
                                                            <div className="flex flex-col gap-3">
                                                                <div className="text-neutral-800 text-base font-bold text-wrap">{product.item_code} - {product.name}</div>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="text-neutral-700 font-medium text-base">RM {product.prices}</div>
                                                                    <div>
                                                                        <Switch 
                                                                            onChange={(checked) => checked}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            <>
                                                No Product found
                                            </>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </TenantAuthenicatedLayout>
    )
}
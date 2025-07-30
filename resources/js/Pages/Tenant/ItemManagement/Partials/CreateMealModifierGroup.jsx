import Button from "@/Components/Button";
import ConfirmDialog from "@/Components/ConfirmDialog";
import { PlusIcon, SearchIcon, XIcon } from "@/Components/Icon/Outline";
import NoModifier from "@/Components/Illustration/NoModifier";
import Modal from "@/Components/Modal";
import SearchInput from "@/Components/SearchInput";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateMealModifierGroup({ data, setData, isDirty }) {

    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [getModifier, setGetModifier] = useState([]);
    const [isModifierOpen, setIsModifierOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [openConfirmLeaveDialog, setOpenConfirmLeaveDialog] = useState(false);
    
    const fetchModifier = async () => {
        setIsLoading(true);

        try {

            const response = await axios.get('/items-management/getModifier');

            setGetModifier(response.data);
            
        } catch (error) {
            console.error('Error Fetching categories: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchModifier();
    }, []);

    const openAddModifier = () => {
        setIsModifierOpen(true)
    }
    const closeAddModifier = () => {
        setIsModifierOpen(false)
    }

    const clearFilter = () => {
        setSearchFilter('');
    }

    const directCreateModifier = () => {
        window.location.href = `/items-management/create-modifier-group`
    }

    const confirmStay = () => {
        setOpenConfirmLeaveDialog(false);
        setIsModifierOpen(false);
    }
    const confirmLeave = () => {
        directCreateModifier();
    }

    const confirm = () => {
        
    }
    
    return (
        <div className="bg-white border border-neutral-100 shadow-sec-voucher rounded-lg flex flex-col">
            <div className="py-3 px-5 flex items-center justify-between border-b border-neutral-50">
                <div className="text-neutral-900 text-lg font-bold">{t('modifier_group')}</div>
                <div className="text-neutral-300 text-xs">{t('allow_meal_customization')}</div>
            </div>
            {
                data.modifier_group.length > 0 ? (
                    <div className="grid grid-cols-3 w-full p-5 "> 
                
                    </div>  
                ) : (
                    <div className="p-5 ">
                        <Button size="md" className="flex items-center gap-2" onClick={openAddModifier} >
                            <PlusIcon />
                            <span>{t('add_group')}</span>
                        </Button>
                    </div>
                )
            }
            


            <Modal
                show={isModifierOpen}
                onClose={closeAddModifier}
                title={t('select_modifier')}
                maxWidth='sm'
                maxHeight='sm'
                footer={
                    <div className="w-full flex items-center justify-end gap-3 py-4 px-5">
                        <Button variant="white" size="sm" onClick={closeAddModifier}>
                            {t('cancel')}
                        </Button>
                        <Button size="sm" onClick={confirm} disabled={getModifier && getModifier.length === 0} >
                            {t('create')}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col">
                    {/* Search Filter */}
                    <div className="px-5 pb-4 border-b border-neutral-100">
                        <SearchInput 
                            withIcon
                            IconComponent={searchFilter ? null : SearchIcon}
                            placeholder='Search'
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            dataValue={searchFilter != ''}
                            clearfunc={
                                <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 cursor-pointer" onClick={clearFilter}>
                                    <XIcon className="w-4 h-4" />
                                </div>
                            }
                        />
                    </div>
                    {
                        getModifier && getModifier.length > 0 ? (
                            <div>

                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 min-h-[50vh] py-5">
                                <div className="flex flex-col gap-2">
                                    <NoModifier />
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-neutral-800 text-xl font-bold">{t('oops')}!</div>
                                        <div className="text-neutral-500 text-base">{t('no_modifier_yet_create_one')}</div>
                                    </div>
                                </div>
                                <Button size="md"  
                                     onClick={() => {
                                        if (isDirty) {
                                            setOpenConfirmLeaveDialog(true);
                                        } else {
                                            directCreateModifier(); // <- don't forget to call it
                                        }
                                    }}
                                >
                                    {t('go_to_create')}
                                </Button>
                            </div>
                        )
                    }
                    
                </div>
            </Modal>

            <ConfirmDialog show={openConfirmLeaveDialog} >
                <div className="flex flex-col">
                    <div className="p-5 flex flex-col items-start gap-5">
                        <div className="text-lg font-bold text-gray-950 text-center">{t('you_are_leaving_this_page')}...</div>
                        <div className="text-neutral-900 text-base">
                            {t('any_change_you_made_wont_be_saved')}?
                        </div>
                    </div>
                     <div className="flex justify-end gap-4 py-4 px-5">
                        <Button variant="white" size="md" onClick={confirmStay}>{t('stay')}</Button>
                        <Button size="md" variant="red" onClick={confirmLeave}>{t('leave')}</Button>
                    </div>
                </div>
                
            </ConfirmDialog>
        </div>
    )
}
import {
    CloseButton,
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { XIcon } from './Icon/Outline';

export default function Modal({
    children,
    show = false,
    maxWidth = 'md',
    maxHeight = 'md',
    closeable = true,
    onClose = () => {},
    title,
    footer,
    showFooter = 'flex',
}) {
    const close = () => {
        if (!closeable) {
            return;
        }
        onClose();
    };

    const maxWidthClass = {
        sm: 'min-w-[300px] max-w-[400px] lg:min-w-[360px] lg:max-w-[480px] xl:min-w-[400px] xl:max-w-[600px]',
        md: 'min-w-[450px] max-w-[600px] lg:min-w-[500px] lg:max-w-[600px] xl:min-w-[600px] xl:max-w-[600px]',
        lg: 'min-w-[600px] max-w-[720px] lg:min-w-[720px] lg:max-w-[800px] xl:min-w-[800px] xl:max-w-[960px]',
        // xl: 'sm:w-full md:min-w-full lg:min-w-[1024px] xl:min-w-[1140px]',
    }[maxWidth];

    const maxHeightClass = {
        sm: 'min-h-[70vh] max-h-[85vh] lg:min-h-[60vh] lg:max-h-[80vh] xl:min-h-[60vh] xl:max-h-[80vh]',
        md: 'min-h-[75vh] max-h-[90vh] lg:min-h-[70vh] lg:max-h-[80vh] xl:min-h-[70vh] xl:max-h-[80vh]',
        lg: 'min-h-[75vh] max-h-[90vh] lg:min-h-[70vh] lg:max-h-[85vh] xl:min-h-[70vh] xl:max-h-[80vh]',
        // xl: 'sm:h-full max-h-screen md:h-full lg:min-h-auto xl:min-h-[700px]',
    }[maxHeight];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={() => {}}
                static
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`flex flex-col transform overflow-hidden rounded-lg shadow-dialog bg-white transition-all sm:mx-auto sm:w-full ${maxWidthClass} ${maxHeightClass}`}
                    >
                        <DialogTitle className='w-full flex justify-between items-center py-4 px-6'>
                            <div className='text-gray-950 text-lg font-semibold'>{title}</div>
                            <CloseButton onClick={close}>
                                <XIcon />
                            </CloseButton>
                        </DialogTitle>
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                        <div className={` w-full border-t border-neutral-50 shadow-sm bg-white ${showFooter}`}>
                            {footer}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

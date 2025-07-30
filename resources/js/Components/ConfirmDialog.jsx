import {
    CloseButton,
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function ConfirmDialog({
    children,
    show = false,
    maxWidth = 'sm',
    closeable = true,
    onClose = () => {},
    title,
    footer,
    showFooter,
}) {
    const close = () => {
        if (!closeable) {
            return;
        }
        onClose();
    };

    const maxWidthClass = {
        sm: 'w-[400px]',
    }[maxWidth];

    const maxHeightClass = {
        sm: 'h-auto',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center transform overflow-y-auto px-4 py-6 transition-all sm:px-0"
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
                        className={`flex flex-col transform overflow-hidden rounded-lg shadow-dialog bg-white transition-all sm:mx-auto ${maxWidthClass} ${maxHeightClass}`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}

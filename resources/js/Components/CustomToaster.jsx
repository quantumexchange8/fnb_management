import React from "react";
import { Transition } from "@headlessui/react";
import { toast, Toaster, resolveValue } from 'react-hot-toast';
import { ToastSuccessIcon, ToastErrorIcon, ToastInfoIcon, ToastWarningIcon } from "@/Components/Icon/Outline";
import Button from "@/Components/Button";

const CustomToaster = ({ t }) => {
  return (
    <Toaster position="top-right">
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className={getClassNames(t)}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 translate-x-10"
          enterTo="opacity-100 translate-x-0"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-10"
        >
          <div className="flex gap-3">
            <div className="flex ">
              <div className="flex items-center justify-center rounded-full bg-[#ffffff0d]">
                {getIcon(t)}
              </div>
            </div>
            {
                t.variant === 'variant3' ? (
                  <div className="w-full flex items-center">
                    <p className="font-bold text-neutral-900 text-sm">{resolveValue(t.title)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold leading-tight">{resolveValue(t.title)}</span>
                      {t.variant !== 'variant3' && <p className="w-full text-neutral-900 text-xs">{resolveValue(t.description)}</p>}
                    </div>
                  </div>
                )
              }
          </div>
        </Transition>
      )}
    </Toaster>
  );
};

const getClassNames = (toast) => {
  const baseClass = "transform p-4 rounded-lg shadow-xl flex gap-3 w-[336px]";
  switch (toast.type) {
    case 'success':
      return baseClass + " bg-success-100 border-[0.5px] border-success-300 ";
    case 'error':
      if (toast.variant === 'warning') {
        // Customize appearance for warning toast
        return baseClass + " bg-white"; // Example: yellow background for warning
      }
      return baseClass + " bg-error-100 border-[0.5px] border-error-300 ";
    default:
      return baseClass;
  }
};

const getIcon = (toast) => {
  switch (toast.type) {
    case 'success':
      return <ToastSuccessIcon/>;
    case 'error':
      return <ToastErrorIcon />;
    case 'info':
      return <ToastInfoIcon />;
    case 'warning':
      return <ToastWarningIcon />;
    default:
      return null;
  }
};

export { CustomToaster };

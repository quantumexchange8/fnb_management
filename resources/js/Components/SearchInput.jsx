import { forwardRef, useEffect, useRef } from 'react';
import { XIcon } from './Icon/Outline';

export default forwardRef(function SearchInput({ type = 'text', className = '', isFocused = false, IconComponent = null, dataValue = '', clearfunc = null, hasError, placeholder, withIcon = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused || hasError) {
            input.current.focus();
        }
    }, [isFocused, hasError]); // 添加 hasError 作为依赖

    return (
        <div className="relative w-full">
            <input
                {...props}
                type={type}
                className={
                    `bg-white hover:bg-white disabled:bg-gray-100 border hover:border-neutral-700 focus:border-primary-500 py-3 px-4 text-neutral-900 text-sm rounded-xl shadow-input caret-primary-500 w-full
                    ${withIcon ? 'pr-11' : ''}
                    ${hasError ? 'border border-error-500 focus:ring-0 focus:outline-none focus:border-error-500 w-full' : ' focus:border-primary-50 focus:ring-[#EDF8FF] border-neutral-100 hover:border-gray-200 '}
                    ` + className
                }
                ref={input}
                placeholder={placeholder}
            />

            {(withIcon || dataValue) && (
                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                    {withIcon && IconComponent && (
                        <IconComponent className="w-4 h-4 text-gray-500" />
                    )}
                    {dataValue && clearfunc}
                </div>
            )}
        </div>
    );
});

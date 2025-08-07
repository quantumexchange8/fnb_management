import { Link } from '@inertiajs/react'

export default ({
    type = 'submit',
    className = '',
    processing,
    children,
    href,
    target,
    external,
    variant = 'primary',
    size = 'base',
    iconOnly,
    squared = false,
    pill = false,
    srText,
    onClick,
    disabled,
}) => {
    const baseClasses = `inline-flex items-center transition-colors font-bold text-center select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`

    let variantClasses = ``

    switch (variant) {
        case 'secondary':
            variantClasses = `bg-transparent text-primary-500 font-bold border border-primary-500 hover:border-primary-600 disabled:border-primary-300 disabled:text-primary-300`
            break
        case 'gray':
            variantClasses = `bg-neutral-800 text-white hover:bg-neutral-700 disabled:bg-neutral-300 disabled:text-neutral-200`
            break
        case 'black':
            variantClasses = `bg-black text-white hover:bg-neutral-800 disabled:bg-black disabled:text-neutral-500`
            break
        case 'white':
            variantClasses = `bg-white text-neutral-900 border border-neutral-200 shadow-input hover:bg-neutral-100 disabled:text-neutral-200 disabled:bg-white`
            break
        case 'green':
            variantClasses = `bg-success-500 text-white hover:border hover:border-success-500 hover:text-success-500 hover:bg-black disabled:text-success-400 disabled:border-0 disabled:bg-success-500`
            break
        case 'red':
            variantClasses = `bg-error-500 text-white hover:border hover:border-error-500 hover:text-error-500 hover:bg-black disabled:text-error-400 disabled:border-0 disabled:bg-error-500`
            break
        case 'red-outline':
            variantClasses = `bg-transparent text-error-500 hover:border hover:border-error-700 hover:text-error-700 disabled:text-error-300 disabled:border disabled:border-error-300 `
            break
        case 'red-secondary':
            variantClasses = `bg-error-100 text-error-500 hover:bg-error-200 hover:text-error-700 disabled:bg-error-50 disabled:text-error-200 `
            break
        case 'textOnly':
            variantClasses = `bg-transparent text-primary-500 hover:text-primary-500 hover:no-underline disabled:text-primary-200 disabled:bg-transparent disabled:no-underline`
            break
        default:
            variantClasses = `bg-primary-500 text-white text-sm hover:bg-primary-600 hover:border hover:border-primary-600 hover:text-primary-100 disabled:text-primary-100 disabled:bg-primary-200 rounded-xl`
    }

    const sizeClasses = `${
        size == 'sm' ? (iconOnly ? 'p-1.5' : 'px-3 py-2 text-sm font-bold') : ''
    } ${
        size == 'md' ? (iconOnly ? 'p-3' : 'px-4 py-3 text-sm font-bold') : ''
    } ${
        size == 'lg' ? (iconOnly ? 'p-2' : 'p-4 text-base font-bold') : ''
    }`

    const roundedClasses = `${!squared && !pill ? 'rounded-xl' : ''} ${
        pill ? 'rounded-full' : ''
    }`

    const iconSizeClasses = `${size == 'sm' ? 'w-5 h-5' : ''} ${
        size == 'base' ? 'w-6 h-6' : ''
    } ${size == 'lg' ? 'w-7 h-7' : ''}`

    if (href) {
        const Tag = external ? 'a' : Link

        return (
            <Tag
                target={target}
                href={href}
                className={`${baseClasses} ${sizeClasses} ${variantClasses} ${roundedClasses} ${className} ${
                    processing ? 'pointer-events-none opacity-50' : ''
                }`}
                disabled={disabled}
            >
                {children}
                {iconOnly && <span className="sr-only">{srText ?? ''}</span>}
            </Tag>
        )
    }

    return (
        <button
            type={type}
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${roundedClasses} ${className}`}
            disabled={processing || disabled}
            onClick={onClick}
        >
            {children}
            {iconOnly && <span className="sr-only">{srText ?? ''}</span>}
        </button>
    )
}
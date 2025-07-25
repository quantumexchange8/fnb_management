export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-medium text-neutral-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}

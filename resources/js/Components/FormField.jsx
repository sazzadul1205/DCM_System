// Components/FormField.jsx

// React
import { useState } from 'react';

// Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function FormField({
  // Input Props
  id,
  name,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  autoFocus = false,
  required = false,
  disabled = false,
  readOnly = false,

  // Label Props
  label,
  hideLabel = false,
  labelClassName = '',

  // Icon Props
  icon: Icon,
  iconPosition = 'left',

  // Error Props
  error,
  hideError = false,
  errorClassName = '',

  // Styling Props
  className = '',
  inputClassName = '',
  variant = 'default', // default, filled, outlined

  // Events
  onChange,
  onBlur,
  onFocus,

  // Additional Props
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // Variant styles
  const variantStyles = {
    default: {
      container: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700',
      focus: 'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20',
    },
    filled: {
      container: 'border border-transparent bg-gray-100 dark:bg-gray-800',
      focus: 'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-gray-700 dark:focus-within:border-blue-400',
    },
    outlined: {
      container: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
      focus: 'focus-within:border-blue-500 dark:focus-within:border-blue-400',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {!hideLabel && label && (
        <label
          htmlFor={id}
          className={`mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200${disabled ? 'opacity-50' : ''}${isFocused ? 'text-blue-600 dark:text-blue-400' : ''}${labelClassName}`}
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500 dark:text-red-400">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div
        className={` relative flex w-full items-center rounded-lg transition-all duration-200 ${currentVariant.container} ${isFocused ? currentVariant.focus : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${error ? 'border-red-500 dark:border-red-400' : ''}`}
      >
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute left-0 flex items-center pl-3">
            <Icon
              className={`h-5 w-5 ${error ? 'text-red-400 dark:text-red-500' : isFocused ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} transition-colors duration-200`}
            />
          </div>
        )}

        {/* Input Field */}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          className={` w-full rounded-lg bg-transparent py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'} ${(Icon && iconPosition === 'right') || isPassword ? 'pr-10' : 'pr-3'} ${inputClassName}`}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 flex items-center pr-3"
            tabIndex={-1}
            disabled={disabled}
          >
            {showPassword ? (
              <FaEyeSlash
                className={`h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200`}
              />
            ) : (
              <FaEye
                className={`h-5 w-5text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200`}
              />
            )}
          </button>
        ) : Icon && iconPosition === 'right' ? (
          <div className="pointer-events-none absolute right-0 flex items-center pr-3">
            <Icon
              className={`h-5 w-5 ${error ? 'text-red-400 dark:text-red-500' : isFocused ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} transition-colors duration-200`}
            />
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {!hideError && error && (
        <div
          className={`mt-2 flex items-center text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-2 duration-200 ${errorClassName}`}
        >
          <svg
            className="mr-1.5 h-4 w-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
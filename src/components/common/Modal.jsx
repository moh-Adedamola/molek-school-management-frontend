"use client"

/**
 * Reusable form field component
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.name - Field name
 * @param {string} props.type - Input type
 * @param {string} props.value - Field value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether field is disabled
 */
const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
  disabled = false,
  className = "",
  ...props
}) => {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 border rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? "bg-gray-100" : ""}`}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        )
      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 border rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? "bg-gray-100" : ""}`}
            disabled={disabled}
            {...props}
          >
            {props.children}
          </select>
        )
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full p-2 border rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? "bg-gray-100" : ""}`}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        )
    }
  }

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default FormField

/**
 * Reusable card component
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Optional action buttons
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({ title, children, actions, className = "", icon: Icon }) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            {Icon && <Icon size={20} className="mr-2 text-blue-600" />}
            {title}
          </h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export default Card

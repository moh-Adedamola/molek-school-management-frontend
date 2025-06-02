import React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

/**
 * Page header component with title, breadcrumbs, and optional actions
 *
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {Array} props.breadcrumbs - Array of breadcrumb items
 * @param {React.ReactNode} props.actions - Optional action buttons
 */
const PageHeader = ({ title, breadcrumbs = [], actions }) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-2">
          <ol className="flex items-center space-x-1 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={14} className="mx-1" />}
                {crumb.link ? (
                  <li>
                    <Link to={crumb.link} className="hover:text-blue-600">
                      {crumb.label}
                    </Link>
                  </li>
                ) : (
                  <li className="text-gray-700 font-medium">{crumb.label}</li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}

      {/* Header with title and actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader

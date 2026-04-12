
import React from "react";
import { Edit, Trash2, MapPin, Calendar, DollarSign, Users, Eye, IndianRupee } from "lucide-react";

function VacancyCard({ vacancy, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    // Map backend status to display status and colors
    const normalizedStatus = status === 'ACTIVE' ? 'Open' : 
                             status === 'INACTIVE' ? 'Closed' : 
                             status === 'ON_HOLD' ? 'On Hold' : status;
    
    switch (normalizedStatus) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisplayStatus = (status) => {
    return status === 'ACTIVE' ? 'Open' : 
           status === 'INACTIVE' ? 'Closed' : 
           status === 'ON_HOLD' ? 'On Hold' : status;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              vacancy.status
            )}`}
          >
            {getDisplayStatus(vacancy.status)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(vacancy)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(vacancy.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {vacancy.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{vacancy.department}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {vacancy.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Deadline: {vacancy.applicationDeadLine ? new Date(vacancy.applicationDeadLine).toLocaleDateString() : "N/A"}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <IndianRupee className="h-4 w-4 mr-2" />
            {vacancy.minSalary && vacancy.maxSalary ? 
              `${vacancy.minSalary.toLocaleString()} - ${vacancy.maxSalary.toLocaleString()}` :
              vacancy.minSalary ? `${vacancy.minSalary.toLocaleString()}+` :
              'Salary not disclosed'
            }
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {vacancy.numberOfVacancies || 1} position{(vacancy.numberOfVacancies || 1) > 1 ? 's' : ''}
          </div>
          <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default VacancyCard;

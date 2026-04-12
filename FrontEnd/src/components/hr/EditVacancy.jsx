
import React, { useState } from "react";

function EditVacancyModal({ vacancy, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: vacancy.title || '',
    department: vacancy.department || '',
    location: vacancy.location || '',
    type: vacancy.employementType === 'FULL_TIME' ? 'Full-time' : 
          vacancy.employementType === 'PART_TIME' ? 'Part-time' : 
          vacancy.employementType === 'CONTRACT' ? 'Contract' : 
          vacancy.employementType === 'INTERNSHIP' ? 'Internship' : 'Full-time',
    description: vacancy.description || '',
    responsibilities: vacancy.reponsibilites || '', // Note: matches backend spelling
    salary: vacancy.minSalary ? vacancy.minSalary.toString() : '',
    deadline: vacancy.applicationDeadline || '',
    status: vacancy.status || 'ACTIVE',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVacancy = {
      ...vacancy,
      title: formData.title,
      department: formData.department,
      location: formData.location,
      employementType: formData.type.toUpperCase().replace('-', '_'), // Convert to enum format
      description: formData.description,
      jobDescription: formData.description, // Duplicate for entity mapping
      reponsibilites: formData.responsibilities, // Note: matches backend spelling
      minSalary: parseInt(formData.salary),
      maxSalary: Math.round(parseInt(formData.salary) * 1.2), // Set max as 20% higher
      applicationDeadline: formData.deadline,
      status: formData.status,
      numberOfVacencies: vacancy.numberOfVacencies || 1,
      requiredEducation: vacancy.requiredEducation || "Bachelor's degree",
      requiredExperience: vacancy.requiredExperience || "2+ years",
      shiftDetails: vacancy.shiftDetails || "Day shift"
    };
    onSave(updatedVacancy);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-xl">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Vacancy
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Department & Location */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities (one per line)
              </label>
              <textarea
                required
                rows={3}
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Salary & Deadline */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offered Salary (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Application Deadline
                </label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditVacancyModal;

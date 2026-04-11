import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Search } from "lucide-react";
import { getAllVacancies, createVacancy, updateVacancy, deleteVacancy } from "../../services/hr";
import VacancyCard from "./VacancyCard";
import CreateVacancyModal from "./CreateVacancy";
import EditVacancyModal from "./EditVacancy";

function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load vacancies on component mount
  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getAllVacancies();
      
      if (result.success) {
        setVacancies(result.data);
      } else {
        setError(result.error || 'Failed to load vacancies');
      }
    } catch (err) {
      console.error('Error loading vacancies:', err);
      setError('Failed to load vacancies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVacancy = async (vacancyData) => {
    try {
      setError('');
      const result = await createVacancy(vacancyData);
      
      if (result.success) {
        await loadVacancies(); // Reload to get updated list
        setShowCreateModal(false);
        toast.success('Vacancy created successfully!');
      } else {
        setError(result.error || 'Failed to create vacancy');
      }
    } catch (err) {
      console.error('Error creating vacancy:', err);
      setError('Failed to create vacancy');
    }
  };

  const handleUpdateVacancy = async (updatedVacancy) => {
    try {
      setError('');
      const result = await updateVacancy(updatedVacancy.id, updatedVacancy);
      
      if (result.success) {
        await loadVacancies(); // Reload to get updated list
        setSelectedVacancy(null);
        toast.success('Vacancy updated successfully!');
      } else {
        setError(result.error || 'Failed to update vacancy');
      }
    } catch (err) {
      console.error('Error updating vacancy:', err);
      setError('Failed to update vacancy');
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacancy?')) {
      return;
    }

    try {
      setError('');
      const result = await deleteVacancy(id);
      
      if (result.success) {
        await loadVacancies(); // Reload to get updated list
        toast.success('Vacancy deleted successfully!');
      } else {
        setError(result.error || 'Failed to delete vacancy');
      }
    } catch (err) {
      console.error('Error deleting vacancy:', err);
      setError('Failed to delete vacancy');
    }
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const title = vacancy.title ? vacancy.title.toLowerCase() : "";
    const department = vacancy.department ? vacancy.department.toLowerCase() : "";
    const location = vacancy.location ? vacancy.location.toLowerCase() : "";
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());
    
    // Map backend status to frontend filter
    const vacancyStatus = vacancy.status === 'ACTIVE' ? 'Open' : 
                         vacancy.status === 'INACTIVE' ? 'Closed' : 
                         vacancy.status === 'ON_HOLD' ? 'On Hold' : vacancy.status;
    
    const matchesFilter = filterStatus === "All" || vacancyStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading vacancies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vacancies</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage job openings and track application progress. ({vacancies.length} total)
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Vacancy
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search vacancies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Vacancies Grid */}
      <div className="mt-6">
        {filteredVacancies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm || filterStatus !== "All" ? 
                'No vacancies found matching your criteria' : 
                'No vacancies available'
              }
            </div>
            {searchTerm || filterStatus !== "All" ? (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear filters to see all vacancies
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Vacancy
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredVacancies.map((vacancy, index) => (
              <VacancyCard
                key={vacancy.id || `vacancy-${index}`}
                vacancy={vacancy}
                onEdit={(v) => setSelectedVacancy(v)}
                onDelete={handleDeleteVacancy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Vacancy Modal */}
      {showCreateModal && (
        <CreateVacancyModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateVacancy}
        />
      )}
      
      {/* Edit Vacancy Modal */}
      {selectedVacancy && (
        <EditVacancyModal
          vacancy={selectedVacancy}
          onClose={() => setSelectedVacancy(null)}
          onSave={handleUpdateVacancy}
        />
      )}
    </div>
  );
}
export default Vacancies;

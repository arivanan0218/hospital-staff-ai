import React, { useState, useEffect } from 'react';
import { departmentsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentList = ({ onSelectDepartment }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_staff_required: 1,
    max_staff_capacity: 10
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentsAPI.getAll();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_staff_required' || name === 'max_staff_capacity' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentsAPI.create(formData);
      toast.success('Department created successfully');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        min_staff_required: 1,
        max_staff_capacity: 10
      });
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to create department');
      console.error(err);
    }
  };

  if (loading) return <div>Loading departments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Departments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Department'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-4">Add New Department</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Staff Required</label>
              <input
                type="number"
                name="min_staff_required"
                min="1"
                value={formData.min_staff_required}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Staff Capacity</label>
              <input
                type="number"
                name="max_staff_capacity"
                min="1"
                value={formData.max_staff_capacity}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Department
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {departments.map((dept) => (
            <li key={dept.id}>
              <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                      {dept.description && (
                        <p className="text-sm text-gray-500">{dept.description}</p>
                      )}
                      <div className="mt-1 text-sm text-gray-500">
                        <span>Staff: {dept.min_staff_required} - {dept.max_staff_capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => onSelectDepartment(dept)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View/Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
          {departments.length === 0 && !loading && (
            <li className="px-4 py-4 text-center text-gray-500">
              No departments found. Create one to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentList;

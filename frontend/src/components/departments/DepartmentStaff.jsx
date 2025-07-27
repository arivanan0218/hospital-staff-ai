import React, { useState, useEffect } from 'react';
import { departmentsAPI, staffAPI } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentStaff = ({ departmentId, onBack }) => {
  const [department, setDepartment] = useState(null);
  const [staff, setStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    if (departmentId) {
      fetchDepartment();
      fetchDepartmentStaff();
      fetchAllStaff();
    }
  }, [departmentId]);

  const fetchDepartment = async () => {
    try {
      const data = await departmentsAPI.getById(departmentId);
      setDepartment(data);
    } catch (err) {
      toast.error('Failed to fetch department details');
      console.error(err);
    }
  };

  const fetchDepartmentStaff = async () => {
    try {
      const data = await departmentsAPI.getStaff(departmentId);
      setStaff(data);
    } catch (err) {
      toast.error('Failed to fetch department staff');
      console.error(err);
    }
  };

  const fetchAllStaff = async () => {
    try {
      const data = await staffAPI.getAll();
      setAllStaff(data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch staff');
      console.error(err);
      setLoading(false);
    }
  };

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    try {
      setAssigning(true);
      // Update the staff member's department
      await staffAPI.update(selectedStaff, { department_id: departmentId });
      
      // Refresh the staff list
      await fetchDepartmentStaff();
      await fetchAllStaff();
      
      toast.success('Staff assigned to department successfully');
      setSelectedStaff('');
    } catch (err) {
      toast.error('Failed to assign staff to department');
      console.error(err);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to remove this staff member from the department?')) {
      try {
        // Set department_id to null to remove from department
        await staffAPI.update(staffId, { department_id: null });
        
        // Refresh the staff list
        await fetchDepartmentStaff();
        await fetchAllStaff();
        
        toast.success('Staff removed from department');
      } catch (err) {
        toast.error('Failed to remove staff from department');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!department) return <div>Department not found</div>;

  // Filter out staff already in this department
  const availableStaff = allStaff.filter(
    s => !staff.some(ds => ds.id === s.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Departments
        </button>
        <h2 className="text-xl font-semibold">{department.name} - Staff</h2>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4">Assign Staff</h3>
        <form onSubmit={handleAssignStaff} className="flex space-x-2">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2"
            disabled={availableStaff.length === 0 || assigning}
          >
            <option value="">Select staff to assign</option>
            {availableStaff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.role})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedStaff || assigning}
            className={`px-4 py-2 rounded ${
              !selectedStaff || assigning
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {staff.length > 0 ? (
            staff.map((member) => (
              <li key={member.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleRemoveStaff(member.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Remove from department"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-500">
              No staff members assigned to this department yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentStaff;

import React, { useState } from 'react';
import DepartmentList from './DepartmentList.jsx';
import DepartmentStaff from './DepartmentStaff.jsx';

const DepartmentManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Department Management</h1>
      
      {selectedDepartment ? (
        <DepartmentStaff 
          departmentId={selectedDepartment.id} 
          onBack={() => setSelectedDepartment(null)} 
        />
      ) : (
        <DepartmentList onSelectDepartment={setSelectedDepartment} />
      )}
    </div>
  );
};

export default DepartmentManagement;

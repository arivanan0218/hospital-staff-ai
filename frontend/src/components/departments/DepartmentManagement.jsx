import React, { useState } from 'react';
import DepartmentList from './DepartmentList.jsx';
import DepartmentStaff from './DepartmentStaff.jsx';

const DepartmentManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* <Typography variant="h4" gutterBottom>
        Department Management
      </Typography>
       */}
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

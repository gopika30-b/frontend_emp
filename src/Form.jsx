
      

import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    employeeID: '',
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    dateOfJoining: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const departments = ['HR', 'Engineering', 'Marketing', 'Finance'];

  const validate = () => {
    const tempErrors = {};

    if (!formData.employeeID) tempErrors.employeeID = 'Employee ID is required.';
    if (!formData.name) tempErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Valid email is required.';
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) tempErrors.phoneNumber = 'Valid phone number is required.';
    if (!formData.department) tempErrors.department = 'Department is required.';
    if (!formData.dateOfJoining || new Date(formData.dateOfJoining) > new Date()) tempErrors.dateOfJoining = 'Invalid date.';
    if (!formData.role) tempErrors.role = 'Role is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const backendURL = `http://localhost:5000`;
      const response = await axios.post(`${backendURL}/addEmployee`, formData);
      setMessage(response.data.message);
      setFormData({
        employeeID: '',
        name: '',
        email: '',
        phoneNumber: '',
        department: '',
        dateOfJoining: '',
        role: ''
      });
      setErrors({});
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleReset = () => {
    setFormData({
      employeeID: '',
      name: '',
      email: '',
      phoneNumber: '',
      department: '',
      dateOfJoining: '',
      role: ''
    });
    setErrors({});
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Employee ID</label>
        <input
          type="text"
          value={formData.employeeID}
          onChange={(e) => setFormData({ ...formData, employeeID: e.target.value })}
        />
        <p>{errors.employeeID}</p>
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <p>{errors.name}</p>
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <p>{errors.email}</p>
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <p>{errors.phoneNumber}</p>
      </div>
      <div>
        <label>Department</label>
        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <p>{errors.department}</p>
      </div>
      <div>
        <label>Date of Joining</label>
        <input
          type="date"
          value={formData.dateOfJoining}
          onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
        />
        <p>{errors.dateOfJoining}</p>
      </div>
      <div>
        <label>Role</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <p>{errors.role}</p>
      </div>
      <p className='message'>{message}</p>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export default Form;
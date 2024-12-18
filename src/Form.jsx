import React, { useState, useEffect } from 'react';
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
  const [existingData, setExistingData] = useState(null);
  const [debouncedEmployeeID, setDebouncedEmployeeID] = useState(formData.employeeID);
  const [debouncedEmail, setDebouncedEmail] = useState(formData.email);
  const departments = ['HR', 'Engineering', 'Marketing', 'Finance'];

  const validate = () => {
    const tempErrors = {};
    if (!formData.employeeID) tempErrors.employeeID = 'Employee ID is required.';
    if (!formData.name) tempErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email) || !formData.email.endsWith('@company.com')) {
      tempErrors.email = 'Valid email is required and must be from company.com.';
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) tempErrors.phoneNumber = 'Valid phone number is required.';
    if (!formData.department) tempErrors.department = 'Department is required.';
    if (!formData.dateOfJoining || new Date(formData.dateOfJoining) > new Date()) tempErrors.dateOfJoining = 'Invalid date.';
    if (!formData.role) tempErrors.role = 'Role is required.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const checkExistingData = async (empID, email) => {
    try {
      const backendURL = `https://backend-emp-6kc6.onrender.com`;
      const response = await axios.post(`${backendURL}/checkEmployee`, {
        employeeID: empID,
        email: email,
      });
      if (response.data.exists) {
        setExistingData(response.data.data);
      } else {
        setExistingData(null);
      }
    } catch (err) {
      window.alert('Error checking employee data.');
    }
  };

  useEffect(() => {
    if (debouncedEmployeeID || debouncedEmail) {
      checkExistingData(debouncedEmployeeID, debouncedEmail);
    }
  }, [debouncedEmployeeID, debouncedEmail]);
  const handleEmployeeIDChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, employeeID: value });
    setDebouncedEmployeeID(value);
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    setDebouncedEmail(value);
  };

  useEffect(() => {
    const employeeTimeoutId = setTimeout(() => {
      setDebouncedEmployeeID(formData.employeeID);
    }, 1000);

    const emailTimeoutId = setTimeout(() => {
      setDebouncedEmail(formData.email);
    }, 1000);

    return () => {
      clearTimeout(employeeTimeoutId);
      clearTimeout(emailTimeoutId);
    };
  }, [formData.employeeID, formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const backendURL = `https://backend-emp-6kc6.onrender.com`;
      const response = await axios.post(`${backendURL}/addEmployee`, formData);
      window.alert(response.data.message);

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
      setExistingData(null);
    } catch (err) {
      window.alert(err.response?.data?.message || 'Something went wrong.');
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
    setExistingData(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Employee ID</label>
        <input
          type="text"
          value={formData.employeeID}
          onChange={handleEmployeeIDChange}
        />
        {existingData && existingData.employeeID === formData.employeeID && (
          <p className="exists-message">Employee ID already exists. Please check.</p>
        )}
        <p>{errors.employeeID}</p>
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
        />
        {existingData && existingData.email === formData.email && (
          <p className="exists-message">Email ID already exists. Please check.</p>
        )}
        <p>{errors.email}</p>
      </div>
      {existingData && (
        <div className="existing-data">
          <h3>Existing Employee Data</h3>
          <p>Employee ID: {existingData.employeeID}</p>
          <p>Name: {existingData.name}</p>
          <p>Email: {existingData.email}</p>
          <p>Phone Number: {existingData.phoneNumber}</p>
          <p>Department: {existingData.department}</p>
          <p>Date of Joining: {existingData.dateOfJoining}</p>
          <p>Role: {existingData.role}</p>
        </div>
      )}
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

      <p className="message">{message}</p>
      <button type="submit">
        Submit
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export default Form;

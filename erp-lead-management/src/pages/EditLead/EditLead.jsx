import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById, createLead, updateLead } from '../../services/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { ArrowLeft, Save } from 'lucide-react';

const EditLead = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    courseInterested: '',
    leadSource: '',
    status: 'New',
    assignedEmployeeId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        try {
          const { data } = await getLeadById(id);
          setFormData(data);
        } catch (err) {
          setError('Failed to fetch lead details.');
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid Email is required';
    }

    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.assignedEmployeeId) newErrors.assignedEmployeeId = 'Employee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateLead(id, formData);
      } else {
        await createLead({
          ...formData,
          createdDate: new Date().toISOString().split('T')[0]
        });
      }
      navigate('/leads');
    } catch (err) {
      setError('Failed to save lead. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size={48} className="h-64" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Lead Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
            />
            
            <Input 
              label="Mobile Number *"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              placeholder="1234567890"
            />
            
            <Input 
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@example.com"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Employee *</label>
              <select
                name="assignedEmployeeId"
                value={formData.assignedEmployeeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm ${errors.assignedEmployeeId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Employee</option>
                <option value="1">Alice Johnson</option>
                <option value="2">Bob Williams</option>
              </select>
              {errors.assignedEmployeeId && <p className="mt-1 text-sm text-red-600">{errors.assignedEmployeeId}</p>}
            </div>

            <Input 
              label="Course Interested"
              name="courseInterested"
              value={formData.courseInterested}
              onChange={handleChange}
              placeholder="e.g. React Masterclass"
            />

            <Input 
              label="Lead Source"
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              placeholder="e.g. Website, Referral"
            />
          </div>
          
          <div className="md:col-span-2">
            <Input 
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex items-center">
              {submitting ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Lead</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads } from '../../services/api';
import Table from '../../components/Table/Table';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import { Edit, Eye, Plus } from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search, Filter, Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', assignedEmployeeId: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await getLeads();
      setLeads(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ status: '', assignedEmployeeId: '', startDate: '', endDate: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.mobile.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = filters.status ? lead.status === filters.status : true;
      const matchesEmployee = filters.assignedEmployeeId ? lead.assignedEmployeeId === filters.assignedEmployeeId : true;
      
      let matchesDate = true;
      if (filters.startDate && filters.endDate) {
        matchesDate = lead.createdDate >= filters.startDate && lead.createdDate <= filters.endDate;
      }
      
      return matchesSearch && matchesStatus && matchesEmployee && matchesDate;
    });
  }, [leads, searchTerm, filters]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentData = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    { header: 'Lead Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', render: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${row.status === 'New' ? 'bg-blue-100 text-blue-800' : 
            row.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 
            row.status === 'Qualified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      ) 
    },
    { header: 'Assigned To', render: (row) => row.assignedEmployeeId === '1' ? 'Alice Johnson' : 'Bob Williams' },
    { header: 'Created Date', accessor: 'createdDate' },
    { header: 'Actions', render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${row.id}`); }}
            className="text-primary hover:text-blue-900"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/leads/edit/${row.id}`); }}
            className="text-green-600 hover:text-green-900"
            title="Edit Lead"
          >
            <Edit size={18} />
          </button>
        </div>
      ) 
    },
  ];

  if (loading) return <Loader size={48} className="h-64" />;
  if (error) return <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button onClick={() => navigate('/leads/new')} className="flex items-center">
          <Plus size={18} className="mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <Search 
            value={searchTerm} 
            onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} 
            placeholder="Search by Name, Mobile, or Email..." 
          />
        </div>
      </div>

      <Filter filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />

      <Table columns={columns} data={currentData} onRowClick={(row) => navigate(`/leads/${row.id}`)} />
      
      {filteredLeads.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      )}
    </div>
  );
};

export default LeadList;

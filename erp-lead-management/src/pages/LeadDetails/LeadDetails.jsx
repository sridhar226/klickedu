import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById } from '../../services/api';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import Notes from '../../components/Notes/Notes';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Briefcase, Info, User } from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await getLeadById(id);
        setLead(data);
      } catch (err) {
        setError('Failed to load lead details. The lead might have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <Loader size={48} className="h-64" />;
  if (error) return <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg max-w-2xl mx-auto mt-8">{error}</div>;
  if (!lead) return <div className="text-center p-8">No Lead Found</div>;

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 text-gray-400 mr-3"><Icon size={18} /></div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/leads')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {lead.name}
              <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                  lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 
                  lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {lead.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Created on {new Date(lead.createdDate).toLocaleDateString()}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/leads/edit/${lead.id}`)} className="flex items-center">
          <Edit size={16} className="mr-2" />
          Edit Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Contact Info</h3>
            <DetailItem icon={Phone} label="Mobile" value={lead.mobile} />
            <DetailItem icon={Mail} label="Email" value={lead.email} />
            <DetailItem icon={MapPin} label="Address" value={lead.address} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Lead Details</h3>
            <DetailItem icon={Briefcase} label="Course Interested" value={lead.courseInterested} />
            <DetailItem icon={Info} label="Lead Source" value={lead.leadSource} />
            <DetailItem icon={User} label="Assigned Employee" value={lead.assignedEmployeeId === '1' ? 'Alice Johnson' : 'Bob Williams'} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Notes leadId={lead.id} />
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;

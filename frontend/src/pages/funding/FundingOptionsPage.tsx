import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FundingUtilityCard from '@/components/business/FundingUtilityCard';
import UtilityFormModal from '@/components/business/UtilityFormModal';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { FundingUtility } from '@/types';
import { Rocket, Plus, AlertCircle, CheckCircle2, DollarSign, Send, FileText } from 'lucide-react';

const FundingOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [utilities, setUtilities] = useState<FundingUtility[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUtility, setEditingUtility] = useState<FundingUtility | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(45);

  // Load mock data
  useEffect(() => {
    const mockBusiness = localStorage.getItem('mockBusiness');
    if (mockBusiness) {
      const business = JSON.parse(mockBusiness);
      setProfileCompletion(business.profile_completion_percent || 45);
    }

    // Mock utilities
    setUtilities([
      {
        id: 'util-1',
        business_id: 'biz-123',
        type: 'TERM_LOAN',
        status: 'DRAFT',
        requested_amount: 5000000,
        tenure_months: 60,
        purpose: 'Business expansion and new machinery purchase',
        security_type: 'Property',
        security_available: true,
        existing_emis: 25000,
        frequency: 'monthly',
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z',
      },
      {
        id: 'util-2',
        business_id: 'biz-123',
        type: 'WORKING_CAPITAL',
        status: 'SUBMITTED',
        requested_amount: 1000000,
        tenure_months: 12,
        purpose: 'Working capital for inventory management',
        frequency: 'monthly',
        security_available: false,
        existing_emis: 0,
        created_at: '2024-01-28T14:30:00Z',
        updated_at: '2024-02-03T09:15:00Z',
      },
    ]);
  }, []);

  const canAccessFunding = profileCompletion >= 70;

  const handleCreateUtility = async (data: Partial<FundingUtility>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUtility: FundingUtility = {
        ...data,
        id: `util-${Date.now()}`,
        business_id: 'biz-123',
        status: 'DRAFT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as FundingUtility;
      setUtilities([...utilities, newUtility]);
      setShowModal(false);
      setToast({ message: 'Funding request created successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to create funding request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUtility = async (data: Partial<FundingUtility>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUtilities(utilities.map(u =>
        u.id === editingUtility?.id ? { ...u, ...data, updated_at: new Date().toISOString() } : u
      ));
      setEditingUtility(null);
      setShowModal(false);
      setToast({ message: 'Funding request updated successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update funding request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUtility = (utilityId: string) => {
    setUtilities(utilities.filter(u => u.id !== utilityId));
    setToast({ message: 'Funding request deleted successfully!', type: 'success' });
  };

  const handleSubmitAll = async () => {
    const draftUtilities = utilities.filter(u => u.status === 'DRAFT');
    if (draftUtilities.length === 0) {
      setToast({ message: 'No draft requests to submit', type: 'error' });
      return;
    }

    if (!confirm(`Submit ${draftUtilities.length} draft request(s) for review?`)) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUtilities(utilities.map(u =>
        u.status === 'DRAFT' ? { ...u, status: 'SUBMITTED', updated_at: new Date().toISOString() } : u
      ));
      setToast({
        message: `${draftUtilities.length} funding request(s) submitted successfully!`,
        type: 'success'
      });
    } catch {
      setToast({ message: 'Failed to submit requests', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUtilities = filterStatus === 'ALL'
    ? utilities
    : utilities.filter(u => u.status === filterStatus);

  const totalRequested = utilities.reduce((sum, u) => sum + (u.requested_amount || 0), 0);
  const draftCount = utilities.filter(u => u.status === 'DRAFT').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Access gate for < 70% completion
  if (!canAccessFunding) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Profile to Access Funding
              </h1>
              <p className="text-gray-600 mb-6">
                You need at least 70% profile completion to access funding options.
                <br />
                Current completion: <strong>{profileCompletion}%</strong>
              </p>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div
                  className="bg-yellow-500 h-4 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">To unlock funding:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ Complete business information</li>
                  <li>✓ Upload financial documents (BS & P&L)</li>
                  <li>✓ Add director KYC documents</li>
                  <li>✓ Upload director ITR</li>
                </ul>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto"
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Funding Options</h1>
          </div>
          <p className="text-gray-600">
            Create and manage your funding requests. Your profile is {profileCompletion}% complete.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requested</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRequested)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Draft Requests</p>
                <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900">{utilities.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="ALL">All Requests</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {draftCount > 0 && (
                <Button
                  variant="secondary"
                  onClick={handleSubmitAll}
                  loading={loading}
                  className="flex-1 sm:flex-initial"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit All Drafts ({draftCount})
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => {
                  setEditingUtility(null);
                  setShowModal(true);
                }}
                className="flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Utilities Grid */}
        {filteredUtilities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterStatus === 'ALL' ? 'No funding requests yet' : `No ${filterStatus.toLowerCase()} requests`}
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first funding request to get started with financing options
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setEditingUtility(null);
                setShowModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Request
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUtilities.map((utility) => (
              <FundingUtilityCard
                key={utility.id}
                utility={utility}
                onEdit={(u) => {
                  setEditingUtility(u);
                  setShowModal(true);
                }}
                onDelete={handleDeleteUtility}
                canEdit={utility.status === 'DRAFT'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <UtilityFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUtility(null);
        }}
        onSubmit={editingUtility ? handleUpdateUtility : handleCreateUtility}
        initialData={editingUtility || undefined}
        loading={loading}
      />

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default FundingOptionsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/business/ProgressBar';
import BusinessBasicsForm from '@/components/business/BusinessBasicsForm';
import DirectorForm from '@/components/business/DirectorForm';
import DocumentTile from '@/components/business/DocumentTile';
import FileUploader from '@/components/business/FileUploader';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { Business, Director, Document } from '@/types';
import { Building2, FileText, Users, Rocket, Plus, Edit2, Trash2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'business' | 'documents' | 'directors'>('business');
  const [business, setBusiness] = useState<Business | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDirectorForm, setShowDirectorForm] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Mock completion data
  const mockCompletion: any = {
    overallCompletion: 45,
    businessInfo: { weight: 10, percentage: 100, completed: true },
    financials: { weight: 20, percentage: 50, completed: false },
    sanctions: { weight: 20, percentage: 0, completed: false },
    businessProfile: { weight: 10, percentage: 100, completed: true },
    directorKYC: { weight: 20, percentage: 60, completed: false },
    directorITR: { weight: 20, percentage: 0, completed: false },
    nextSteps: [
      'Upload Balance Sheet and P&L statements',
      'Complete director KYC documents',
      'Upload director ITR documents',
    ],
  };

  // Load mock data
  useEffect(() => {
    const mockBusinessStr = localStorage.getItem('mockBusiness');
    if (mockBusinessStr) {
      setBusiness(JSON.parse(mockBusinessStr));
    } else {
      // Default mock business
      setBusiness({
        id: 'biz-123',
        owner_id: 'demo-user-id',
        legal_name: 'ABC Manufacturing Pvt Ltd',
        business_name: 'ABC Manufacturing',
        entity_type: 'PVT_LTD',
        pan: 'ABCDE1234F',
        gstin: '27ABCDE1234F1Z5',
        udyam: 'UDYAM-MH-12-0123456',
        sector: 'Manufacturing',
        city: 'Mumbai',
        state: 'Maharashtra',
        brief_description: 'Leading manufacturer of industrial components',
        profile_completion_percent: 45,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-02-05T14:30:00Z',
      });
    }

    // Mock directors
    setDirectors([
      {
        id: 'dir-1',
        business_id: 'biz-123',
        name: 'John Doe',
        dob: '1980-05-15',
        pan: 'ABCDE5678G',
        aadhaar_number: '123456789012',
        email: 'john@abc.com',
        phone: '9876543210',
        address: '123 Main Street, Mumbai',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
      },
    ]);

    // Mock documents
    setDocuments([
      {
        id: 'doc-1',
        document_group_id: 'grp-1',
        file_name: 'Balance_Sheet_2023.pdf',
        file_url: '/uploads/balance_sheet_2023.pdf',
        file_path: '/uploads/balance_sheet_2023.pdf',
        file_size: 2048576,
        mime_type: 'application/pdf',
        uploaded_by: 'demo-user-id',
        uploaded_at: '2024-01-25T14:30:00Z',
      },
      {
        id: 'doc-2',
        document_group_id: 'grp-1',
        file_name: 'PnL_Statement_2023.pdf',
        file_url: '/uploads/pnl_2023.pdf',
        file_path: '/uploads/pnl_2023.pdf',
        file_size: 1536789,
        mime_type: 'application/pdf',
        uploaded_by: 'demo-user-id',
        uploaded_at: '2024-01-26T10:15:00Z',
      },
    ]);
  }, []);

  const handleBusinessUpdate = async (data: Partial<Business>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updated = { ...business, ...data, updated_at: new Date().toISOString() };
      setBusiness(updated as Business);
      localStorage.setItem('mockBusiness', JSON.stringify(updated));
      setToast({ message: 'Business profile updated successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirector = async (data: Partial<Director>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newDirector: Director = {
        ...data,
        id: `dir-${Date.now()}`,
        business_id: business?.id || 'biz-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Director;
      setDirectors([...directors, newDirector]);
      setShowDirectorForm(false);
      setToast({ message: 'Director added successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to add director', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDirector = async (data: Partial<Director>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDirectors(directors.map(d => 
        d.id === editingDirector?.id ? { ...d, ...data, updated_at: new Date().toISOString() } : d
      ));
      setEditingDirector(null);
      setShowDirectorForm(false);
      setToast({ message: 'Director updated successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update director', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDirector = async (directorId: string) => {
    if (!confirm('Are you sure you want to delete this director?')) return;
    setDirectors(directors.filter(d => d.id !== directorId));
    setToast({ message: 'Director deleted successfully!', type: 'success' });
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        document_group_id: selectedDocType,
        file_name: selectedFile.name,
        file_url: `/uploads/${selectedFile.name}`,
        file_path: `/uploads/${selectedFile.name}`,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        uploaded_by: 'demo-user-id',
        uploaded_at: new Date().toISOString(),
      };
      setDocuments([...documents, newDoc]);
      setShowFileUpload(false);
      setSelectedFile(null);
      setSelectedDocType('');
      setToast({ message: 'Document uploaded successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to upload document', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setDocuments(documents.filter(d => d.id !== docId));
    setToast({ message: 'Document deleted successfully!', type: 'success' });
  };

  const canAccessFunding = mockCompletion.overallCompletion >= 70;

  if (!business) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{business.legal_name}</h1>
          <p className="text-gray-600 mt-1">Manage your business profile and documents</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar completion={mockCompletion} />
        </div>

        {/* Funding CTA */}
        {canAccessFunding && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-green-600" />
                  Your profile is ready for funding!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  You've reached {mockCompletion.overallCompletion}% completion. Explore funding options now.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate('/funding')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Explore Funding
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('business')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'business'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-4 h-4 inline-block mr-2" />
                Business Info
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                Documents ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab('directors')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'directors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline-block mr-2" />
                Directors ({directors.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Business Tab */}
            {activeTab === 'business' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Business Details</h2>
                <BusinessBasicsForm
                  onSubmit={handleBusinessUpdate}
                  initialData={business}
                  loading={loading}
                />
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                  <Button
                    variant="primary"
                    onClick={() => setShowFileUpload(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>

                {showFileUpload && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select document type</option>
                        <option value="BS_PNL">Balance Sheet & P&L</option>
                        <option value="SANCTION">Sanction Letters</option>
                        <option value="PROFILE">Business Profile</option>
                        <option value="KYC_DIRECTOR">Director KYC</option>
                        <option value="ITR_DIRECTOR">Director ITR</option>
                      </select>
                    </div>
                    <FileUploader
                      onFileSelect={setSelectedFile}
                      onUpload={handleFileUpload}
                      onCancel={() => {
                        setShowFileUpload(false);
                        setSelectedFile(null);
                        setSelectedDocType('');
                      }}
                      selectedFile={selectedFile}
                      uploading={loading}
                      documentType={selectedDocType}
                      documentTypeLabel={selectedDocType}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm mt-1">Upload your first document to get started</p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <DocumentTile
                        key={doc.id}
                        document={doc}
                        onDelete={handleDeleteDocument}
                        loading={loading}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Directors Tab */}
            {activeTab === 'directors' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Directors & Owners</h2>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingDirector(null);
                      setShowDirectorForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Director
                  </Button>
                </div>

                {(showDirectorForm || editingDirector) && (
                  <div className="mb-6">
                    <DirectorForm
                      onSubmit={editingDirector ? handleUpdateDirector : handleAddDirector}
                      onCancel={() => {
                        setShowDirectorForm(false);
                        setEditingDirector(null);
                      }}
                      initialData={editingDirector || undefined}
                      loading={loading}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {directors.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No directors added yet</p>
                      <p className="text-sm mt-1">Add your first director to continue</p>
                    </div>
                  ) : (
                    directors.map((director) => (
                      <div
                        key={director.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{director.name}</h3>
                            <p className="text-sm text-gray-500">{director.pan}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingDirector(director);
                                setShowDirectorForm(true);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDirector(director.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          {director.email && (
                            <p className="text-gray-600">📧 {director.email}</p>
                          )}
                          {director.phone && (
                            <p className="text-gray-600">📱 {director.phone}</p>
                          )}
                          {director.dob && (
                            <p className="text-gray-600">
                              🎂 {new Date(director.dob).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default ProfilePage;

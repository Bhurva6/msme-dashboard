import React, { useState } from 'react';
import { FundingUtility } from '@/types';
import { Edit2, Trash2, Send, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface FundingUtilityCardProps {
  utility: FundingUtility;
  onEdit?: (utility: FundingUtility) => void;
  onDelete?: (utilityId: string) => void;
  canEdit?: boolean;
}

const FundingUtilityCard: React.FC<FundingUtilityCardProps> = ({
  utility,
  onEdit,
  onDelete,
  canEdit = true,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      TERM_LOAN: 'Term Loan',
      WORKING_CAPITAL: 'Working Capital',
      ASSET_FINANCE: 'Asset Finance',
      SCHEME_LOAN: 'Government Scheme Loan',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      SUBMITTED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
      UNDER_REVIEW: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };

    const badge = badges[status] || badges.DRAFT;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(utility.id);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getTypeLabel(utility.type)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(utility.created_at).toLocaleDateString('en-IN')}
          </p>
        </div>
        {getStatusBadge(utility.status)}
      </div>

      {/* Amount */}
      {utility.amount && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <DollarSign className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Requested Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(utility.amount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Details based on type */}
      <div className="space-y-3 mb-4">
        {utility.type === 'TERM_LOAN' && (
          <>
            {utility.tenure && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium text-gray-900">{utility.tenure} months</span>
              </div>
            )}
            {utility.security_offered && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Security:</span>
                  <span className="font-medium text-gray-900 ml-1">{utility.security_offered}</span>
                </div>
              </div>
            )}
          </>
        )}

        {utility.type === 'WORKING_CAPITAL' && utility.repayment_frequency && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Repayment:</span>
            <span className="font-medium text-gray-900 capitalize">{utility.repayment_frequency}</span>
          </div>
        )}

        {utility.type === 'ASSET_FINANCE' && (
          <>
            {utility.asset_type && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Asset Type:</span>
                <span className="font-medium text-gray-900">{utility.asset_type}</span>
              </div>
            )}
            {utility.asset_cost && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Asset Cost:</span>
                <span className="font-medium text-gray-900">{formatCurrency(utility.asset_cost)}</span>
              </div>
            )}
          </>
        )}

        {utility.type === 'SCHEME_LOAN' && utility.interested_schemes && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-600">Schemes:</span>
              <span className="font-medium text-gray-900 ml-1">{utility.interested_schemes}</span>
            </div>
          </div>
        )}

        {utility.purpose && (
          <div className="pt-3 border-t">
            <p className="text-sm text-gray-600 mb-1">Purpose:</p>
            <p className="text-sm text-gray-900">{utility.purpose}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {canEdit && utility.status === 'DRAFT' && (
        <div className="flex gap-2 pt-4 border-t">
          {onEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(utility)}
              className="flex-1"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && !showConfirm && (
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(true)}
              className="px-4"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {showConfirm && (
            <div className="flex gap-2 flex-1">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </Button>
            </div>
          )}
        </div>
      )}

      {utility.status === 'SUBMITTED' && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Send className="w-4 h-4" />
            <span>Application submitted and under review</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingUtilityCard;

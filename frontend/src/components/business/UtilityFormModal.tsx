import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FundingUtility } from '@/types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { X } from 'lucide-react';

interface UtilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<FundingUtility>) => Promise<void>;
  initialData?: Partial<FundingUtility>;
  loading?: boolean;
}

const UtilityFormModal: React.FC<UtilityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [selectedType, setSelectedType] = useState<string>(initialData?.type || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Partial<FundingUtility>>({
    defaultValues: initialData || {},
  });

  const utilityTypes = [
    { value: 'TERM_LOAN', label: 'Term Loan' },
    { value: 'WORKING_CAPITAL', label: 'Working Capital' },
    { value: 'ASSET_FINANCE', label: 'Asset Finance' },
    { value: 'SCHEME_LOAN', label: 'Government Scheme Loan' },
  ];

  const watchedType = watch('type') || selectedType;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Funding Request' : 'New Funding Request'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Utility Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('type', { required: 'Type is required' })}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select funding type</option>
              {utilityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Common Fields for All Types */}
          {watchedType && (
            <>
              {/* Amount - Not for Scheme Loans */}
              {watchedType !== 'SCHEME_LOAN' && (
                <div>
                  <Input
                    label="Requested Amount"
                    type="number"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 10000, message: 'Minimum amount is ₹10,000' },
                    })}
                    error={errors.amount?.message}
                    placeholder="Enter amount in INR"
                  />
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('purpose', { required: 'Purpose is required' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the purpose of this funding request"
                />
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
                )}
              </div>

              {/* Type-specific fields */}
              {watchedType === 'TERM_LOAN' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tenure (months)"
                      type="number"
                      {...register('tenure', {
                        required: 'Tenure is required',
                        min: { value: 1, message: 'Minimum 1 month' },
                        max: { value: 360, message: 'Maximum 360 months (30 years)' },
                      })}
                      error={errors.tenure?.message}
                      placeholder="e.g., 60 for 5 years"
                    />
                    <Input
                      label="Interest Rate (if known)"
                      type="number"
                      step="0.01"
                      {...register('interest_rate')}
                      placeholder="e.g., 10.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Security/Collateral Offered
                    </label>
                    <textarea
                      {...register('security_offered')}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Property, Machinery, etc."
                    />
                  </div>
                </>
              )}

              {watchedType === 'WORKING_CAPITAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repayment Frequency
                  </label>
                  <select
                    {...register('repayment_frequency')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              {watchedType === 'ASSET_FINANCE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Asset Type"
                    {...register('asset_type', { required: 'Asset type is required' })}
                    error={errors.asset_type?.message}
                    placeholder="e.g., Machinery, Vehicle"
                  />
                  <Input
                    label="Asset Cost"
                    type="number"
                    {...register('asset_cost', { required: 'Asset cost is required' })}
                    error={errors.asset_cost?.message}
                    placeholder="Total cost of asset"
                  />
                </div>
              )}

              {watchedType === 'SCHEME_LOAN' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Government Schemes
                  </label>
                  <textarea
                    {...register('interested_schemes')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., PMEGP, MUDRA, Stand-Up India, etc."
                  />
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || !watchedType}
              className="px-8"
            >
              {initialData ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilityFormModal;

import React from 'react';
import { useForm } from 'react-hook-form';
import { Director } from '@/types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { X } from 'lucide-react';

interface DirectorFormProps {
  onSubmit: (data: Partial<Director>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Director>;
  loading?: boolean;
}

const DirectorForm: React.FC<DirectorFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Director>>({
    defaultValues: initialData || {},
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Director' : 'Add Director'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              {...register('full_name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              error={errors.full_name?.message}
              placeholder="John Doe"
            />
          </div>

          {/* PAN */}
          <div>
            <Input
              label="PAN Number"
              {...register('pan', {
                required: 'PAN is required',
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                  message: 'Invalid PAN format (e.g., ABCDE1234F)',
                },
              })}
              error={errors.pan?.message}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {/* Aadhaar */}
          <div>
            <Input
              label="Aadhaar Number (Optional)"
              {...register('aadhaar', {
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: 'Invalid Aadhaar (12 digits)',
                },
              })}
              error={errors.aadhaar?.message}
              placeholder="123456789012"
              maxLength={12}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Input
              label="Date of Birth (Optional)"
              type="date"
              {...register('date_of_birth')}
              error={errors.date_of_birth?.message}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <select
              {...register('designation', { required: 'Designation is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select designation</option>
              <option value="Director">Director</option>
              <option value="Managing Director">Managing Director</option>
              <option value="Partner">Partner</option>
              <option value="Proprietor">Proprietor</option>
              <option value="CEO">CEO</option>
              <option value="CFO">CFO</option>
              <option value="Other">Other</option>
            </select>
            {errors.designation && (
              <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email (Optional)"
              type="email"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <Input
              label="Phone (Optional)"
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Invalid phone (10 digits)',
                },
              })}
              error={errors.phone?.message}
              placeholder="9876543210"
              maxLength={10}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <Input
              label="Address (Optional)"
              {...register('address')}
              placeholder="Complete residential address"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="px-8"
          >
            {initialData ? 'Update Director' : 'Add Director'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DirectorForm;

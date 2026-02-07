import React from 'react';
import { useForm } from 'react-hook-form';
import { Business } from '@/types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface BusinessBasicsFormProps {
  onSubmit: (data: Partial<Business>) => Promise<void>;
  initialData?: Partial<Business>;
  loading?: boolean;
}

const BusinessBasicsForm: React.FC<BusinessBasicsFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<Business>>({
    defaultValues: initialData || {},
  });

  const entityTypes = [
    { value: 'PROPRIETORSHIP', label: 'Proprietorship' },
    { value: 'PARTNERSHIP', label: 'Partnership' },
    { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
    { value: 'PVT_LTD', label: 'Private Limited Company' },
    { value: 'PUBLIC_LTD', label: 'Public Limited Company' },
    { value: 'OPC', label: 'One Person Company (OPC)' },
  ];

  const sectors = [
    'Manufacturing', 'Trading', 'Services', 'Retail', 'Wholesale',
    'IT & Software', 'Healthcare', 'Education', 'Agriculture', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal Name */}
        <div className="md:col-span-2">
          <Input
            label="Legal Business Name"
            {...register('legal_name', { required: 'Legal name is required' })}
            error={errors.legal_name?.message}
            placeholder="As per registration documents"
          />
        </div>

        {/* Entity Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entity Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('entity_type', { required: 'Entity type is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select entity type</option>
            {entityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.entity_type && (
            <p className="mt-1 text-sm text-red-600">{errors.entity_type.message}</p>
          )}
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Sector <span className="text-red-500">*</span>
          </label>
          <select
            {...register('sector', { required: 'Sector is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select sector</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          {errors.sector && (
            <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
          )}
        </div>

        {/* PAN */}
        <div>
          <Input
            label="Business PAN"
            {...register('pan', {
              required: 'PAN is required',
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: 'Invalid PAN format (e.g., ABCDE1234F)',
              },
            })}
            error={errors.pan?.message}
            placeholder="ABCDE1234F"
            maxLength={10}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        {/* GSTIN */}
        <div>
          <Input
            label="GSTIN (Optional)"
            {...register('gstin', {
              pattern: {
                value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: 'Invalid GSTIN format',
              },
            })}
            error={errors.gstin?.message}
            placeholder="22ABCDE1234F1Z5"
            maxLength={15}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        {/* UDYAM */}
        <div className="md:col-span-2">
          <Input
            label="UDYAM Registration Number (Optional)"
            {...register('udyam_registration')}
            placeholder="UDYAM-XX-00-0000000"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Input
            label="Registered Address"
            {...register('address', { required: 'Address is required' })}
            error={errors.address?.message}
            placeholder="Complete business address"
          />
        </div>

        {/* City */}
        <div>
          <Input
            label="City"
            {...register('city', { required: 'City is required' })}
            error={errors.city?.message}
            placeholder="City name"
          />
        </div>

        {/* State */}
        <div>
          <Input
            label="State"
            {...register('state', { required: 'State is required' })}
            error={errors.state?.message}
            placeholder="State name"
          />
        </div>

        {/* Pincode */}
        <div>
          <Input
            label="Pincode"
            {...register('pincode', {
              required: 'Pincode is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Invalid pincode (6 digits)',
              },
            })}
            error={errors.pincode?.message}
            placeholder="400001"
            maxLength={6}
          />
        </div>

        {/* Contact Email */}
        <div>
          <Input
            label="Contact Email"
            type="email"
            {...register('contact_email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.contact_email?.message}
            placeholder="business@example.com"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <Input
            label="Contact Phone"
            {...register('contact_phone', {
              required: 'Phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid phone (10 digits)',
              },
            })}
            error={errors.contact_phone?.message}
            placeholder="9876543210"
            maxLength={10}
          />
        </div>

        {/* Year Established */}
        <div>
          <Input
            label="Year Established"
            type="number"
            {...register('year_established', {
              required: 'Year is required',
              min: { value: 1900, message: 'Invalid year' },
              max: { value: new Date().getFullYear(), message: 'Year cannot be in future' },
            })}
            error={errors.year_established?.message}
            placeholder="2020"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="px-8"
        >
          {initialData ? 'Update Business' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default BusinessBasicsForm;

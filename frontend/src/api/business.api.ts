import axiosInstance from './axios.config';
import { Business, Document, Director, FundingUtility, ApiResponse } from '@/types';

// ============================================================================
// BUSINESS APIs
// ============================================================================

export const createBusiness = async (data: Partial<Business>): Promise<Business> => {
  const response = await axiosInstance.post<ApiResponse<Business>>('/businesses', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create business');
  }
  return response.data.data;
};

export const getMyBusiness = async (): Promise<{
  business: Business;
  documentGroups: any[];
}> => {
  const response = await axiosInstance.get<ApiResponse>('/businesses/me');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch business');
  }
  return response.data.data;
};

export const updateBusiness = async (id: string, data: Partial<Business>): Promise<Business> => {
  const response = await axiosInstance.patch<ApiResponse<Business>>(`/businesses/${id}`, data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update business');
  }
  return response.data.data;
};

export const getProfileCompletion = async (businessId: string): Promise<any> => {
  const response = await axiosInstance.get<ApiResponse>(`/businesses/${businessId}/completion`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch completion');
  }
  return response.data.data;
};

// ============================================================================
// DOCUMENT APIs
// ============================================================================

export const uploadDocument = async (
  file: File,
  businessId: string,
  documentType: string
): Promise<{ document: Document; newCompletion: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('businessId', businessId);
  formData.append('documentType', documentType);

  const response = await axiosInstance.post<ApiResponse>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to upload document');
  }

  return response.data.data;
};

export const getDocuments = async (businessId: string, type?: string): Promise<any> => {
  const url = type ? `/documents/${businessId}?type=${type}` : `/documents/${businessId}`;
  const response = await axiosInstance.get<ApiResponse>(url);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch documents');
  }
  return response.data.data;
};

export const deleteDocument = async (documentId: string): Promise<{ newCompletion: number }> => {
  const response = await axiosInstance.delete<ApiResponse>(`/documents/${documentId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to delete document');
  }
  return response.data.data;
};

export const getDocumentDownloadUrl = async (documentId: string): Promise<string> => {
  const response = await axiosInstance.get<ApiResponse>(`/documents/${documentId}/download`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get download URL');
  }
  return response.data.data.downloadUrl;
};

// ============================================================================
// DIRECTOR APIs
// ============================================================================

export const addDirector = async (data: Partial<Director>): Promise<Director> => {
  const response = await axiosInstance.post<ApiResponse>('/directors', data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to add director');
  }
  return response.data.data.director;
};

export const getDirectors = async (businessId: string): Promise<Director[]> => {
  const response = await axiosInstance.get<ApiResponse>(`/directors/${businessId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch directors');
  }
  return response.data.data.directors;
};

export const updateDirector = async (
  directorId: string,
  data: Partial<Director>
): Promise<Director> => {
  const response = await axiosInstance.patch<ApiResponse>(`/directors/${directorId}`, data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update director');
  }
  return response.data.data.director;
};

export const deleteDirector = async (directorId: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse>(`/directors/${directorId}`);
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete director');
  }
};

// ============================================================================
// FUNDING UTILITY APIs
// ============================================================================

export const createFundingUtility = async (
  data: Partial<FundingUtility>
): Promise<FundingUtility> => {
  const response = await axiosInstance.post<ApiResponse<FundingUtility>>(
    '/funding-utilities',
    data
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create funding utility');
  }
  return response.data.data;
};

export const getFundingUtilities = async (businessId: string): Promise<FundingUtility[]> => {
  const response = await axiosInstance.get<ApiResponse>(`/funding-utilities/${businessId}`);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch funding utilities');
  }
  return response.data.data.utilities;
};

export const updateFundingUtility = async (
  utilityId: string,
  data: Partial<FundingUtility>
): Promise<FundingUtility> => {
  const response = await axiosInstance.patch<ApiResponse<FundingUtility>>(
    `/funding-utilities/${utilityId}`,
    data
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update funding utility');
  }
  return response.data.data;
};

export const deleteFundingUtility = async (utilityId: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse>(`/funding-utilities/${utilityId}`);
  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete funding utility');
  }
};

export const submitFundingUtilities = async (businessId: string): Promise<any> => {
  const response = await axiosInstance.post<ApiResponse>(
    `/funding-utilities/${businessId}/submit`
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to submit funding utilities');
  }
  return response.data.data;
};

import { useState } from 'react';
import * as businessApi from '@/api/business.api';
import { useBusinessStore } from '@/store/businessStore';
import type { Business, Director, FundingUtility, CompletionBreakdown } from '@/types';

export const useBusiness = () => {
  const {
    business,
    documentGroups,
    documents,
    directors,
    fundingUtilities,
    setBusiness,
    setDocumentGroups,
    addDocument,
    removeDocument,
    addDirector,
    updateDirector: updateDirectorStore,
    removeDirector,
    addFundingUtility,
    updateFundingUtility: updateUtilityStore,
    removeFundingUtility,
    updateCompletion,
  } = useBusinessStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState<CompletionBreakdown | null>(null);

  // Fetch business profile
  const fetchBusiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.getMyBusiness();
      setBusiness(data.business);
      setDocumentGroups(data.documentGroups);
      
      // Fetch completion details
      const completionData = await businessApi.getProfileCompletion(data.business.id);
      setCompletion(completionData);
      updateCompletion(completionData.overallCompletion);
      
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch business profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create business
  const createBusiness = async (businessData: Partial<Business>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.createBusiness(businessData);
      const businessResult = (data as any).business || data;
      const groups = (data as any).documentGroups || [];
      setBusiness(businessResult);
      setDocumentGroups(groups);
      updateCompletion(businessResult.profile_completion_percent || 0);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create business profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update business
  const updateBusiness = async (businessId: string, updates: Partial<Business>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.updateBusiness(businessId, updates);
      const businessResult = (data as any).business || data;
      setBusiness(businessResult);
      updateCompletion(businessResult.profile_completion_percent || 0);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update business profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (file: File, businessId: string, documentType: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.uploadDocument(file, businessId, documentType);
      addDocument(data.document);
      updateCompletion(data.newCompletion);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to upload document';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.deleteDocument(documentId);
      removeDocument(documentId);
      updateCompletion(data.newCompletion);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete document';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add director
  const createDirector = async (directorData: Partial<Director>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.addDirector(directorData);
      const directorResult = (data as any).director || data;
      const newCompletion = (data as any).newCompletion;
      addDirector(directorResult);
      if (newCompletion !== undefined) updateCompletion(newCompletion);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add director';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update director
  const updateDirector = async (directorId: string, updates: Partial<Director>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.updateDirector(directorId, updates);
      const directorResult = (data as any).director || data;
      const newCompletion = (data as any).newCompletion;
      updateDirectorStore(directorId, directorResult);
      if (newCompletion !== undefined) updateCompletion(newCompletion);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update director';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete director
  const deleteDirector = async (directorId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.deleteDirector(directorId);
      const newCompletion = (data as any)?.newCompletion;
      removeDirector(directorId);
      if (newCompletion !== undefined) updateCompletion(newCompletion);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete director';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create funding utility
  const createUtility = async (utilityData: Partial<FundingUtility>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.createFundingUtility(utilityData);
      const utilityResult = (data as any).utility || data;
      addFundingUtility(utilityResult);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create funding utility';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update funding utility
  const updateUtility = async (utilityId: string, updates: Partial<FundingUtility>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.updateFundingUtility(utilityId, updates);
      const utilityResult = (data as any).utility || data;
      updateUtilityStore(utilityId, utilityResult);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update funding utility';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete funding utility
  const deleteUtility = async (utilityId: string) => {
    setLoading(true);
    setError(null);
    try {
      await businessApi.deleteFundingUtility(utilityId);
      removeFundingUtility(utilityId);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete funding utility';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit utilities
  const submitUtilities = async (businessId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.submitFundingUtilities(businessId);
      // Update all utilities in store
      data.utilities.forEach((utility: FundingUtility) => {
        updateUtilityStore(utility.id, utility);
      });
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit funding utilities';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    business,
    documentGroups,
    documents,
    directors,
    fundingUtilities,
    completion,
    loading,
    error,
    
    // Actions
    fetchBusiness,
    createBusiness,
    updateBusiness,
    uploadDocument,
    deleteDocument,
    createDirector,
    updateDirector,
    deleteDirector,
    createUtility,
    updateUtility,
    deleteUtility,
    submitUtilities,
  };
};

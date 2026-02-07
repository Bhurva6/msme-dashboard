import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business, DocumentGroup, Document, Director, FundingUtility } from '@/types';

interface BusinessState {
  business: Business | null;
  documentGroups: DocumentGroup[];
  documents: Document[];
  directors: Director[];
  fundingUtilities: FundingUtility[];
  isLoading: boolean;
  
  // Actions
  setBusiness: (business: Business | null) => void;
  setDocumentGroups: (groups: DocumentGroup[]) => void;
  setDocuments: (documents: Document[]) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (docId: string) => void;
  setDirectors: (directors: Director[]) => void;
  addDirector: (director: Director) => void;
  updateDirector: (directorId: string, data: Partial<Director>) => void;
  removeDirector: (directorId: string) => void;
  setFundingUtilities: (utilities: FundingUtility[]) => void;
  addFundingUtility: (utility: FundingUtility) => void;
  updateFundingUtility: (utilityId: string, data: Partial<FundingUtility>) => void;
  removeFundingUtility: (utilityId: string) => void;
  updateCompletion: (percent: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  business: null,
  documentGroups: [],
  documents: [],
  directors: [],
  fundingUtilities: [],
  isLoading: false,
};

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      ...initialState,

      setBusiness: (business) => set({ business }),

      setDocumentGroups: (groups) => set({ documentGroups: groups }),

      setDocuments: (documents) => set({ documents }),

      addDocument: (doc) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),

      removeDocument: (docId) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== docId),
        })),

      setDirectors: (directors) => set({ directors }),

      addDirector: (director) =>
        set((state) => ({
          directors: [...state.directors, director],
        })),

      updateDirector: (directorId, data) =>
        set((state) => ({
          directors: state.directors.map((d) =>
            d.id === directorId ? { ...d, ...data } : d
          ),
        })),

      removeDirector: (directorId) =>
        set((state) => ({
          directors: state.directors.filter((d) => d.id !== directorId),
        })),

      setFundingUtilities: (utilities) => set({ fundingUtilities: utilities }),

      addFundingUtility: (utility) =>
        set((state) => ({
          fundingUtilities: [...state.fundingUtilities, utility],
        })),

      updateFundingUtility: (utilityId, data) =>
        set((state) => ({
          fundingUtilities: state.fundingUtilities.map((u) =>
            u.id === utilityId ? { ...u, ...data } : u
          ),
        })),

      removeFundingUtility: (utilityId) =>
        set((state) => ({
          fundingUtilities: state.fundingUtilities.filter((u) => u.id !== utilityId),
        })),

      updateCompletion: (percent) =>
        set((state) => ({
          business: state.business
            ? { ...state.business, profile_completion_percent: percent }
            : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      reset: () => set(initialState),
    }),
    {
      name: 'business-storage',
      partialize: (state) => ({
        business: state.business,
        documentGroups: state.documentGroups,
        documents: state.documents,
        directors: state.directors,
        fundingUtilities: state.fundingUtilities,
      }),
    }
  )
);

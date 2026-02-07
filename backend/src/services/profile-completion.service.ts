/**
 * Profile Completion Service
 * Calculates business profile completion percentage and provides breakdown
 */

import { BusinessModel } from '../models/Business';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

export interface CompletionBreakdown {
  businessInfo: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  financials: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  sanctions: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  businessProfile: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  kycDirectors: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
  itrDirectors: {
    weight: number;
    completed: boolean;
    percentage: number;
  };
}

export class ProfileCompletionService {
  /**
   * Calculate total profile completion percentage
   */
  static async calculate(businessId: string): Promise<number> {
    return await BusinessModel.calculateProfileCompletion(businessId);
  }

  /**
   * Get detailed breakdown of profile completion
   */
  static async getBreakdown(businessId: string): Promise<CompletionBreakdown> {
    const business = await BusinessModel.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    // Get document groups
    const [docGroups] = await pool.execute<RowDataPacket[]>(
      'SELECT type, status FROM document_groups WHERE business_id = ?',
      [businessId]
    );

    // Get directors
    const [directors] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM directors WHERE business_id = ?',
      [businessId]
    );

    const breakdown: CompletionBreakdown = {
      businessInfo: {
        weight: 10,
        completed: !!(
          business.legal_name &&
          business.entity_type &&
          business.sector &&
          business.city &&
          business.state
        ),
        percentage: 0,
      },
      financials: {
        weight: 20,
        completed: false,
        percentage: 0,
      },
      sanctions: {
        weight: 20,
        completed: false,
        percentage: 0,
      },
      businessProfile: {
        weight: 10,
        completed: false,
        percentage: 0,
      },
      kycDirectors: {
        weight: 20,
        completed: false,
        percentage: 0,
      },
      itrDirectors: {
        weight: 20,
        completed: false,
        percentage: 0,
      },
    };

    // Calculate each section
    breakdown.businessInfo.percentage = breakdown.businessInfo.completed
      ? breakdown.businessInfo.weight
      : 0;

    // BS & P&L
    const bsPnl = docGroups.find((g: any) => g.type === 'BS_PNL');
    breakdown.financials.completed = bsPnl && bsPnl.status === 'COMPLETE';
    breakdown.financials.percentage = bsPnl && bsPnl.status !== 'NOT_STARTED'
      ? (bsPnl.status === 'COMPLETE' ? breakdown.financials.weight : breakdown.financials.weight / 2)
      : 0;

    // Sanctions
    const sanction = docGroups.find((g: any) => g.type === 'SANCTION');
    breakdown.sanctions.completed = sanction && sanction.status === 'COMPLETE';
    breakdown.sanctions.percentage = sanction && sanction.status !== 'NOT_STARTED'
      ? (sanction.status === 'COMPLETE' ? breakdown.sanctions.weight : breakdown.sanctions.weight / 2)
      : 0;

    // Business Profile
    const profile = docGroups.find((g: any) => g.type === 'PROFILE');
    const hasDescription = business.brief_description && business.brief_description.length > 50;
    breakdown.businessProfile.completed =
      (profile && profile.status === 'COMPLETE') || hasDescription;
    breakdown.businessProfile.percentage = breakdown.businessProfile.completed
      ? breakdown.businessProfile.weight
      : (profile && profile.status === 'IN_PROGRESS' ? breakdown.businessProfile.weight / 2 : 0);

    // KYC Directors
    const kycDirector = docGroups.find((g: any) => g.type === 'KYC_DIRECTOR');
    const allDirectorsHaveKYC = directors.length > 0 && directors.every(
      (d: any) => d.pan && d.aadhaar_number
    );
    breakdown.kycDirectors.completed = allDirectorsHaveKYC && kycDirector && kycDirector.status === 'COMPLETE';
    breakdown.kycDirectors.percentage = allDirectorsHaveKYC
      ? (kycDirector && kycDirector.status === 'COMPLETE' ? breakdown.kycDirectors.weight : breakdown.kycDirectors.weight / 2)
      : 0;

    // ITR Directors
    const itrDirector = docGroups.find((g: any) => g.type === 'ITR_DIRECTOR');
    breakdown.itrDirectors.completed = directors.length > 0 && itrDirector && itrDirector.status === 'COMPLETE';
    breakdown.itrDirectors.percentage = itrDirector && itrDirector.status !== 'NOT_STARTED'
      ? (itrDirector.status === 'COMPLETE' ? breakdown.itrDirectors.weight : breakdown.itrDirectors.weight / 2)
      : 0;

    return breakdown;
  }

  /**
   * Get status message based on completion percentage
   */
  static getStatusMessage(percent: number): string {
    if (percent <= 20) {
      return 'Just getting started';
    } else if (percent <= 50) {
      return 'Halfway there';
    } else if (percent <= 69) {
      return 'Almost ready';
    } else if (percent <= 89) {
      return 'Ready to share with banks';
    } else {
      return 'Bank-ready profile';
    }
  }

  /**
   * Check if profile is fundable (>= 70%)
   */
  static isFundable(percent: number): boolean {
    return percent >= 70;
  }

  /**
   * Get next steps recommendation
   */
  static async getNextSteps(businessId: string): Promise<string[]> {
    const breakdown = await this.getBreakdown(businessId);
    const steps: string[] = [];

    if (!breakdown.businessInfo.completed) {
      steps.push('Complete basic business information');
    }

    if (!breakdown.financials.completed) {
      steps.push('Upload Balance Sheet & P&L statements');
    }

    if (!breakdown.sanctions.completed) {
      steps.push('Upload bank sanction letters');
    }

    if (!breakdown.businessProfile.completed) {
      steps.push('Add business profile documents or description');
    }

    if (!breakdown.kycDirectors.completed) {
      steps.push('Complete director KYC documents');
    }

    if (!breakdown.itrDirectors.completed) {
      steps.push('Upload director ITR documents');
    }

    if (steps.length === 0) {
      steps.push('Profile complete! You can now access funding options');
    }

    return steps;
  }
}

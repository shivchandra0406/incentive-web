import apiClient from './apiClient';

interface IncentiveRule {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface TargetBasedRule extends IncentiveRule {
  targetType: string;
  currencyType: string;
  targetDealType: string;
  salaryAmount?: number;
  targetAmount?: number;
  incentiveType?: string;
  rewardAmount?: number;
  rewardPercentage?: number;
  itemRewardType?: string;
  itemNestedChoice?: string;
  itemNestedAmount?: number;
  itemNestedPercentage?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const incentiveRulesService = {
  // Get all incentive rules
  getAllRules: async (): Promise<ApiResponse<IncentiveRule[]>> => {
    try {
      const response = await apiClient.get<IncentiveRule[]>('/IncentiveRules');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching incentive rules:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch incentive rules'
      };
    }
  },

  // Get a specific incentive rule by ID
  getRuleById: async (id: string): Promise<ApiResponse<IncentiveRule>> => {
    try {
      const response = await apiClient.get<IncentiveRule>(`/IncentiveRules/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error fetching incentive rule with ID ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || `Failed to fetch incentive rule with ID ${id}`
      };
    }
  },

  // Create a new target-based rule
  createTargetBasedRule: async (rule: Omit<TargetBasedRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TargetBasedRule>> => {
    try {
      const response = await apiClient.post<TargetBasedRule>('/IncentiveRules/target-based', rule);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating target-based rule:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create target-based rule'
      };
    }
  },

  // Update an existing target-based rule
  updateTargetBasedRule: async (id: string, rule: Partial<TargetBasedRule>): Promise<ApiResponse<TargetBasedRule>> => {
    try {
      const response = await apiClient.put<TargetBasedRule>(`/IncentiveRules/target-based/${id}`, rule);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error(`Error updating target-based rule with ID ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || `Failed to update target-based rule with ID ${id}`
      };
    }
  },

  // Delete an incentive rule
  deleteRule: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/IncentiveRules/${id}`);
      return {
        success: true
      };
    } catch (error: any) {
      console.error(`Error deleting incentive rule with ID ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || `Failed to delete incentive rule with ID ${id}`
      };
    }
  }
};

export default incentiveRulesService;

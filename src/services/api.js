// Mock API service for the Incentive Management application

// Mock incentive rules data
const mockRules = [
  {
    id: '1',
    name: 'Q2 Sales Target',
    type: 'Target',
    description: 'Quarterly sales target incentive',
    status: 'Active',
    createdBy: 'John Smith',
    createdAt: '2023-04-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Enterprise Deal Tiers',
    type: 'Tier',
    description: 'Tiered incentives for enterprise deals',
    status: 'Active',
    createdBy: 'Jane Doe',
    createdAt: '2023-03-15T14:30:00Z',
  },
  {
    id: '3',
    name: 'Healthcare Project Bonus',
    type: 'Project',
    description: 'Special incentives for healthcare industry projects',
    status: 'Active',
    createdBy: 'John Smith',
    createdAt: '2023-02-20T09:15:00Z',
  },
  {
    id: '4',
    name: 'APAC Region Bonus',
    type: 'Location',
    description: 'Location-based incentives for APAC region',
    status: 'Inactive',
    createdBy: 'Mike Johnson',
    createdAt: '2023-01-10T11:45:00Z',
  },
  {
    id: '5',
    name: 'Sales Team Collaboration',
    type: 'Team',
    description: 'Team-based incentives for collaborative sales',
    status: 'Active',
    createdBy: 'Sarah Williams',
    createdAt: '2023-05-05T16:20:00Z',
  },
];

// Incentive Rules Service
export const incentiveRulesService = {
  getAll: async (pageNumber = 1, pageSize = 10) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Calculate pagination
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = mockRules.slice(startIndex, endIndex);
    
    // Return mock paginated response
    return {
      success: true,
      data: {
        items: paginatedItems,
        totalCount: mockRules.length,
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalPages: Math.ceil(mockRules.length / pageSize)
      }
    };
  },
  
  getById: async (id) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find rule by ID
    const rule = mockRules.find(r => r.id === id);
    
    if (rule) {
      return {
        success: true,
        data: rule
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
  },
  
  create: async (ruleData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Create new rule with ID and timestamps
    const newRule = {
      id: (mockRules.length + 1).toString(),
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data
    mockRules.push(newRule);
    
    return {
      success: true,
      data: newRule
    };
  },
  
  update: async (id, ruleData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find rule index
    const index = mockRules.findIndex(r => r.id === id);
    
    if (index !== -1) {
      // Update rule
      const updatedRule = {
        ...mockRules[index],
        ...ruleData,
        updatedAt: new Date().toISOString()
      };
      
      mockRules[index] = updatedRule;
      
      return {
        success: true,
        data: updatedRule
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
  },
  
  delete: async (id) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find rule index
    const index = mockRules.findIndex(r => r.id === id);
    
    if (index !== -1) {
      // Remove rule
      mockRules.splice(index, 1);
      
      return {
        success: true,
        message: 'Incentive rule deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Incentive rule not found'
      };
    }
  },
};

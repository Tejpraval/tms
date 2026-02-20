export interface TenantPlatformData {
    id: string;
    name: string;
    sector: string;
    stressScore: number;
    healthScore: number;
    activeRollouts: number;
    pendingApprovals: number;
    riskTier: "Critical" | "High" | "Medium" | "Low";
    trendHistory: number[]; // Last 14 days stress scores
}

export const platformMockData: TenantPlatformData[] = [
    {
        id: "t1",
        name: "Acme Corp",
        sector: "Finance",
        stressScore: 88,
        healthScore: 92,
        activeRollouts: 12,
        pendingApprovals: 8,
        riskTier: "Critical",
        trendHistory: [65, 68, 72, 75, 78, 80, 82, 85, 84, 86, 88, 88, 89, 88],
    },
    {
        id: "t2",
        name: "Globex Inc",
        sector: "Logistics",
        stressScore: 45,
        healthScore: 99,
        activeRollouts: 3,
        pendingApprovals: 1,
        riskTier: "Medium",
        trendHistory: [42, 42, 43, 44, 45, 45, 46, 45, 45, 44, 45, 45, 46, 45],
    },
    {
        id: "t3",
        name: "Soylent Corp",
        sector: "Manufacturing",
        stressScore: 72,
        healthScore: 85,
        activeRollouts: 6,
        pendingApprovals: 4,
        riskTier: "High",
        trendHistory: [55, 58, 62, 65, 68, 70, 71, 72, 70, 72, 74, 72, 73, 72],
    },
    {
        id: "t4",
        name: "Umbrella Corp",
        sector: "Pharma",
        stressScore: 95,
        healthScore: 78,
        activeRollouts: 15,
        pendingApprovals: 12,
        riskTier: "Critical",
        trendHistory: [80, 82, 85, 88, 90, 92, 94, 95, 96, 95, 94, 95, 96, 95],
    },
    {
        id: "t5",
        name: "Stark Ind",
        sector: "Defense",
        stressScore: 12,
        healthScore: 100,
        activeRollouts: 2,
        pendingApprovals: 0,
        riskTier: "Low",
        trendHistory: [15, 14, 12, 12, 10, 12, 11, 12, 12, 13, 12, 11, 12, 12],
    },
    {
        id: "t6",
        name: "Cyberdyne",
        sector: "Tech",
        stressScore: 68,
        healthScore: 88,
        activeRollouts: 8,
        pendingApprovals: 3,
        riskTier: "High",
        trendHistory: [60, 62, 64, 65, 66, 67, 68, 68, 69, 68, 68, 67, 68, 68],
    },
    {
        id: "t7",
        name: "Massive Dynamic",
        sector: "Research",
        stressScore: 35,
        healthScore: 95,
        activeRollouts: 4,
        pendingApprovals: 2,
        riskTier: "Low",
        trendHistory: [38, 37, 36, 35, 34, 35, 35, 34, 35, 35, 34, 35, 35, 35],
    },
    {
        id: "t8",
        name: "Hooli",
        sector: "Tech",
        stressScore: 55,
        healthScore: 91,
        activeRollouts: 5,
        pendingApprovals: 2,
        riskTier: "Medium",
        trendHistory: [50, 52, 53, 54, 55, 54, 55, 56, 55, 54, 55, 55, 56, 55],
    },
    {
        id: "t9",
        name: "Initech",
        sector: "Finance",
        stressScore: 22,
        healthScore: 98,
        activeRollouts: 1,
        pendingApprovals: 0,
        riskTier: "Low",
        trendHistory: [25, 24, 23, 22, 22, 21, 22, 22, 23, 22, 22, 21, 22, 22],
    },
    {
        id: "t10",
        name: "Veidt Ent",
        sector: "Conglomerate",
        stressScore: 78,
        healthScore: 82,
        activeRollouts: 9,
        pendingApprovals: 6,
        riskTier: "High",
        trendHistory: [70, 72, 74, 75, 76, 78, 79, 78, 77, 78, 79, 78, 78, 78],
    },
];

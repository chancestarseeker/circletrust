export type CoverageStatus = "covered" | "partial" | "gap";

export interface HealthSector {
  name: string;
  status: CoverageStatus;
}

export interface DistrictData {
  district: number;
  name: string;
  sectors: HealthSector[];
}

export const HEALTH_SECTORS = [
  "Primary Care",
  "Mental Health",
  "Dental Care",
  "Emergency Services",
  "Pharmacy Access",
  "Maternal & Child Health",
  "Substance Abuse Treatment",
  "Nutrition & Food Access",
] as const;

export const STATUS_CONFIG: Record<
  CoverageStatus,
  { label: string; icon: string; color: string; bg: string }
> = {
  covered: { label: "Covered", icon: "\u2713", color: "#166534", bg: "#dcfce7" },
  partial: { label: "Partial", icon: "\u25d0", color: "#92400e", bg: "#fef3c7" },
  gap: { label: "Gap", icon: "\u2717", color: "#991b1b", bg: "#fee2e2" },
};

export const DISTRICTS: DistrictData[] = [
  {
    district: 1,
    name: "District 1 \u2013 Northside",
    sectors: [
      { name: "Primary Care", status: "covered" },
      { name: "Mental Health", status: "partial" },
      { name: "Dental Care", status: "gap" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "covered" },
      { name: "Maternal & Child Health", status: "partial" },
      { name: "Substance Abuse Treatment", status: "gap" },
      { name: "Nutrition & Food Access", status: "partial" },
    ],
  },
  {
    district: 2,
    name: "District 2 \u2013 North Central",
    sectors: [
      { name: "Primary Care", status: "covered" },
      { name: "Mental Health", status: "covered" },
      { name: "Dental Care", status: "covered" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "covered" },
      { name: "Maternal & Child Health", status: "covered" },
      { name: "Substance Abuse Treatment", status: "partial" },
      { name: "Nutrition & Food Access", status: "covered" },
    ],
  },
  {
    district: 3,
    name: "District 3 \u2013 Eastside",
    sectors: [
      { name: "Primary Care", status: "partial" },
      { name: "Mental Health", status: "gap" },
      { name: "Dental Care", status: "gap" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "partial" },
      { name: "Maternal & Child Health", status: "gap" },
      { name: "Substance Abuse Treatment", status: "gap" },
      { name: "Nutrition & Food Access", status: "gap" },
    ],
  },
  {
    district: 4,
    name: "District 4 \u2013 West End",
    sectors: [
      { name: "Primary Care", status: "covered" },
      { name: "Mental Health", status: "covered" },
      { name: "Dental Care", status: "covered" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "covered" },
      { name: "Maternal & Child Health", status: "covered" },
      { name: "Substance Abuse Treatment", status: "covered" },
      { name: "Nutrition & Food Access", status: "partial" },
    ],
  },
  {
    district: 5,
    name: "District 5 \u2013 Central / Downtown",
    sectors: [
      { name: "Primary Care", status: "covered" },
      { name: "Mental Health", status: "covered" },
      { name: "Dental Care", status: "partial" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "covered" },
      { name: "Maternal & Child Health", status: "partial" },
      { name: "Substance Abuse Treatment", status: "covered" },
      { name: "Nutrition & Food Access", status: "covered" },
    ],
  },
  {
    district: 6,
    name: "District 6 \u2013 Gateway / South",
    sectors: [
      { name: "Primary Care", status: "partial" },
      { name: "Mental Health", status: "partial" },
      { name: "Dental Care", status: "gap" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "partial" },
      { name: "Maternal & Child Health", status: "gap" },
      { name: "Substance Abuse Treatment", status: "partial" },
      { name: "Nutrition & Food Access", status: "gap" },
    ],
  },
  {
    district: 7,
    name: "District 7 \u2013 East End",
    sectors: [
      { name: "Primary Care", status: "gap" },
      { name: "Mental Health", status: "gap" },
      { name: "Dental Care", status: "gap" },
      { name: "Emergency Services", status: "partial" },
      { name: "Pharmacy Access", status: "gap" },
      { name: "Maternal & Child Health", status: "gap" },
      { name: "Substance Abuse Treatment", status: "gap" },
      { name: "Nutrition & Food Access", status: "gap" },
    ],
  },
  {
    district: 8,
    name: "District 8 \u2013 Southside",
    sectors: [
      { name: "Primary Care", status: "partial" },
      { name: "Mental Health", status: "gap" },
      { name: "Dental Care", status: "gap" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "partial" },
      { name: "Maternal & Child Health", status: "partial" },
      { name: "Substance Abuse Treatment", status: "gap" },
      { name: "Nutrition & Food Access", status: "partial" },
    ],
  },
  {
    district: 9,
    name: "District 9 \u2013 Southwest",
    sectors: [
      { name: "Primary Care", status: "covered" },
      { name: "Mental Health", status: "partial" },
      { name: "Dental Care", status: "partial" },
      { name: "Emergency Services", status: "covered" },
      { name: "Pharmacy Access", status: "covered" },
      { name: "Maternal & Child Health", status: "partial" },
      { name: "Substance Abuse Treatment", status: "partial" },
      { name: "Nutrition & Food Access", status: "covered" },
    ],
  },
];

/** Returns 0–1 coverage score for a district (1 = fully covered, 0 = all gaps) */
export function coverageScore(sectors: HealthSector[]): number {
  const points = sectors.reduce((sum, s) => {
    if (s.status === "covered") return sum + 1;
    if (s.status === "partial") return sum + 0.5;
    return sum;
  }, 0);
  return points / sectors.length;
}

/** Maps a 0–1 score to a hex color: green → amber → red */
export function scoreToColor(score: number): string {
  if (score >= 0.75) return "#16a34a"; // green
  if (score >= 0.5) return "#ca8a04";  // amber
  if (score >= 0.25) return "#ea580c"; // orange
  return "#dc2626";                     // red
}

export function getDistrict(districtNumber: number): DistrictData | undefined {
  return DISTRICTS.find((d) => d.district === districtNumber);
}

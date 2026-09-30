// Employee and Recommendation types - works with both mock data and API data
interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availableHours: number;
}

interface Recommendation {
  employee: Employee;
  roleRequirementId: string;
  totalScore: number;
  skillScore: number;
  availabilityScore: number;
  roleScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
  ineligibilityReasons: string[];
}

// Role display info - handles both short codes and full names
const roleDisplayInfo: Record<string, { name: string; color: string }> = {
  // Short codes (legacy)
  FA: { name: 'Feature Analyst', color: 'purple' },
  UX: { name: 'UX/UI Designer', color: 'pink' },
  FE: { name: 'Frontend Developer', color: 'blue' },
  BE: { name: 'Backend Developer', color: 'green' },
  QE: { name: 'Quality Engineer', color: 'orange' },
  // Full names (API)
  'Feature Analyst': { name: 'Feature Analyst', color: 'purple' },
  'UX/UI Designer': { name: 'UX/UI Designer', color: 'pink' },
  'Frontend Developer': { name: 'Frontend Developer', color: 'blue' },
  'Backend Developer': { name: 'Backend Developer', color: 'green' },
  'Quality Engineer': { name: 'Quality Engineer', color: 'orange' },
};

interface EmployeeCardProps {
  employee: Employee;
  recommendation?: Recommendation;
  isSelected?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
  onRemove?: () => void;
  compact?: boolean;
}

export function EmployeeCard({
  employee,
  recommendation,
  isSelected,
  onClick,
  onSelect,
  onRemove,
  compact = false,
}: EmployeeCardProps) {
  const role = roleDisplayInfo[employee.role] || { name: employee.role, color: 'gray' };
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  if (compact) {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border ${
          isSelected ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{employee.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses[role.color]}`}>
              {role.name}
            </span>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-indigo-50 border-indigo-500 shadow-md'
          : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{employee.name}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[role.color]}`}>
              {role.name}
            </span>
          </div>
        </div>
        {recommendation && (
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">
              {recommendation.totalScore.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">score</p>
          </div>
        )}
      </div>

      {recommendation && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Available</span>
            <span className="font-medium">{employee.availableHours}/40 hrs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(employee.availableHours / 40) * 100}%` }}
            />
          </div>

          {recommendation.matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {recommendation.matchedSkills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded"
                >
                  ✓ {skill}
                </span>
              ))}
              {recommendation.matchedSkills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{recommendation.matchedSkills.length - 3} more
                </span>
              )}
            </div>
          )}

          {!recommendation.isEligible && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              ⚠️ {recommendation.ineligibilityReasons[0]}
            </div>
          )}
        </div>
      )}

      {onSelect && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`mt-3 w-full py-2 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSelected ? 'Remove from Squad' : 'Add to Squad'}
        </button>
      )}
    </div>
  );
}

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

interface EmployeeModalProps {
  employee: Employee;
  recommendation?: Recommendation;
  isSelected?: boolean;
  onClose: () => void;
  onToggleSelect?: () => void;
}

export function EmployeeModal({
  employee,
  recommendation,
  isSelected,
  onClose,
  onToggleSelect,
}: EmployeeModalProps) {
  const role = roleDisplayInfo[employee.role] || { name: employee.role, color: 'gray' };
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl font-semibold">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-sm text-gray-500">{employee.id}</p>
              <span className={`inline-block mt-1 text-sm px-3 py-1 rounded-full ${colorClasses[role.color]}`}>
                {role.name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Eligibility Warning */}
          {recommendation && !recommendation.isEligible && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-800">⚠️ Ineligible for auto-assignment</p>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                {recommendation.ineligibilityReasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => {
                const isMatched = recommendation?.matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`text-sm px-3 py-1 rounded-full ${
                      isMatched
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isMatched && '✓ '}{skill}
                  </span>
                );
              })}
            </div>
            {recommendation?.missingSkills && recommendation.missingSkills.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Missing required skills:</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200"
                    >
                      ✗ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Availability</h3>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                employee.availableHours > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {employee.availableHours > 0 ? '✓ Available' : '✗ Unavailable'}
              </span>
              <span className="text-gray-600">{employee.availableHours}/40 hrs per week</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  employee.availableHours > 20 ? 'bg-green-500' : 
                  employee.availableHours > 0 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${(employee.availableHours / 40) * 100}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">
              {Math.round((employee.availableHours / 40) * 100)}% capacity
            </p>
          </div>

          {/* Score Breakdown */}
          {recommendation && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Fit Score Breakdown</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-indigo-600">
                    {recommendation.totalScore.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/ 100 points</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: `${recommendation.totalScore}%` }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills Match</span>
                    <span className="font-medium">{recommendation.skillScore.toFixed(1)} / 50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className="font-medium">{recommendation.availabilityScore.toFixed(1)} / 30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role Match</span>
                    <span className="font-medium">{recommendation.roleScore.toFixed(1)} / 20</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          {onToggleSelect && (
            <button
              onClick={onToggleSelect}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                isSelected
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSelected ? 'Remove from Squad' : 'Add to Squad'}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRoles,
  getSkillsForRole,
  evaluateSquad,
  createProject,
  Role,
  Skill,
  RecommendedMember,
} from '../api/squadlyApi';
import { EmployeeCard } from '../components/EmployeeCard';
import { EmployeeModal } from '../components/EmployeeModal';

const urgencyOptions = [
  { value: 'HIGH', label: 'High', icon: '🔴' },
  { value: 'MEDIUM', label: 'Medium', icon: '🟡' },
  { value: 'LOW', label: 'Low', icon: '🟢' },
];

interface RoleRequirement {
  id: string;
  roleId: number;
  roleName: string;
  requiredSkillIds: number[];
  requiredSkillNames: string[];
}

// Convert API employee to Employee type for EmployeeCard
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

// Helper to get role ID from API member (handles different field names)
function getMemberRoleId(member: RecommendedMember): number | undefined {
  return member.roleId || member.requestedRoleId || member.forRoleId;
}

export function CreateProjectPage() {
  const navigate = useNavigate();

  // Step state: 'form' or 'matches'
  const [step, setStep] = useState<'form' | 'matches'>('form');

  // Form state
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // API data
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [skillsByRole, setSkillsByRole] = useState<Map<number, Skill[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Role requirements
  const [roleRequirements, setRoleRequirements] = useState<RoleRequirement[]>([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Recommendations and selections
  const [recommendations, setRecommendations] = useState<Map<string, Recommendation[]>>(new Map());
  const [apiRecommendations, setApiRecommendations] = useState<RecommendedMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Map<string, string[]>>(new Map());

  // Modal state
  const [modalEmployee, setModalEmployee] = useState<{
    employee: Employee;
    recommendation?: Recommendation;
    roleReqId?: string;
  } | null>(null);

  // Filter state
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Load roles on mount
  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        const roles = await getRoles();
        setAvailableRoles(roles);

        // Pre-load skills for all roles
        const skillsMap = new Map<number, Skill[]>();
        for (const role of roles) {
          const skills = await getSkillsForRole(role.roleId);
          skillsMap.set(role.roleId, skills);
        }
        setSkillsByRole(skillsMap);
      } catch (err) {
        setError('Failed to load roles and skills');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  // Calculate duration
  const duration = useMemo(() => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Invalid dates';
    const weeks = Math.ceil(days / 7);
    const sprints = Math.ceil(weeks / 2);
    return `${weeks} week${weeks !== 1 ? 's' : ''} (${sprints} sprint${sprints !== 1 ? 's' : ''})`;
  }, [startDate, endDate]);

  // Add role requirement
  const addRole = (role: Role) => {
    const newReq: RoleRequirement = {
      id: `RR-${Date.now()}`,
      roleId: role.roleId,
      roleName: role.roleName,
      requiredSkillIds: [],
      requiredSkillNames: [],
    };
    setRoleRequirements([...roleRequirements, newReq]);
    setShowRoleDropdown(false);
  };

  // Remove role requirement
  const removeRole = (id: string) => {
    setRoleRequirements(roleRequirements.filter((r) => r.id !== id));
    const newRecs = new Map(recommendations);
    newRecs.delete(id);
    setRecommendations(newRecs);
    const newSelected = new Map(selectedMembers);
    newSelected.delete(id);
    setSelectedMembers(newSelected);
  };

  // Toggle skill for a role
  const toggleSkill = (roleReqId: string, skillId: number, skillName: string) => {
    setRoleRequirements(
      roleRequirements.map((r) => {
        if (r.id !== roleReqId) return r;
        const hasSkill = r.requiredSkillIds.includes(skillId);
        return {
          ...r,
          requiredSkillIds: hasSkill
            ? r.requiredSkillIds.filter((id) => id !== skillId)
            : [...r.requiredSkillIds, skillId],
          requiredSkillNames: hasSkill
            ? r.requiredSkillNames.filter((name) => name !== skillName)
            : [...r.requiredSkillNames, skillName],
        };
      })
    );
  };

  // Find squad members - move to step 2
  const findSquadMembers = async () => {
    try {
      setLoading(true);
      
      // Call the evaluate API
      const members = await evaluateSquad({
        urgency,
        startDate,
        endDate,
        roles: roleRequirements.map((req) => ({
          roleId: req.roleId,
          skills: req.requiredSkillIds,
        })),
      });

      setApiRecommendations(members);

      // Group recommendations by role requirement
      const newRecs = new Map<string, Recommendation[]>();
      
      for (const req of roleRequirements) {
        const roleMembers = members.filter(m => getMemberRoleId(m) === req.roleId);
        
        const recs: Recommendation[] = roleMembers.map(m => {
          // Use matchedSkills from API if available, otherwise calculate
          const matchedSkills = m.matchedSkills || m.skills.filter(s => req.requiredSkillNames.includes(s));
          const missingSkills = req.requiredSkillNames.filter(s => !m.skills.includes(s));
          
          return {
            employee: {
              id: m.empId,
              name: m.empName,
              role: m.role,
              skills: m.skills,
              availableHours: m.capacity,
            },
            roleRequirementId: req.id,
            totalScore: m.matchScore,
            skillScore: m.matchScore * 0.5, // Approximation
            availabilityScore: (m.capacity / 40) * 30,
            roleScore: 20,
            matchedSkills,
            missingSkills,
            isEligible: m.availability === 'Available' && missingSkills.length === 0,
            ineligibilityReasons: m.availability === 'Unavailable' 
              ? ['No available capacity'] 
              : missingSkills.length > 0 
                ? [`Missing skills: ${missingSkills.join(', ')}`]
                : [],
          };
        });
        
        newRecs.set(req.id, recs);
      }
      
      setRecommendations(newRecs);
      setStep('matches');
    } catch (err) {
      setError('Failed to find squad members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Go back to form
  const goBackToForm = () => {
    setStep('form');
  };

  // Toggle member selection - now supports multiple per role
  const toggleMember = (roleReqId: string, employeeId: string) => {
    const newSelected = new Map(selectedMembers);
    const currentSelection = newSelected.get(roleReqId) || [];
    
    if (currentSelection.includes(employeeId)) {
      newSelected.set(roleReqId, currentSelection.filter(id => id !== employeeId));
    } else {
      newSelected.set(roleReqId, [...currentSelection, employeeId]);
    }
    
    setSelectedMembers(newSelected);
  };

  // Check if employee is selected for a role
  const isEmployeeSelected = (roleReqId: string, employeeId: string): boolean => {
    const selection = selectedMembers.get(roleReqId) || [];
    return selection.includes(employeeId);
  };

  // Get total selected count
  const getTotalSelectedCount = (): number => {
    let count = 0;
    selectedMembers.forEach((ids) => {
      count += ids.length;
    });
    return count;
  };

  // Get roles with at least one selection
  const getRolesFilledCount = (): number => {
    let count = 0;
    selectedMembers.forEach((ids) => {
      if (ids.length > 0) count++;
    });
    return count;
  };

  // Save project
  const saveProject = async () => {
    try {
      setLoading(true);
      
      // Build project members list
      const projectMembers: { empId: string; roleId: number; matchScore?: number; rationale?: string; selected: boolean }[] = [];
      
      for (const req of roleRequirements) {
        const selectedIds = selectedMembers.get(req.id) || [];
        for (const empId of selectedIds) {
          const apiMember = apiRecommendations.find(m => m.empId === empId && getMemberRoleId(m) === req.roleId);
          projectMembers.push({
            empId,
            roleId: req.roleId,
            matchScore: apiMember?.matchScore,
            rationale: apiMember?.rationale,
            selected: true,
          });
        }
      }

      await createProject({
        projectName,
        projectDescription,
        urgency,
        startDate,
        endDate,
        roles: roleRequirements.map((req) => ({
          roleId: req.roleId,
          skills: req.requiredSkillIds,
        })),
        projectMembers,
      });

      navigate('/');
    } catch (err) {
      setError('Failed to save project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const isFormValid =
    projectName.trim() &&
    projectDescription.trim() &&
    startDate &&
    endDate &&
    new Date(endDate) >= new Date(startDate) &&
    roleRequirements.length > 0 &&
    roleRequirements.every((r) => r.requiredSkillIds.length > 0);

  // Can save if every role has at least one member selected
  const canSave = roleRequirements.every((req) => {
    const selection = selectedMembers.get(req.id) || [];
    return selection.length > 0;
  });

  // Loading state
  if (loading && step === 'form' && availableRoles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading roles and skills...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => { setError(null); window.location.reload(); }} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // STEP 1: Form View
  if (step === 'form') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Project</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Project Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Project Details</h2>

            {/* Project Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={100}
              />
            </div>

            {/* Project Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description *
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe the delivery need..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                maxLength={1000}
              />
            </div>

            {/* Urgency */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {urgencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Duration */}
            {duration && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Expected Duration: </span>
                <span className="font-medium text-gray-900">{duration}</span>
              </div>
            )}
          </div>

          {/* Right Column - Roles and Skills + Button */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Required Roles & Skills</h2>

              {/* Add Role Button */}
              <div className="relative mb-4">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  + Add Role
                </button>
                {showRoleDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {availableRoles.map((role) => (
                      <button
                        key={role.roleId}
                        onClick={() => addRole(role)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{role.roleName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Requirements */}
              {roleRequirements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No roles added yet. Click "Add Role" above.</p>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                  {roleRequirements.map((req) => {
                    const availableSkills = skillsByRole.get(req.roleId) || [];
                    return (
                      <div key={req.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-900">{req.roleName}</span>
                          <button
                            onClick={() => removeRole(req.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Select required skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills.map((skill) => (
                            <button
                              key={skill.skillId}
                              onClick={() => toggleSkill(req.id, skill.skillId, skill.skillName)}
                              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                                req.requiredSkillIds.includes(skill.skillId)
                                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {req.requiredSkillIds.includes(skill.skillId) ? '✓ ' : ''}{skill.skillName}
                            </button>
                          ))}
                        </div>
                        {req.requiredSkillIds.length === 0 && (
                          <p className="text-amber-600 text-sm mt-2">⚠️ Select at least one skill</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Button under column 2 */}
            <button
              onClick={findSquadMembers}
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                isFormValid && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Finding...' : '🔍 Find Squad Members'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Matches View
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with project info */}
      <div className="mb-6">
        <button
          onClick={goBackToForm}
          className="text-indigo-600 hover:text-indigo-800 text-sm mb-2 inline-flex items-center"
        >
          ← Back to Project Details
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{projectName}</h1>
        <p className="text-gray-600 mt-1">{projectDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Squad Matches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Squad Matches</h2>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-lg"
            >
              <option value="ALL">All Roles</option>
              {roleRequirements.map((req) => (
                <option key={req.id} value={req.roleName}>{req.roleName}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500 mb-4">Click on employees to view details. Select multiple people per role.</p>

          <div className="space-y-6 max-h-[600px] overflow-y-auto">
            {roleRequirements
              .filter((req) => filterRole === 'ALL' || req.roleName === filterRole)
              .map((req) => {
                const recs = recommendations.get(req.id) || [];
                const selectedIds = selectedMembers.get(req.id) || [];
                return (
                  <div key={req.id}>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      {req.roleName}
                      <span className="text-sm text-gray-400 font-normal">({recs.length} matches)</span>
                      {selectedIds.length > 0 && (
                        <span className="text-green-600 text-sm">✓ {selectedIds.length} selected</span>
                      )}
                    </h3>
                    <div className="space-y-3">
                      {recs.slice(0, 10).map((rec) => (
                        <EmployeeCard
                          key={rec.employee.id}
                          employee={rec.employee}
                          recommendation={rec}
                          isSelected={isEmployeeSelected(req.id, rec.employee.id)}
                          onClick={() => setModalEmployee({ employee: rec.employee, recommendation: rec, roleReqId: req.id })}
                          onSelect={() => toggleMember(req.id, rec.employee.id)}
                        />
                      ))}
                      {recs.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No matches found for this role</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Column - Selected Members + Buttons */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Selected Members
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({getTotalSelectedCount()} people, {getRolesFilledCount()}/{roleRequirements.length} roles filled)
              </span>
            </h2>

            {/* Progress indicator */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${(getRolesFilledCount() / roleRequirements.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {roleRequirements.map((req) => {
                const employeeIds = selectedMembers.get(req.id) || [];
                const recs = recommendations.get(req.id) || [];
                const employees = employeeIds.map(id => recs.find(r => r.employee.id === id)?.employee).filter(Boolean) as Employee[];
                
                return (
                  <div key={req.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{req.roleName}</span>
                      {employees.length > 0 ? (
                        <span className="text-green-600 text-sm">✓ {employees.length} selected</span>
                      ) : (
                        <span className="text-amber-500 text-sm">○ Unfilled</span>
                      )}
                    </div>
                    {employees.length > 0 ? (
                      <div className="space-y-2">
                        {employees.map((employee) => {
                          const recommendation = recs.find(r => r.employee.id === employee.id);
                          return (
                            <div key={employee.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-indigo-600 font-medium text-sm">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                                  {recommendation && (
                                    <p className="text-xs text-gray-500">Score: {recommendation.totalScore.toFixed(1)}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => toggleMember(req.id, employee.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">Select candidates from Squad Matches</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons under column 2 */}
          <div className="flex gap-4">
            <button
              onClick={goBackToForm}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              ← Edit Project
            </button>
            <button
              onClick={saveProject}
              disabled={!canSave || loading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                canSave && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : '💾 Save Project'}
            </button>
          </div>
        </div>
      </div>

      {/* Employee Modal */}
      {modalEmployee && (
        <EmployeeModal
          employee={modalEmployee.employee}
          recommendation={modalEmployee.recommendation}
          isSelected={modalEmployee.roleReqId ? isEmployeeSelected(modalEmployee.roleReqId, modalEmployee.employee.id) : false}
          onClose={() => setModalEmployee(null)}
          onToggleSelect={
            modalEmployee.roleReqId
              ? () => {
                  toggleMember(modalEmployee.roleReqId!, modalEmployee.employee.id);
                  setModalEmployee(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

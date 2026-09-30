import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProject, ProjectDetail, RecommendedMember } from '../api/squadlyApi';
import { EmployeeCard } from '../components/EmployeeCard';
import { EmployeeModal } from '../components/EmployeeModal';
import { exportProjectToPdf } from '../utils/exportPdf';

const urgencyColors = {
  HIGH: 'bg-red-100 text-red-800 border-red-200',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
  LOW: 'bg-green-100 text-green-800 border-green-200',
};

const urgencyIcons = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
};

// Convert API member to Employee type for EmployeeCard
interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availableHours: number;
}

function memberToEmployee(member: RecommendedMember): Employee {
  return {
    id: member.empId,
    name: member.empName,
    role: member.role,
    skills: member.skills,
    availableHours: member.capacity,
  };
}

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const data = await getProject(parseInt(projectId));
        setProject(data);
      } catch (err) {
        setError('Project not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId]);

  const handleExport = async () => {
    if (!project) return;
    setExporting(true);
    try {
      exportProjectToPdf(project);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <span className="text-6xl">🔍</span>
          <p className="text-gray-500 mt-4">{error || 'Project not found'}</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate duration
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(days / 7);
  const sprints = Math.ceil(weeks / 2);
  const duration = `${weeks} week${weeks !== 1 ? 's' : ''} (${sprints} sprint${sprints !== 1 ? 's' : ''})`;

  const urgency = project.urgency as keyof typeof urgencyColors;
  const isCompleted = project.status === 'Completed';

  // Group members by role
  const membersByRole = new Map<string, RecommendedMember[]>();
  for (const member of project.projectMembers) {
    const role = member.role;
    if (!membersByRole.has(role)) {
      membersByRole.set(role, []);
    }
    membersByRole.get(role)!.push(member);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Home</Link>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-gray-600">Project Details</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Project Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
              <span className={`text-sm px-3 py-1 rounded-full border ${urgencyColors[urgency] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {urgencyIcons[urgency] || '⚪'} {project.urgency}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{project.projectDescription || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Start Date</h3>
                  <p className="text-gray-600">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">End Date</h3>
                  <p className="text-gray-600">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Duration: </span>
                <span className="font-medium text-gray-900">{duration}</span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  isCompleted ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isCompleted ? '✓ Completed' : '○ Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isCompleted && (
              <Link
                to={`/edit/${project.projectId}`}
                className="flex-1 py-3 bg-indigo-600 text-white text-center rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                ✏️ Edit Project
              </Link>
            )}
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`${!isCompleted ? 'flex-1' : 'w-full'} py-3 bg-gray-100 text-gray-700 text-center rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50`}
            >
              {exporting ? '⏳ Exporting...' : '📄 Export PDF'}
            </button>
          </div>
        </div>

        {/* Right Panel - Squad Members */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Squad Members
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({project.projectMembers.length} assigned)
              </span>
            </h2>

            {project.projectMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No squad members assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {Array.from(membersByRole.entries()).map(([role, members]) => (
                  <div key={role}>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      {role}
                      <span className="text-gray-400 font-normal ml-1">({members.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {members.map((member) => {
                        const employee = memberToEmployee(member);
                        return (
                          <EmployeeCard
                            key={member.empId}
                            employee={employee}
                            isSelected
                            onClick={() => setModalEmployee(employee)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Potential Members (if any) */}
          {project.potentialMembers && project.potentialMembers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Potential Members
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({project.potentialMembers.length} candidates)
                </span>
              </h2>
              <div className="space-y-2">
                {project.potentialMembers.slice(0, 5).map((member) => {
                  const employee = memberToEmployee(member);
                  return (
                    <EmployeeCard
                      key={member.empId}
                      employee={employee}
                      onClick={() => setModalEmployee(employee)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Reuse Button */}
          {isCompleted && (
            <Link
              to={`/create?reuse=${project.projectId}`}
              className="block w-full py-3 bg-gray-100 text-gray-700 text-center rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
            >
              ♻️ Reuse Requirements for New Project
            </Link>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      {modalEmployee && (
        <EmployeeModal
          employee={modalEmployee}
          onClose={() => setModalEmployee(null)}
        />
      )}
    </div>
  );
}

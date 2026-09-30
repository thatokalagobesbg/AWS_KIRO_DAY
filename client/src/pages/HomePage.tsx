import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjects, getProject, ProjectSummary } from '../api/squadlyApi';
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

// Export project as PDF
async function exportProject(projectId: number) {
  try {
    const projectDetail = await getProject(projectId);
    exportProjectToPdf(projectDetail);
  } catch (err) {
    console.error('Failed to export project:', err);
    alert('Failed to export project');
  }
}

export function HomePage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const currentProjects = projects.filter(p => p.status === 'Draft' || p.status === 'Active');
  const pastProjects = projects.filter(p => p.status === 'Completed');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 mt-2">Assemble your delivery squads</p>
      </div>

      {/* Create New Project Card */}
      <Link
        to="/create"
        className="block mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl">➕</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Create New Project</h2>
            <p className="text-indigo-100 mt-1">
              Start assembling your squad for a new delivery need
            </p>
          </div>
        </div>
      </Link>

      {/* Current Projects */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          CURRENT
        </h2>
        {currentProjects.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
            No current projects. Create a new one to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {currentProjects.map((project) => (
              <ProjectCard key={project.projectId} project={project} onExport={exportProject} />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <hr className="border-gray-200 mb-8" />

      {/* Past Projects */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          PAST PROJECTS
        </h2>
        {pastProjects.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
            No past projects yet.
          </div>
        ) : (
          <div className="space-y-3">
            {pastProjects.map((project) => (
              <ProjectCard key={project.projectId} project={project} onExport={exportProject} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project, onExport }: { project: ProjectSummary; onExport: (id: number) => void }) {
  const urgency = project.urgency as keyof typeof urgencyColors;
  const [exporting, setExporting] = useState(false);

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExporting(true);
    try {
      await onExport(project.projectId);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
      <div className="flex justify-between items-start">
        <Link to={`/project/${project.projectId}`} className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.projectName}</h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${urgencyColors[urgency] || 'bg-gray-100 text-gray-600'}`}>
              {urgencyIcons[urgency] || '⚪'} {project.urgency}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>📅 {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              project.status === 'Active' ? 'bg-green-100 text-green-700' : 
              project.status === 'Draft' ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {project.status}
            </span>
          </div>
        </Link>
        <div className="ml-4 flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
            title="Export to PDF"
          >
            {exporting ? '⏳' : '📄'} Export
          </button>
          <Link 
            to={`/project/${project.projectId}`}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <span className="text-sm font-medium">View</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

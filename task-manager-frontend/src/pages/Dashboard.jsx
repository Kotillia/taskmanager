import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

import Sidebar from '../components/dashboard/Sidebar';
import TaskList from '../components/dashboard/TaskList';
import TeamSection from '../components/dashboard/TeamSection';
import Analytics from '../components/dashboard/Analytics';     
import QuickStats from '../components/dashboard/QuickStats';   
import TaskModal from '../components/dashboard/TaskModal';
import ProjectModal from '../components/dashboard/ProjectModal';
import BlockModal from '../components/dashboard/BlockModal';
import EditTaskModal from '../components/dashboard/EditTaskModal';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks'); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modals, setModals] = useState({ project: false, task: false, block: false });
  const [blockingTaskId, setBlockingTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    type: '',
    id: null,
    title: '',
    message: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserRole = projectMembers.find(m => Number(m.user.id) === Number(user?.id))?.role;

  const refreshProjectData = async (projectId) => {

    if (!projectId) return; 

    setIsLoading(true);
    try {
      
      const [tRes, mRes] = await Promise.all([
       api.get(`/tasks?projectId=${projectId}`),
       api.get(`/projects/${projectId}/members`)
      ]);
     setTasks(tRes.data);
     setProjectMembers(mRes.data);
   } catch (e) {
     console.error("Error loading project data", e);
   } finally {
    setIsLoading(false);
   }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/my');
        setProjects(res.data);
        if (res.data.length > 0 && !selectedProject) {
          setSelectedProject(res.data[0]);
        }
      } catch (e) {
        console.error("Error fetching projects", e);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject?.id) {
      refreshProjectData(selectedProject.id);
    } else {
      setTasks([]);
      setProjectMembers([]);
    }
  }, [selectedProject]);

  const openDeleteTaskConfirm = (taskId) => {
    setConfirmModal({
      isOpen: true,
      type: 'task',
      id: taskId,
      title: 'Delete Task',
      message: 'Are you sure you want to remove this task?'
    });
  };

  const handleUpdateTask = async (taskId, updatedData) => {
  try {
    await api.put(`/tasks/${taskId}`, updatedData);
    setIsEditModalOpen(false);
    refreshProjectData(selectedProject.id);
  } catch (err) {
    toast.error("Błąd podczas aktualizacji zadania");
  }
  };

  const handleCreateProject = async (name) => {
    try {
      await api.post('/projects', { name });
      setModals({ ...modals, project: false });
      const res = await api.get('/projects/my'); 
      setProjects(res.data);
    } catch (e) {
      toast.error("Failed to create project");
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', { ...taskData, projectId: selectedProject.id });
      setModals({ ...modals, task: false });
      refreshProjectData(selectedProject.id);
    } catch (e) {
      toast.error("Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    if (status === 'BLOCKED') {
      setBlockingTaskId(taskId);
      setModals({ ...modals, block: true });
      return;
    }
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      refreshProjectData(selectedProject.id);
    } catch (e) {
      console.error("Error changing status");
    }
  };

  const handleConfirmBlock = async (reason) => {
    try {
      await api.patch(`/tasks/${blockingTaskId}/status`, { 
        status: 'BLOCKED', 
        blockReason: reason 
      });
      setModals({ ...modals, block: false });
      refreshProjectData(selectedProject.id);
    } catch (e) {
      toast.error("Failed to block task");
    }
  };

  const handleAssignUsers = async (taskId, userIds) => {
    try {
      await api.patch(`/tasks/${taskId}/assign`, { userIds });
      refreshProjectData(selectedProject.id);
    } catch (e) {
      toast.error("Error assigning users");
    }
  };

  const openDeleteProjectConfirm = () => {
    setConfirmModal({
      isOpen: true,
      type: 'project',
      id: selectedProject.id,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${selectedProject.name}"? All tasks and data will be permanently removed.`
    });
  };

  const handleFinalDelete = async () => {
    setIsDeleting(true);
    try {
      if (confirmModal.type === 'project') {
        await api.delete(`/projects/${confirmModal.id}`);
        
        setSelectedProject(null);
        const res = await api.get('/projects/my');
        setProjects(res.data);
        if (res.data.length > 0) {
        setSelectedProject(res.data[0]);
        }
        toast.success("Project deleted");
      } else if (confirmModal.type === 'task') {
        await api.delete(`/tasks/${confirmModal.id}`);
        toast.success("Task deleted");
        refreshProjectData(selectedProject.id);
      }
    } catch (e) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };  

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      <Sidebar 
        projects={projects} 
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onOpenProjectModal={() => setModals({ ...modals, project: true })}
        user={user}
        onLogout={logout}
      />

      
      <main className="flex-1 p-10 overflow-y-auto">
        
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              {selectedProject?.name || "No project selected"}
              {currentUserRole === 'OWNER' && selectedProject && (
                <button 
                  onClick={openDeleteProjectConfirm}
                  className="p-2 text-slate-300 hover:text-red-500 transition"
                  title="Delete Project"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </h1>
            <p className="text-slate-500 font-medium italic">Project management workspace</p>
          </div>
          {selectedProject && activeTab === 'tasks' && currentUserRole !== 'WORKER' && (
            <button 
              onClick={() => setModals({ ...modals, task: true })}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 active:scale-95"
            >
              <Plus size={20} /> New Task
            </button>
          )}
        </header>

        
        <div className="flex gap-8 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'tasks' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}
          >
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'team' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}
          >
            Team
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'stats' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400'}`}
          >
            Analytics
          </button>
        </div>

        
        <div className="mt-4" key={activeTab}>
  
          {activeTab === 'tasks' && (
            <div className="animate-page-entry"> {/* Nowa klasa */}
              <QuickStats tasks={tasks} />
                {isLoading ? (
                  <Spinner />
                ) : (
                  <TaskList 
                    tasks={tasks} 
                    projectMembers={projectMembers}
                    onStatusChange={handleStatusChange} 
                    onAssignUsers={handleAssignUsers}
                    onDeleteTask={openDeleteTaskConfirm}
                    onEditTask={(task) => {
                      setTaskToEdit(task);
                      setIsEditModalOpen(true);
                    }}
                    role={currentUserRole}
                  />
               )}
            </div>
          )}

  {activeTab === 'team' && (
    <div className="animate-page-entry">
      <TeamSection projectId={selectedProject?.id} />
    </div>
  )}

  {activeTab === 'stats' && (
    <div className="animate-page-entry">
      <Analytics projectId={selectedProject?.id} />
    </div>
  )}
</div>
        </main>

     
      <ProjectModal 
        isOpen={modals.project} 
        onClose={() => setModals({ ...modals, project: false })} 
        onCreate={handleCreateProject} 
      />

      <TaskModal 
        isOpen={modals.task} 
        onClose={() => setModals({ ...modals, task: false })}
        onCreate={handleCreateTask}
        selectedProject={selectedProject}
      />

      <BlockModal 
        isOpen={modals.block} 
        onClose={() => setModals({ ...modals, block: false })} 
        onConfirm={handleConfirmBlock} 
      />

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={taskToEdit}
        onUpdate={handleUpdateTask}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleFinalDelete}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
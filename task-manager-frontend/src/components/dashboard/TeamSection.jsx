  import React, { useState, useEffect } from 'react';
  import api from '../../api/axios';
  import { useAuth } from '../../context/AuthContext';
  import { Users, Mail, Shield, UserPlus, Trash2, Plus, X } from 'lucide-react';
  import Modal from '../Modal';
  import toast from 'react-hot-toast';
  import ConfirmModal from '../ConfirmModal';
  import Spinner from '../Spinner';

  const TeamSection = ({ projectId }) => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'WORKER' });
    

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null); 
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {

      setIsLoading(true);

      try {
        const res = await api.get(`/projects/${projectId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.error("Error fetching members", err);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (projectId) fetchMembers();
    }, [projectId]);

    const currentUserRole = members.find(m => Number(m.user.id) === Number(user?.id))?.role;

    const handleInvite = async (e) => {
      e.preventDefault();
      try {
        await api.post(`/projects/${projectId}/invite`, inviteData);
        toast.success("Invitation sent successfully!");
        setIsInviteModalOpen(false);
        setInviteData({ email: '', role: 'WORKER' });
        fetchMembers();
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to send invitation");
      }
    };


    const openDeleteMemberModal = (id, username) => {
      setMemberToDelete({ id, username });
      setIsConfirmOpen(true);
    };


    const handleConfirmDelete = async () => {
      if (!memberToDelete) return;
      setIsDeleting(true);
      try {
        await api.delete(`/projects/${projectId}/members/${memberToDelete.id}`);
        toast.success(`${memberToDelete.username} removed from project`);
        fetchMembers();
      } catch (err) {
        toast.error("Failed to remove member");
      } finally {
        setIsDeleting(false);
        setIsConfirmOpen(false);
        setMemberToDelete(null);
      }
    };
    
    const handleRoleChange = async (targetUserId, newRole) => {
      try {
        await api.patch(`/projects/${projectId}/members/${targetUserId}/role`, { role: newRole });
        toast.success("Role updated");
        fetchMembers();
      } catch (err) {
        toast.error(err.response?.data?.error || "Error updating role");
      }
    };

    if (isLoading) return <Spinner />;

    return (
      <div className="animate-page-entry">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Users className="text-indigo-600" size={28} /> Project Team
            </h3>
            <p className="text-slate-400 text-sm font-medium">Manage permissions and collaborators</p>
          </div>
          
          {currentUserRole === 'OWNER' && (
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95"
            >
              <UserPlus size={20} /> Invite
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition group relative">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                  {member.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{member.user.username}</p>
                  
                  {currentUserRole === 'OWNER' && Number(member.user.id) !== Number(user.id) ? (
                    <select 
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                      className="mt-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg outline-none cursor-pointer hover:bg-indigo-100 transition"
                    >
                      <option value="WORKER">Worker</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Shield size={10} /> {member.role}
                    </p>
                  )}
                </div>

                {currentUserRole === 'OWNER' && Number(member.user.id) !== Number(user.id) && (
                  <button 
                    onClick={() => openDeleteMemberModal(member.user.id, member.user.username)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isInviteModalOpen} title="Invite new member" onClose={() => setIsInviteModalOpen(false)}>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Email Address</label>
              <input 
                type="email"
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="colleague@example.com"
                value={inviteData.email}
                onChange={e => setInviteData({...inviteData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Initial Role</label>
              <select 
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                value={inviteData.role}
                onChange={e => setInviteData({...inviteData, role: e.target.value})}
              >
                <option value="WORKER">Worker</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg mt-2">
              Send Invitation
            </button>
          </form>
        </Modal>

        <ConfirmModal 
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Remove Team Member"
          message={`Are you sure you want to remove ${memberToDelete?.username} from this project? They will lose access to all tasks.`}
          isLoading={isDeleting}
        />
      </div>
    );
  };

  export default TeamSection;
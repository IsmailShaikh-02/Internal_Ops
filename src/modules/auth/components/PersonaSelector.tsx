import React from 'react';
import { MOCK_USERS } from '@/shared/constants/mockUsers';
import type { PlatformUser } from '@/shared/types/auth.types';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';

interface PersonaSelectorProps {
  onSelect: (user: PlatformUser) => void;
  selectedUser: PlatformUser | null;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect, selectedUser }) => {
  const { user: currentUser } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Platform Owner':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Super Admin':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Finance Admin':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Support Admin':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      case 'Auditor':
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="w-full space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <ShieldCheck className="size-3.5 text-zinc-400" />
          Demo Mode Persona Switcher
        </span>
        {currentUser && (
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
            <UserCheck className="size-3 text-emerald-500" />
            Active: {currentUser.role}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {Object.entries(MOCK_USERS).map(([key, mockUser]) => {
          const isSelected = selectedUser?.role === mockUser.role || (!selectedUser && currentUser?.role === mockUser.role);
          const roleStyle = getRoleColor(mockUser.role);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(mockUser)}
              className={`flex items-start gap-3 rounded-lg border p-2.5 text-left transition-all duration-200 hover:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-700 select-none ${
                isSelected
                  ? 'border-zinc-500 bg-zinc-900/60 shadow-md shadow-black/40 scale-[1.01]'
                  : 'border-zinc-800/60 bg-zinc-950/20 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={mockUser.avatarUrl}
                alt={mockUser.name}
                className="size-8 rounded-full border border-zinc-800 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-200 truncate">{mockUser.name}</p>
                <p className="text-[10px] text-zinc-500 truncate mb-1">{mockUser.email}</p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border font-mono ${roleStyle}`}>
                  {mockUser.role}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;

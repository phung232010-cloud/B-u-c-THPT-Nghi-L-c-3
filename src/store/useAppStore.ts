import { create } from 'zustand';

export interface Candidate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  voteCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  hasVoted: boolean;
  votedCandidateId?: string;
  createdAt: string;
}

export interface VoteLog {
  action: string;
  performedBy: string;
  metadata: string;
  timestamp: string;
}

export interface AdminKey {
  key: string;
  used: boolean;
  usedBy?: string;
  createdAt: string;
}

const ROOT_KEY = 'THANGCYRUS'; // KHÔNG GIỚI HẠN

interface AppState {
  user: User | null;
  candidates: Candidate[];
  logs: VoteLog[];
  adminKeys: AdminKey[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => boolean;
  logout: () => void;

  register: (
    name: string,
    email: string,
    password: string,
    adminKey?: string
  ) => boolean;

  createAdminKey: () => string;

  vote: (candidateId: string) => boolean;
  unvote: () => boolean;

  addCandidate: (name: string, description: string, imageUrl: string) => void;
  deleteCandidate: (id: string) => void;
  resetVotes: () => void;
}

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Nguyễn Văn An', description: '', imageUrl: '', voteCount: 245, createdAt: '2024-01-15' },
  { id: '2', name: 'Trần Thị Bình', description: '', imageUrl: '', voteCount: 198, createdAt: '2024-01-15' },
];

const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@vote.vn',
    password: 'admin123',
    user: {
      id: 'u1',
      name: 'Root Admin',
      email: 'admin@vote.vn',
      role: 'superadmin',
      hasVoted: false,
      createdAt: '2024-01-01',
    },
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  candidates: [...mockCandidates],
  logs: [
    {
      action: 'SYSTEM_START',
      performedBy: 'system',
      metadata: 'Hệ thống khởi động',
      timestamp: new Date().toISOString(),
    },
  ],
  adminKeys: [],
  isAuthenticated: false,

  login: (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      set({ user: { ...found.user }, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  register: (name, email, password, adminKey) => {
    if (mockUsers.find((u) => u.email === email)) return false;

    let role: 'user' | 'admin' | 'superadmin' = 'user';

    // ROOT KEY (không giới hạn)
    if (adminKey === ROOT_KEY) {
      role = 'superadmin';
    }
    // Admin key tạo trong hệ thống
    else if (adminKey) {
      const validKey = get().adminKeys.find(
        (k) => k.key === adminKey && !k.used
      );

      if (validKey) {
        role = 'admin';

        // đánh dấu đã dùng
        set({
          adminKeys: get().adminKeys.map((k) =>
            k.key === adminKey
              ? { ...k, used: true, usedBy: email }
              : k
          ),
        });
      }
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role,
      hasVoted: false,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push({ email, password, user: newUser });

    set({ user: newUser, isAuthenticated: true });

    return true;
  },

  createAdminKey: () => {
    const newKey = `ADMIN-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const keyObj: AdminKey = {
      key: newKey,
      used: false,
      createdAt: new Date().toISOString(),
    };

    set({
      adminKeys: [...get().adminKeys, keyObj],
      logs: [
        ...get().logs,
        {
          action: 'CREATE_ADMIN_KEY',
          performedBy: get().user?.name || 'unknown',
          metadata: `Created key ${newKey}`,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return newKey;
  },

  vote: (candidateId) => {
    const { user, candidates } = get();
    if (!user || user.hasVoted) return false;

    set({
      user: { ...user, hasVoted: true, votedCandidateId: candidateId },
      candidates: candidates.map((c) =>
        c.id === candidateId
          ? { ...c, voteCount: c.voteCount + 1 }
          : c
      ),
    });

    return true;
  },

  unvote: () => {
    const { user, candidates } = get();
    if (!user || !user.hasVoted || !user.votedCandidateId) return false;

    const id = user.votedCandidateId;

    set({
      user: { ...user, hasVoted: false, votedCandidateId: undefined },
      candidates: candidates.map((c) =>
        c.id === id
          ? { ...c, voteCount: Math.max(0, c.voteCount - 1) }
          : c
      ),
    });

    return true;
  },

  addCandidate: (name, description, imageUrl) => {
    const newCandidate: Candidate = {
      id: `c${Date.now()}`,
      name,
      description,
      imageUrl,
      voteCount: 0,
      createdAt: new Date().toISOString(),
    };

    set({ candidates: [...get().candidates, newCandidate] });
  },

  deleteCandidate: (id) => {
    set({
      candidates: get().candidates.filter((c) => c.id !== id),
    });
  },

  resetVotes: () => {
    set({
      candidates: get().candidates.map((c) => ({
        ...c,
        voteCount: 0,
      })),
    });
  },
}));
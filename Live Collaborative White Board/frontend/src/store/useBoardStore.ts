import { create } from 'zustand';
import type { ToolType, CanvasProperties, Project, User } from '../types';
import { Socket } from 'socket.io-client';

export interface OnlineUser {
  socketId: string;
  userId: string;
  username: string;
  status: 'online' | 'busy';
  partnerId?: string;
  roomId?: string;
}

export interface CollabRequest {
  senderSocketId: string;
  senderUserId: string;
  username: string;
}

export interface IncomingRequest {
  fromId: string;
  fromName: string;
}

interface BoardState {
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
  properties: CanvasProperties;
  updateProperties: (props: Partial<CanvasProperties>) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  currentUser: { name: string; color: string } | null;
  setCurrentUser: (user: { name: string; color: string } | null) => void;
  userId: string;
  setUserId: (id: string) => void;
  onlineUsers: OnlineUser[];
  setOnlineUsers: (users: OnlineUser[]) => void;
  collabPartner: { userId: string; username: string; socketId: string } | null;
  setCollabPartner: (partner: { userId: string; username: string; socketId: string } | null) => void;
  collabRoomId: string | null;
  setCollabRoomId: (roomId: string | null) => void;
  collabRequest: CollabRequest | null;
  setCollabRequest: (request: CollabRequest | null) => void;
  collabStatus: 'idle' | 'requested' | 'connected';
  setCollabStatus: (status: 'idle' | 'requested' | 'connected') => void;
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  roomUsers: Record<string, User>;
  setRoomUsers: (users: Record<string, User>) => void;
  updateUserCursor: (id: string, x: number, y: number) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  
  // New Request-Based Collaboration state variables and actions
  incomingRequests: IncomingRequest[];
  setIncomingRequests: (requests: IncomingRequest[]) => void;
  sentRequests: Record<string, boolean>; // map of target socketId -> isPending
  setSentRequestStatus: (targetSocketId: string, isPending: boolean) => void;
  clearSentRequests: () => void;
  acceptedUserSocketId: string | null;
  setAcceptedUserSocketId: (id: string | null) => void;
}

const defaultProperties: CanvasProperties = {
  strokeColor: '#000000',
  fillColor: 'transparent',
  textColor: '#000000',
  fontFamily: 'Inter',
  fontSize: 24,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: 'left',
  brushSize: 5,
  opacity: 100,
  strokeWidth: 2,
  borderStyle: 'solid',
  shadowEnabled: false,
};

export const useBoardStore = create<BoardState>((set) => ({
  currentTool: 'select',
  setCurrentTool: (tool) => set({ currentTool: tool }),
  properties: defaultProperties,
  updateProperties: (props) => set((state) => ({ properties: { ...state.properties, ...props } })),
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  userId: '',
  setUserId: (id) => set({ userId: id }),
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  collabPartner: null,
  setCollabPartner: (partner) => set({ collabPartner: partner }),
  collabRoomId: null,
  setCollabRoomId: (roomId) => set({ collabRoomId: roomId }),
  collabRequest: null,
  setCollabRequest: (request) => set({ collabRequest: request }),
  collabStatus: 'idle',
  setCollabStatus: (status) => set({ collabStatus: status }),
  socket: null,
  setSocket: (socket) => set({ socket }),
  roomUsers: {},
  setRoomUsers: (users) => set({ roomUsers: users }),
  updateUserCursor: (id, x, y) => set((state) => {
    if (state.roomUsers[id]) {
      return {
        roomUsers: {
          ...state.roomUsers,
          [id]: { ...state.roomUsers[id], x, y }
        }
      };
    }
    return {};
  }),
  addUser: (user) => set((state) => ({
    roomUsers: { ...state.roomUsers, [user.id]: user }
  })),
  removeUser: (id) => set((state) => {
    const updatedUsers = { ...state.roomUsers };
    delete updatedUsers[id];
    return { roomUsers: updatedUsers };
  }),
  connectionStatus: 'disconnected',
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),

  // New states initialization
  incomingRequests: [],
  setIncomingRequests: (requests) => set({ incomingRequests: requests }),
  sentRequests: {},
  setSentRequestStatus: (targetSocketId, isPending) => set((state) => ({
    sentRequests: { ...state.sentRequests, [targetSocketId]: isPending }
  })),
  clearSentRequests: () => set({ sentRequests: {} }),
  acceptedUserSocketId: null,
  setAcceptedUserSocketId: (id) => set({ acceptedUserSocketId: id }),
}));

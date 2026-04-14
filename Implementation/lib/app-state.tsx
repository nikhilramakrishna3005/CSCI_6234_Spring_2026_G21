"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoMeetups, demoNotifications, demoUsers } from "@/data/mock-data";
import type {
  Meetup,
  Notification,
  NotificationType,
  Participation,
  ParticipationStatus,
  User,
} from "@/lib/types";

type AppStateContextType = {
  users: User[];
  meetups: Meetup[];
  notifications: Notification[];
  currentUser: User | null;
  nearbyOnlineUsers: User[];
  activeMeetups: Meetup[];
  upcomingMeetups: Meetup[];
  pendingInvites: Meetup[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (payload: {
    name: string;
    email: string;
    availability: User["availability"];
  }) => boolean;
  upsertPreference: (key: string, value: string) => boolean;
  createMeetup: (payload: {
    title: string;
    activityType: Meetup["activityType"];
    time: string;
    capacity: number;
    description: string;
    locationLabel: string;
  }) => Meetup | null;
  editMeetup: (
    meetupId: string,
    payload: { title: string; time: string; capacity: number; description: string }
  ) => Meetup | null;
  manageParticipants: (
    meetupId: string,
    userId: string,
    action: "INVITE" | "APPROVE"
  ) => Meetup | null;
  respondToRequest: (
    meetupId: string,
    userId: string,
    choice: "ACCEPT" | "DECLINE"
  ) => Meetup | null;
  sendUpdateNotification: (meetupId: string, message: string) => void;
  getMeetupById: (meetupId: string) => Meetup | undefined;
  getUserById: (userId: string) => User | undefined;
};

const AppStateContext = createContext<AppStateContextType | null>(null);

const STORAGE_KEYS = {
  users: "micromeet_users",
  meetups: "micromeet_meetups",
  notifications: "micromeet_notifications",
  currentUserId: "micromeet_current_user_id",
};

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [meetups, setMeetups] = useState<Meetup[]>(demoMeetups);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedUsers = window.localStorage.getItem(STORAGE_KEYS.users);
    const storedMeetups = window.localStorage.getItem(STORAGE_KEYS.meetups);
    const storedNotifications = window.localStorage.getItem(STORAGE_KEYS.notifications);
    const storedCurrentUserId = window.localStorage.getItem(STORAGE_KEYS.currentUserId);

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedMeetups) setMeetups(JSON.parse(storedMeetups));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    if (storedCurrentUserId) setCurrentUserId(storedCurrentUserId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    window.localStorage.setItem(STORAGE_KEYS.meetups, JSON.stringify(meetups));
    window.localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    if (currentUserId) {
      window.localStorage.setItem(STORAGE_KEYS.currentUserId, currentUserId);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.currentUserId);
    }
  }, [users, meetups, notifications, currentUserId]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const login = useCallback(
    (username: string, password: string) => {
      const match = users.find(
        (user) => user.username === username.trim() && user.password === password
      );
      if (!match) {
        return false;
      }
      setCurrentUserId(match.id);
      return true;
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  const updateProfile = useCallback(
    (payload: { name: string; email: string; availability: User["availability"] }) => {
      if (!currentUserId) return false;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === currentUserId
            ? {
                ...user,
                name: payload.name.trim() || user.name,
                email: payload.email.trim() || user.email,
                availability: payload.availability,
              }
            : user
        )
      );
      return true;
    },
    [currentUserId]
  );

  const upsertPreference = useCallback(
    (key: string, value: string) => {
      if (!currentUserId || !key.trim()) return false;
      setUsers((prev) =>
        prev.map((user) => {
          if (user.id !== currentUserId) return user;
          const existing = user.preferences.find((pref) => pref.key === key.trim());
          if (existing) {
            return {
              ...user,
              preferences: user.preferences.map((pref) =>
                pref.key === key.trim() ? { ...pref, value: value.trim() } : pref
              ),
            };
          }
          return {
            ...user,
            preferences: [
              ...user.preferences,
              { id: `pref-${Date.now()}`, key: key.trim(), value: value.trim() },
            ],
          };
        })
      );
      return true;
    },
    [currentUserId]
  );

  const addNotification = useCallback((type: NotificationType, message: string) => {
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type,
        message,
        createdAt: "just now",
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const createMeetup = useCallback(
    (payload: {
      title: string;
      activityType: Meetup["activityType"];
      time: string;
      capacity: number;
      description: string;
      locationLabel: string;
    }) => {
      if (!currentUserId) return null;
      const newMeetup: Meetup = {
        id: `meetup-${Date.now()}`,
        title: payload.title.trim(),
        activityType: payload.activityType,
        time: payload.time.trim(),
        capacity: payload.capacity,
        description: payload.description.trim(),
        hostUserId: currentUserId,
        location: { label: payload.locationLabel.trim(), city: "Atlanta" },
        participants: [
          {
            id: `part-${Date.now()}`,
            userId: currentUserId,
            status: "ACCEPTED",
            joinedAt: "just now",
          },
        ],
        visibility: "UPCOMING",
      };
      setMeetups((prev) => [newMeetup, ...prev]);
      addNotification("SYSTEM_UPDATE", `Meetup "${newMeetup.title}" created successfully.`);
      return newMeetup;
    },
    [currentUserId, addNotification]
  );

  const editMeetup = useCallback(
    (
      meetupId: string,
      payload: { title: string; time: string; capacity: number; description: string }
    ) => {
      const existing = meetups.find((meetup) => meetup.id === meetupId);
      if (!existing) {
        return null;
      }

      const updatedMeetup: Meetup = {
        ...existing,
        title: payload.title.trim(),
        time: payload.time.trim(),
        capacity: payload.capacity,
        description: payload.description.trim(),
      };

      setMeetups((prev) =>
        prev.map((meetup) => (meetup.id === meetupId ? updatedMeetup : meetup))
      );
      addNotification("MEETUP_UPDATED", `Meetup "${updatedMeetup.title}" was updated by the host.`);
      return updatedMeetup;
    },
    [addNotification, meetups]
  );

  const manageParticipants = useCallback(
    (meetupId: string, userId: string, action: "INVITE" | "APPROVE") => {
      const existingMeetup = meetups.find((meetup) => meetup.id === meetupId);
      if (!existingMeetup) {
        return null;
      }

      const existingParticipation = existingMeetup.participants.find(
        (part) => part.userId === userId
      );
      const participants: Participation[] = existingParticipation
        ? existingMeetup.participants.map((part) =>
            part.userId === userId
              ? { ...part, status: action === "APPROVE" ? "ACCEPTED" : "REQUESTED" }
              : part
          )
        : [
            ...existingMeetup.participants,
            {
              id: `part-${Date.now()}`,
              userId,
              status: action === "APPROVE" ? "ACCEPTED" : "REQUESTED",
              joinedAt: "just now",
            },
          ];

      const updatedMeetup: Meetup = { ...existingMeetup, participants };
      setMeetups((prev) =>
        prev.map((meetup) => (meetup.id === meetupId ? updatedMeetup : meetup))
      );

      addNotification(
        action === "APPROVE" ? "APPROVAL_SENT" : "INVITE_SENT",
        `${action} action applied for user ${userId} in meetup ${updatedMeetup.id}.`
      );
      return updatedMeetup;
    },
    [addNotification, meetups]
  );

  const respondToRequest = useCallback(
    (meetupId: string, userId: string, choice: "ACCEPT" | "DECLINE") => {
      const existingMeetup = meetups.find((meetup) => meetup.id === meetupId);
      if (!existingMeetup) {
        return null;
      }
      const newStatus: ParticipationStatus = choice === "ACCEPT" ? "ACCEPTED" : "DECLINED";
      const hasParticipant = existingMeetup.participants.some((part) => part.userId === userId);
      const participants = hasParticipant
        ? existingMeetup.participants.map((part) =>
            part.userId === userId ? { ...part, status: newStatus } : part
          )
        : [
            ...existingMeetup.participants,
            {
              id: `part-${Date.now()}`,
              userId,
              status: newStatus,
              joinedAt: "just now",
            },
          ];

      const updatedMeetup: Meetup = { ...existingMeetup, participants };
      setMeetups((prev) =>
        prev.map((meetup) => (meetup.id === meetupId ? updatedMeetup : meetup))
      );

      addNotification("JOIN_RESPONSE", `${userId} selected ${choice} for meetup ${updatedMeetup.id}.`);
      return updatedMeetup;
    },
    [addNotification, meetups]
  );

  const sendUpdateNotification = useCallback(
    (meetupId: string, message: string) => {
      addNotification("MEETUP_UPDATED", `Meetup ${meetupId}: ${message.trim()}`);
    },
    [addNotification]
  );

  const getMeetupById = useCallback(
    (meetupId: string) => meetups.find((meetup) => meetup.id === meetupId),
    [meetups]
  );

  const getUserById = useCallback(
    (userId: string) => users.find((user) => user.id === userId),
    [users]
  );

  const nearbyOnlineUsers = useMemo(
    () =>
      users.filter(
        (user) => user.availability === "ONLINE" && (!currentUser || user.id !== currentUser.id)
      ),
    [users, currentUser]
  );

  const activeMeetups = useMemo(
    () => meetups.filter((meetup) => meetup.visibility === "ACTIVE"),
    [meetups]
  );

  const upcomingMeetups = useMemo(
    () => meetups.filter((meetup) => meetup.visibility === "UPCOMING"),
    [meetups]
  );

  const pendingInvites = useMemo(() => {
    if (!currentUser) return [];
    return meetups.filter((meetup) =>
      meetup.participants.some(
        (part) => part.userId === currentUser.id && part.status === "REQUESTED"
      )
    );
  }, [meetups, currentUser]);

  const value = useMemo<AppStateContextType>(
    () => ({
      users,
      meetups,
      notifications,
      currentUser,
      nearbyOnlineUsers,
      activeMeetups,
      upcomingMeetups,
      pendingInvites,
      login,
      logout,
      updateProfile,
      upsertPreference,
      createMeetup,
      editMeetup,
      manageParticipants,
      respondToRequest,
      sendUpdateNotification,
      getMeetupById,
      getUserById,
    }),
    [
      users,
      meetups,
      notifications,
      currentUser,
      nearbyOnlineUsers,
      activeMeetups,
      upcomingMeetups,
      pendingInvites,
      login,
      logout,
      updateProfile,
      upsertPreference,
      createMeetup,
      editMeetup,
      manageParticipants,
      respondToRequest,
      sendUpdateNotification,
      getMeetupById,
      getUserById,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider.");
  }
  return context;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { demoMeetups, demoNotifications, demoUsers } from "@/data/mock-data";
import { emitToast } from "@/lib/toast-bus";
import type {
  AvailabilityStatus,
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
  resolveUserPresence: (user: User) => AvailabilityStatus;
  setCurrentUserPresence: (status: AvailabilityStatus) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  spotlightMeetupId: string | null;
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
  const [simulatedPresence, setSimulatedPresence] = useState<
    Partial<Record<string, AvailabilityStatus>>
  >({});
  const [spotlightMeetupId, setSpotlightMeetupId] = useState<string | null>(null);
  const spotlightClearRef = useRef<number | null>(null);

  const makeId = useCallback((prefix: string) => `${prefix}-${crypto.randomUUID()}`, []);

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

  useEffect(() => {
    if (!currentUserId) {
      setSimulatedPresence({});
    }
  }, [currentUserId]);

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
              { id: makeId("pref"), key: key.trim(), value: value.trim() },
            ],
          };
        })
      );
      return true;
    },
    [currentUserId, makeId]
  );

  const addNotification = useCallback((type: NotificationType, message: string) => {
    setNotifications((prev) => [
      {
        id: makeId("n"),
        type,
        message,
        createdAt: "just now",
        read: false,
      },
      ...prev,
    ]);
  }, [makeId]);

  const flashMeetupSpotlight = useCallback((meetupId: string) => {
    if (typeof window === "undefined") return;
    if (spotlightClearRef.current) {
      window.clearTimeout(spotlightClearRef.current);
    }
    setSpotlightMeetupId(meetupId);
    spotlightClearRef.current = window.setTimeout(() => {
      setSpotlightMeetupId(null);
      spotlightClearRef.current = null;
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (spotlightClearRef.current && typeof window !== "undefined") {
        window.clearTimeout(spotlightClearRef.current);
      }
    };
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
        id: makeId("meetup"),
        title: payload.title.trim(),
        activityType: payload.activityType,
        time: payload.time.trim(),
        capacity: payload.capacity,
        description: payload.description.trim(),
        hostUserId: currentUserId,
        location: { label: payload.locationLabel.trim(), city: "Atlanta" },
        participants: [
          {
            id: makeId("part"),
            userId: currentUserId,
            status: "ACCEPTED",
            joinedAt: "just now",
          },
        ],
        visibility: "UPCOMING",
      };
      setMeetups((prev) => [newMeetup, ...prev]);
      addNotification("SYSTEM_UPDATE", `Meetup "${newMeetup.title}" created successfully.`);
      flashMeetupSpotlight(newMeetup.id);
      emitToast({
        title: "New meetup created successfully",
        description: `"${newMeetup.title}" is live in your feed.`,
        variant: "success",
      });
      return newMeetup;
    },
    [currentUserId, addNotification, flashMeetupSpotlight, makeId]
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
      addNotification(
        "MEETUP_UPDATED",
        `Meetup "${updatedMeetup.title}" was updated by the host.`
      );
      flashMeetupSpotlight(updatedMeetup.id);
      emitToast({
        title: "Meetup updated successfully",
        description: "Changes are synced across the feed and detail views.",
        variant: "success",
      });
      return updatedMeetup;
    },
    [addNotification, meetups, flashMeetupSpotlight]
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
              id: makeId("part"),
              userId,
              status: action === "APPROVE" ? "ACCEPTED" : "REQUESTED",
              joinedAt: "just now",
            },
          ];

      const updatedMeetup: Meetup = { ...existingMeetup, participants };
      setMeetups((prev) =>
        prev.map((meetup) => (meetup.id === meetupId ? updatedMeetup : meetup))
      );

      const target = users.find((user) => user.id === userId);
      const targetName = target?.name ?? userId;
      if (action === "INVITE") {
        addNotification(
          "INVITE_SENT",
          `Invitation sent to ${targetName} for "${updatedMeetup.title}".`
        );
        emitToast({
          title: "Invitation sent",
          description: `${targetName} will see this in their notifications.`,
          variant: "info",
        });
      } else {
        addNotification(
          "APPROVAL_SENT",
          `${targetName} was approved for "${updatedMeetup.title}".`
        );
        emitToast({
          title: "Participant approved",
          description: `${targetName} is confirmed for this meetup.`,
          variant: "success",
        });
      }
      return updatedMeetup;
    },
    [addNotification, meetups, users, makeId]
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
              id: makeId("part"),
              userId,
              status: newStatus,
              joinedAt: "just now",
            },
          ];

      const updatedMeetup: Meetup = { ...existingMeetup, participants };
      setMeetups((prev) =>
        prev.map((meetup) => (meetup.id === meetupId ? updatedMeetup : meetup))
      );

      const actor = users.find((user) => user.id === userId);
      const actorName = actor?.name ?? userId;
      if (choice === "ACCEPT") {
        addNotification(
          "JOIN_RESPONSE",
          `${actorName} accepted the join request for "${updatedMeetup.title}".`
        );
        emitToast({
          title: "Join request accepted",
          description: `You're in for "${updatedMeetup.title}".`,
          variant: "success",
        });
      } else {
        addNotification(
          "JOIN_RESPONSE",
          `${actorName} declined the join request for "${updatedMeetup.title}".`
        );
        emitToast({
          title: "Join request declined",
          description: `No worries — you can explore other meetups.`,
          variant: "warning",
        });
      }
      return updatedMeetup;
    },
    [addNotification, meetups, users, makeId]
  );

  const sendUpdateNotification = useCallback(
    (meetupId: string, message: string) => {
      const trimmed = message.trim();
      addNotification("MEETUP_UPDATED", `Meetup ${meetupId}: ${trimmed}`);
      emitToast({
        title: "Meetup update posted",
        description: trimmed,
        variant: "info",
      });
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

  const resolveUserPresence = useCallback(
    (user: User) => {
      if (user.id === currentUserId) {
        const live = users.find((entry) => entry.id === user.id);
        return live?.availability ?? user.availability;
      }
      return simulatedPresence[user.id] ?? user.availability;
    },
    [currentUserId, users, simulatedPresence]
  );

  const setCurrentUserPresence = useCallback(
    (status: AvailabilityStatus) => {
      if (!currentUserId) return;
      setUsers((prev) =>
        prev.map((user) =>
          user.id === currentUserId ? { ...user, availability: status } : user
        )
      );
    },
    [currentUserId]
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  useEffect(() => {
    if (!currentUserId || typeof window === "undefined") {
      return;
    }
    const others = users.filter((user) => user.id !== currentUserId);
    if (!others.length) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (Math.random() < 0.36) {
        return;
      }
      const pick = others[Math.floor(Math.random() * others.length)];
      setSimulatedPresence((prev) => {
        const effective = prev[pick.id] ?? pick.availability;
        const next: AvailabilityStatus = effective === "ONLINE" ? "OFFLINE" : "ONLINE";

        queueMicrotask(() => {
          if (next === "ONLINE") {
            addNotification("NEARBY_PRESENCE", `${pick.name} is now online nearby.`);
            emitToast({
              title: `${pick.name} is now online nearby`,
              description: "New active user detected nearby.",
              variant: "info",
            });
          } else if (Math.random() > 0.45) {
            emitToast({
              title: `${pick.name} went offline nearby`,
              description: "They may have stepped away.",
              variant: "default",
            });
          }
        });

        return { ...prev, [pick.id]: next };
      });
    }, 5600);

    return () => window.clearInterval(intervalId);
  }, [currentUserId, users, addNotification]);

  const nearbyOnlineUsers = useMemo(
    () =>
      users.filter((user) => {
        if (!currentUser || user.id === currentUser.id) {
          return false;
        }
        return resolveUserPresence(user) === "ONLINE";
      }),
    [users, currentUser, resolveUserPresence]
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
      resolveUserPresence,
      setCurrentUserPresence,
      markNotificationRead,
      markAllNotificationsRead,
      spotlightMeetupId,
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
      resolveUserPresence,
      setCurrentUserPresence,
      markNotificationRead,
      markAllNotificationsRead,
      spotlightMeetupId,
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

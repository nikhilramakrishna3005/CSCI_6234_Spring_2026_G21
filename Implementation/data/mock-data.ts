import type { Meetup, Notification, User } from "@/lib/types";

export const demoUsers: User[] = [
  {
    id: "u-host-1",
    username: "host1",
    password: "pass123",
    name: "Host One",
    email: "host1@micromeet.app",
    availability: "ONLINE",
    preferences: [
      { id: "p1", key: "activity", value: "COFFEE" },
      { id: "p2", key: "vibe", value: "Networking" },
    ],
    avatarGradient: "from-red-900 to-rose-700",
  },
  {
    id: "u-user-1",
    username: "user1",
    password: "pass123",
    name: "User One",
    email: "user1@micromeet.app",
    availability: "ONLINE",
    preferences: [
      { id: "p3", key: "activity", value: "STUDY" },
      { id: "p4", key: "time", value: "Evening" },
    ],
    avatarGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "u-user-2",
    username: "user2",
    password: "pass123",
    name: "User Two",
    email: "user2@micromeet.app",
    availability: "OFFLINE",
    preferences: [
      { id: "p5", key: "activity", value: "GYM" },
      { id: "p6", key: "intensity", value: "Medium" },
    ],
    avatarGradient: "from-orange-500 to-pink-500",
  },
  {
    id: "u-user-3",
    username: "luna",
    password: "pass123",
    name: "Luna Rivera",
    email: "luna@micromeet.app",
    availability: "ONLINE",
    preferences: [
      { id: "p7", key: "activity", value: "FOOD" },
      { id: "p8", key: "radius", value: "5km" },
    ],
    avatarGradient: "from-rose-800 to-red-700",
  },
];

export const demoMeetups: Meetup[] = [
  {
    id: "meetup-1",
    title: "Sunset Coffee Sprint",
    activityType: "COFFEE",
    time: "Today · 6:30 PM",
    capacity: 6,
    description: "Fast intro rounds, idea swapping, and espresso shots.",
    hostUserId: "u-host-1",
    location: { label: "Bean District Rooftop", city: "Atlanta" },
    participants: [
      { id: "part-1", userId: "u-host-1", status: "ACCEPTED", joinedAt: "now" },
      { id: "part-2", userId: "u-user-1", status: "REQUESTED", joinedAt: "now" },
      { id: "part-3", userId: "u-user-3", status: "ACCEPTED", joinedAt: "now" },
    ],
    visibility: "ACTIVE",
  },
  {
    id: "meetup-2",
    title: "Focus Lab: Exam Strategy",
    activityType: "STUDY",
    time: "Tomorrow · 11:00 AM",
    capacity: 8,
    description: "Short Pomodoro cycles and peer concept checks.",
    hostUserId: "u-user-1",
    location: { label: "Library Pod C3", city: "Atlanta" },
    participants: [
      { id: "part-4", userId: "u-user-1", status: "ACCEPTED", joinedAt: "now" },
      { id: "part-5", userId: "u-host-1", status: "REQUESTED", joinedAt: "now" },
    ],
    visibility: "UPCOMING",
  },
  {
    id: "meetup-3",
    title: "Park HIIT Circle",
    activityType: "SPORTS",
    time: "Sat · 8:00 AM",
    capacity: 10,
    description: "Bodyweight cardio + partner drills. All levels welcome.",
    hostUserId: "u-user-2",
    location: { label: "Piedmont East Lawn", city: "Atlanta" },
    participants: [
      { id: "part-6", userId: "u-user-2", status: "ACCEPTED", joinedAt: "now" },
      { id: "part-7", userId: "u-user-3", status: "REQUESTED", joinedAt: "now" },
    ],
    visibility: "UPCOMING",
  },
];

export const demoNotifications: Notification[] = [
  {
    id: "n-1",
    type: "INVITE_SENT",
    message: "You invited User One to Sunset Coffee Sprint.",
    createdAt: "2 min ago",
    read: false,
  },
  {
    id: "n-2",
    type: "JOIN_RESPONSE",
    message: "Luna accepted your meetup invitation.",
    createdAt: "13 min ago",
    read: false,
  },
  {
    id: "n-3",
    type: "SYSTEM_UPDATE",
    message: "MicroMeet upgraded your dashboard experience.",
    createdAt: "1 hr ago",
    read: true,
  },
];

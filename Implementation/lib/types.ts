export type AvailabilityStatus = "ONLINE" | "OFFLINE";

export type ActivityType = "STUDY" | "GYM" | "FOOD" | "SPORTS" | "COFFEE";

export type ParticipationStatus = "REQUESTED" | "ACCEPTED" | "DECLINED";

export type NotificationType =
  | "MEETUP_UPDATED"
  | "INVITE_SENT"
  | "APPROVAL_SENT"
  | "JOIN_RESPONSE"
  | "SYSTEM_UPDATE"
  | "NEARBY_PRESENCE";

export type Preference = {
  id: string;
  key: string;
  value: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  availability: AvailabilityStatus;
  preferences: Preference[];
  avatarGradient: string;
};

export type Location = {
  label: string;
  city: string;
};

export type Participation = {
  id: string;
  userId: string;
  status: ParticipationStatus;
  joinedAt: string;
};

export type Meetup = {
  id: string;
  title: string;
  activityType: ActivityType;
  time: string;
  capacity: number;
  description: string;
  hostUserId: string;
  location: Location;
  participants: Participation[];
  visibility: "ACTIVE" | "UPCOMING";
};

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
};

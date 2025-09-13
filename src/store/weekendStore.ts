import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from '@/components/ui/use-toast';

export type ActivityCategory = 'food' | 'outdoor' | 'entertainment' | 'relax' | 'learning' | 'social' | 'adventure';
export type MoodType = 'happy' | 'relaxed' | 'energetic';
export type ThemeType = 'default' | 'lazy' | 'adventurous' | 'family';
export type WeekendLength = 'short' | 'long' | 'extended';
export type DayKey = 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Activity {
  id: string;
  name: string;
  icon: string;
  category: ActivityCategory;
  description: string;
}

export interface ScheduledActivity extends Activity {
  mood?: MoodType;
  scheduledId: string;
}

export interface Holiday {
  name: string;
  date: Date;
  type: 'government' | 'restricted';
  religion?: string;
  weekend?: WeekendLength;
}

export interface SharedPlan {
  id: string;
  title: string;
  userName: string;
  createdAt: Date;
  activities: Activity[];
  schedule: {
    thursday: ScheduledActivity[];
    friday: ScheduledActivity[];
    saturday: ScheduledActivity[];
    sunday: ScheduledActivity[];
  };
  currentTheme: ThemeType;
  weekendLength: WeekendLength;
  availableDays: DayKey[];
  selectedWeekendDates: Date[];
  totalActivities: number;
}

interface WeekendState {
  activities: Activity[];
  schedule: {
    thursday: ScheduledActivity[];
    friday: ScheduledActivity[];
    saturday: ScheduledActivity[];
    sunday: ScheduledActivity[];
  };
  currentTheme: ThemeType;
  weekendLength: WeekendLength;
  availableDays: DayKey[];
  selectedWeekendDates: Date[];
  currentThreadId: string;
  threads: Record<string, {
    activities: Activity[];
    schedule: {
      thursday: ScheduledActivity[];
      friday: ScheduledActivity[];
      saturday: ScheduledActivity[];
      sunday: ScheduledActivity[];
    };
    currentTheme: ThemeType;
    weekendLength: WeekendLength;
    availableDays: DayKey[];
    selectedWeekendDates: Date[];
    ownerUsername?: string;
    password?: string;
  }>;
  authenticatedThreads: Record<string, true>;
  sharedPlans: Record<string, SharedPlan>;

  // Actions
  addActivity: (day: DayKey, activity: Activity) => void;
  removeActivity: (day: DayKey, scheduledId: string) => void;
  updateMood: (day: DayKey, scheduledId: string, mood: MoodType) => void;
  reorderActivities: (day: DayKey, activities: ScheduledActivity[]) => void;
  setTheme: (theme: ThemeType) => void;
  setWeekendLength: (length: WeekendLength) => void;
  clearSchedule: () => void;
  getUpcomingHolidays: () => Holiday[];
  setSelectedWeekendDates: (dates: Date[]) => void;
  removeCatalogActivity: (activityId: string) => void;
  createThread: (threadId?: string) => string;
  switchThread: (threadId: string) => void;
  listThreads: () => string[];
  deleteThread: (threadId: string) => void;
  existsThread: (threadId: string) => boolean;
  // Auth helpers (demo/local only)
  setThreadCredentials: (threadId: string, username: string, password: string) => void;
  validateThreadPassword: (threadId: string, password: string) => boolean;
  markThreadAuthenticated: (threadId: string) => void;
  isThreadAuthenticated: (threadId: string) => boolean;
  createThreadWithCredentials: (threadId: string, username: string, password: string) => void;
  threadHasPassword: (threadId: string) => boolean;
  logout: () => void;
  // Sharing functionality
  createShareableLink: () => string;
  getSharedPlan: (shareId: string) => SharedPlan | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Holiday detection utility
const getUpcomingHolidays = (): Holiday[] => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const holidays: Holiday[] = [
    { name: "Republic Day", date: new Date(2025, 0, 26), type: 'government' },
    { name: "Maha Shivaratri", date: new Date(2025, 1, 26), type: 'government', religion: 'Hindu' },
    { name: "Holi (Rangwali Holi)", date: new Date(2025, 2, 14), type: 'government', religion: 'Hindu' },
    { name: "Id-ul-Fitr (Ramzan Id) — (as declared)", date: new Date(2025, 2, 31), type: 'government', religion: 'Muslim' },
    { name: "Mahavir Jayanti", date: new Date(2025, 3, 10), type: 'government', religion: 'Jain' },
    { name: "Good Friday", date: new Date(2025, 3, 18), type: 'government', religion: 'Christian' },
    { name: "Buddha Purnima", date: new Date(2025, 4, 12), type: 'government', religion: 'Buddhist' },
    { name: "Id-ul-Zuha (Bakrid) — (as declared)", date: new Date(2025, 5, 7), type: 'government', religion: 'Muslim' },
    { name: "Muharram", date: new Date(2025, 6, 6), type: 'government', religion: 'Muslim' },
    { name: "Independence Day", date: new Date(2025, 7, 15), type: 'government' },
    { name: "Janmashtami", date: new Date(2025, 7, 16), type: 'government', religion: 'Hindu' },
    { name: "Milad-un-Nabi / Id-e-Milad (Birthday of Prophet Mohammad)", date: new Date(2025, 8, 5), type: 'government', religion: 'Muslim' },
  ];

  // Infer suggested weekend length from holiday weekday
  const inferWeekendLength = (date: Date): WeekendLength | undefined => {
    const weekday = date.getDay();
    // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
    if (weekday === 5 || weekday === 1) return 'long'; // Fri or Mon
    if (weekday === 4 || weekday === 2) return 'extended'; // Thu or Tue
    return undefined;
  };

  const now = new Date();
  return holidays
    .map((h) => ({ ...h, weekend: h.weekend ?? inferWeekendLength(h.date) }))
    .filter(holiday => holiday.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);
};

// Weekend length configurations
const getAvailableDays = (length: WeekendLength): DayKey[] => {
  switch (length) {
    case 'short': return ['saturday', 'sunday'];
    case 'long': return ['friday', 'saturday', 'sunday'];
    case 'extended': return ['thursday', 'friday', 'saturday', 'sunday'];
    default: return ['saturday', 'sunday'];
  }
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const useWeekendStore = create<WeekendState>()(
  persist(
    (set, get) => ({
      activities: [
        // Food Activities
        { id: '1', name: 'Brunch', icon: '🥐', category: 'food', description: 'Enjoy a lazy weekend brunch' },
        { id: '2', name: 'Cook Together', icon: '👨‍🍳', category: 'food', description: 'Try a new recipe together' },
        { id: '3', name: 'Farmers Market', icon: '🥬', category: 'food', description: 'Fresh ingredients and local treats' },
        { id: '4', name: 'Wine Tasting', icon: '🍷', category: 'food', description: 'Discover new flavors' },
        { id: '5', name: 'Food Truck Hunt', icon: '🚚', category: 'food', description: 'Adventure through food trucks' },
        { id: '21', name: 'Baking Session', icon: '🧁', category: 'food', description: 'Bake cookies, cakes, or bread' },
        { id: '22', name: 'Street Food Tour', icon: '🍢', category: 'food', description: 'Explore local street food spots' },
        { id: '23', name: 'Coffee Tasting', icon: '☕', category: 'food', description: 'Try different brews or cafés' },
        { id: '24', name: 'BBQ Party', icon: '🍖', category: 'food', description: 'Host a backyard barbecue' },

        // Outdoor Activities
        { id: '6', name: 'Hiking', icon: '🥾', category: 'outdoor', description: 'Explore nature trails' },
        { id: '7', name: 'Beach Day', icon: '🏖️', category: 'outdoor', description: 'Sun, sand, and waves' },
        { id: '8', name: 'Bike Ride', icon: '🚴‍♂️', category: 'outdoor', description: 'Cycle through scenic routes' },
        { id: '9', name: 'Picnic', icon: '🧺', category: 'outdoor', description: 'Outdoor dining experience' },
        { id: '10', name: 'Kayaking', icon: '🛶', category: 'outdoor', description: 'Paddle through calm waters' },
        { id: '25', name: 'Nature Walk', icon: '🌳', category: 'outdoor', description: 'Relaxed walk through a park' },
        { id: '26', name: 'Camping', icon: '🏕️', category: 'outdoor', description: 'Overnight outdoor adventure' },
        { id: '27', name: 'Stargazing', icon: '🌌', category: 'outdoor', description: 'Watch the night sky' },
        { id: '28', name: 'Photography Walk', icon: '📸', category: 'outdoor', description: 'Capture scenic moments' },
        { id: '29', name: 'Outdoor Workout', icon: '🏋️‍♂️', category: 'outdoor', description: 'Exercise in fresh air' },

        // Entertainment Activities
        { id: '11', name: 'Movie Night', icon: '🎬', category: 'entertainment', description: 'Cozy cinema experience' },
        { id: '12', name: 'Concert', icon: '🎵', category: 'entertainment', description: 'Live music experience' },
        { id: '13', name: 'Museum Visit', icon: '🏛️', category: 'entertainment', description: 'Explore art and culture' },
        { id: '14', name: 'Board Games', icon: '🎲', category: 'entertainment', description: 'Fun competitive games' },
        { id: '15', name: 'Comedy Show', icon: '😂', category: 'entertainment', description: 'Laugh the night away' },
        { id: '30', name: 'Theater Play', icon: '🎭', category: 'entertainment', description: 'Watch a live drama' },
        { id: '31', name: 'Bowling', icon: '🎳', category: 'entertainment', description: 'Fun indoor game' },
        { id: '32', name: 'Arcade Games', icon: '🕹️', category: 'entertainment', description: 'Retro fun and prizes' },
        { id: '33', name: 'Karaoke Night', icon: '🎤', category: 'entertainment', description: 'Sing your favorite songs' },
        { id: '34', name: 'Sports Match', icon: '⚽', category: 'entertainment', description: 'Watch or play a local game' },

        // Relax Activities
        { id: '16', name: 'Spa Day', icon: '🧴', category: 'relax', description: 'Pamper and unwind' },
        { id: '17', name: 'Reading', icon: '📚', category: 'relax', description: 'Get lost in a good book' },
        { id: '18', name: 'Meditation', icon: '🧘‍♀️', category: 'relax', description: 'Find inner peace' },
        { id: '19', name: 'Bubble Bath', icon: '🛁', category: 'relax', description: 'Luxurious relaxation' },
        { id: '20', name: 'Yoga', icon: '🧘‍♂️', category: 'relax', description: 'Stretch and breathe' },
        { id: '35', name: 'Digital Detox', icon: '📵', category: 'relax', description: 'Unplug from screens' },
        { id: '36', name: 'Gardening', icon: '🪴', category: 'relax', description: 'Plant or tend to your garden' },
        { id: '37', name: 'Journaling', icon: '✍️', category: 'relax', description: 'Reflect on your thoughts' },
        { id: '38', name: 'Power Nap', icon: '😴', category: 'relax', description: 'Recharge your energy' },

        // Learning / Creative Activities
        { id: '39', name: 'DIY Project', icon: '🛠️', category: 'learning', description: 'Build something creative' },
        { id: '40', name: 'Painting', icon: '🎨', category: 'learning', description: 'Express yourself with colors' },
        { id: '41', name: 'Photography Lesson', icon: '📷', category: 'learning', description: 'Learn new camera tricks' },
        { id: '42', name: 'Online Course', icon: '💻', category: 'learning', description: 'Upskill from home' },
        { id: '43', name: 'Music Practice', icon: '🎸', category: 'learning', description: 'Play or learn an instrument' },

        // Social Activities
        { id: '44', name: 'House Party', icon: '🏠', category: 'social', description: 'Invite friends over' },
        { id: '45', name: 'Volunteering', icon: '🤝', category: 'social', description: 'Give back to the community' },
        { id: '46', name: 'Family Game Night', icon: '👨‍👩‍👧‍👦', category: 'social', description: 'Bond with family' },
        { id: '47', name: 'Meet New People', icon: '🫂', category: 'social', description: 'Join a club or meetup' },

        // Adventure Activities
        { id: '48', name: 'Road Trip', icon: '🚗', category: 'adventure', description: 'Spontaneous getaway' },
        { id: '49', name: 'Amusement Park', icon: '🎡', category: 'adventure', description: 'Thrilling rides & games' },
        { id: '50', name: 'Ziplining', icon: '🌉', category: 'adventure', description: 'High-speed adventure' },
        { id: '51', name: 'Treasure Hunt', icon: '🗺️', category: 'adventure', description: 'Fun scavenger game' },
        { id: '52', name: 'Go Karting', icon: '🏎️', category: 'adventure', description: 'Race with friends' },
      ],

      schedule: {
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },

      currentTheme: 'default',
      weekendLength: 'short',
      availableDays: ['saturday', 'sunday'],
      selectedWeekendDates: [],
      currentThreadId: '',
      threads: {},
      authenticatedThreads: {},
      sharedPlans: {},

      // Actions
      addActivity: (day, activity) => {
        set((state) => {
          // Check if activity already exists in the selected day
          const alreadyExists = state.schedule[day].some(
            (a) => a.id === activity.id
          );

          if (alreadyExists) {
            toast({
              title: 'Already added',
              description: `${activity.icon} ${activity.name} is already in ${capitalize(day)}.`,
              variant: 'destructive', // optional: make it visually distinct
            });
            return state; // Don't modify state
          }

          // If not duplicate, proceed with adding
          toast({
            title: 'Activity added',
            description: `${activity.icon} ${activity.name} added to ${capitalize(day)}.`,
          });

          const newScheduledActivity: ScheduledActivity = {
            ...activity,
            scheduledId: generateId(),
          };

          const newSchedule = {
            ...state.schedule,
            [day]: [...state.schedule[day], newScheduledActivity],
          };

          const threadId = state.currentThreadId;

          return {
            schedule: newSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  schedule: newSchedule,
                },
              }
              : state.threads,
          };
        });
      },

      removeActivity: (day, scheduledId) => {
        set((state) => {
          const activity = state.schedule[day].find((a) => a.scheduledId === scheduledId);
          const newSchedule = {
            ...state.schedule,
            [day]: state.schedule[day].filter((a) => a.scheduledId !== scheduledId),
          };
          if (activity) {
            toast({ title: 'Activity removed', description: `${activity.icon} ${activity.name} removed from ${capitalize(day)}.` });
          }
          const threadId = state.currentThreadId;
          return {
            schedule: newSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  schedule: newSchedule,
                },
              }
              : state.threads,
          };
        });
      },

      updateMood: (day, scheduledId, mood) => {
        set((state) => {
          const newSchedule = {
            ...state.schedule,
            [day]: state.schedule[day].map((activity) =>
              activity.scheduledId === scheduledId ? { ...activity, mood } : activity
            ),
          };
          const threadId = state.currentThreadId;
          return {
            schedule: newSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  schedule: newSchedule,
                },
              }
              : state.threads,
          };
        });
      },

      reorderActivities: (day, activities) => {
        set((state) => {
          const newSchedule = { ...state.schedule, [day]: activities };
          const threadId = state.currentThreadId;
          return {
            schedule: newSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  schedule: newSchedule,
                },
              }
              : state.threads,
          };
        });
      },

      setTheme: (theme) => {
        toast({ title: 'Theme updated', description: `Theme set to ${theme}.` });
        set((state) => {
          const threadId = state.currentThreadId;
          return {
            currentTheme: theme,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  currentTheme: theme,
                },
              }
              : state.threads,
          };
        });
      },

      setWeekendLength: (length) => {
        toast({ title: 'Weekend length updated', description: `Length set to ${length}.` });
        set((state) => {
          const nextAvailable = getAvailableDays(length);
          const threadId = state.currentThreadId;
          return {
            weekendLength: length,
            availableDays: nextAvailable,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  weekendLength: length,
                  availableDays: nextAvailable,
                },
              }
              : state.threads,
          };
        });
      },

      clearSchedule: () => {
        toast({ title: 'Schedule cleared', description: 'All activities removed from schedule.' });
        set((state) => {
          const newSchedule = {
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          };
          const threadId = state.currentThreadId;
          return {
            schedule: newSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  schedule: newSchedule,
                },
              }
              : state.threads,
          };
        });
      },

      getUpcomingHolidays,

      setSelectedWeekendDates: (dates) => {
        set((state) => {
          const threadId = state.currentThreadId;
          return {
            selectedWeekendDates: dates,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  selectedWeekendDates: dates,
                },
              }
              : state.threads,
          };
        });
      },

      removeCatalogActivity: (activityId: string) =>
        set((state) => {
          const activity = state.activities.find((a) => a.id === activityId);
          const nextActivities = state.activities.filter((a) => a.id !== activityId);
          const removedCountsByDay = {
            thursday: state.schedule.thursday.filter((a) => a.id === activityId).length,
            friday: state.schedule.friday.filter((a) => a.id === activityId).length,
            saturday: state.schedule.saturday.filter((a) => a.id === activityId).length,
            sunday: state.schedule.sunday.filter((a) => a.id === activityId).length,
          };
          const totalRemoved = Object.values(removedCountsByDay).reduce((sum, n) => sum + n, 0);

          const nextSchedule = {
            thursday: state.schedule.thursday.filter((a) => a.id !== activityId),
            friday: state.schedule.friday.filter((a) => a.id !== activityId),
            saturday: state.schedule.saturday.filter((a) => a.id !== activityId),
            sunday: state.schedule.sunday.filter((a) => a.id !== activityId),
          };

          if (activity) {
            toast({
              title: 'Activity removed',
              description: `${activity.icon} ${activity.name} deleted from catalog${totalRemoved ? ` and ${totalRemoved} scheduled entr${totalRemoved === 1 ? 'y' : 'ies'} removed` : ''}.`,
              variant: 'destructive',
            });
          }

          const threadId = state.currentThreadId;
          return {
            activities: nextActivities,
            schedule: nextSchedule,
            threads: threadId
              ? {
                ...state.threads,
                [threadId]: {
                  ...(state.threads[threadId] ?? {
                    activities: state.activities,
                    schedule: state.schedule,
                    currentTheme: state.currentTheme,
                    weekendLength: state.weekendLength,
                    availableDays: state.availableDays,
                    selectedWeekendDates: state.selectedWeekendDates,
                  }),
                  activities: nextActivities,
                  schedule: nextSchedule,
                },
              }
              : state.threads,
          };
        }),

      createThread: (threadId) => {
        const id = threadId || generateId();
        set((state) => ({
          threads: {
            ...state.threads,
            [id]: {
              activities: [...state.activities],
              schedule: { ...state.schedule },
              currentTheme: state.currentTheme,
              weekendLength: state.weekendLength,
              availableDays: [...state.availableDays],
              selectedWeekendDates: [...state.selectedWeekendDates],
            },
          },
          currentThreadId: id,
        }));
        return id;
      },

      switchThread: (threadId) => {
        set((state) => {
          const threadData = state.threads[threadId];
          if (!threadData) return {};
          return {
            currentThreadId: threadId,
            activities: [...threadData.activities],
            schedule: { ...threadData.schedule },
            currentTheme: threadData.currentTheme,
            weekendLength: threadData.weekendLength,
            availableDays: [...threadData.availableDays],
            selectedWeekendDates: [...threadData.selectedWeekendDates],
          };
        });
      },

      listThreads: () => Object.keys(get().threads),

      deleteThread: (threadId) => {
        set((state) => {
          const { [threadId]: _, ...remainingThreads } = state.threads;
          const { [threadId]: __, ...remainingAuth } = state.authenticatedThreads;
          return {
            threads: remainingThreads,
            authenticatedThreads: remainingAuth,
            currentThreadId: state.currentThreadId === threadId ? '' : state.currentThreadId,
          };
        });
      },

      existsThread: (threadId) => !!get().threads[threadId],

      setThreadCredentials: (threadId, username, password) => {
        set((state) => {
          const snap = { ...state.threads[threadId] };
          if (!snap) return {};
          return {
            threads: {
              ...state.threads,
              [threadId]: { ...snap, ownerUsername: username, password },
            },
          };
        });
      },

      validateThreadPassword: (threadId, password) => {
        const snap = get().threads[threadId];
        return !!snap && snap.password === password;
      },

      threadHasPassword: (threadId) => {
        const snap = get().threads[threadId];
        return !!(snap && snap.password);
      },

      markThreadAuthenticated: (threadId) => {
        set((state) => ({
          authenticatedThreads: { ...state.authenticatedThreads, [threadId]: true },
        }));
      },

      isThreadAuthenticated: (threadId) => !!get().authenticatedThreads[threadId],

      createThreadWithCredentials: (threadId, username, password) => {
        const id = get().createThread(threadId);
        get().setThreadCredentials(id, username, password);
        get().markThreadAuthenticated(id);
        return id;
      },

      logout: () => {
        set((state) => {
          const id = state.currentThreadId;
          if (!id) return {} as Partial<WeekendState>;
          const { [id]: _, ...rest } = state.authenticatedThreads;
          return {
            authenticatedThreads: rest as Record<string, true>,
            currentThreadId: '',
          } as Partial<WeekendState>;
        });
      },

      // Sharing functionality
      createShareableLink: (): string => {
        const state = get();
        const isScheduleEmpty = state.availableDays.every(
          dayKey => state.schedule[dayKey].length === 0
        );

        if (isScheduleEmpty) {
          toast({
            title: 'Your schedule is empty',
            description: 'No activities are left. Add some to plan your weekend!',
            variant: 'destructive', // optional: makes it visually distinct
          });
        }
        const shareId = generateId() + generateId(); // More unique ID
        const totalActivities = state.availableDays.reduce(
          (sum, day) => sum + state.schedule[day].length,
          0
        );

        // Get user name from current thread
        const currentThread = state.threads[state.currentThreadId];
        const userName = currentThread?.ownerUsername || 'Weekend Planner User';

        const sharedPlan: SharedPlan = {
          id: shareId,
          title: `${userName}'s Weekend Plan - ${totalActivities} Activities`,
          userName: userName,
          createdAt: new Date(),
          activities: state.activities,
          schedule: { ...state.schedule },
          currentTheme: state.currentTheme,
          weekendLength: state.weekendLength,
          availableDays: [...state.availableDays],
          selectedWeekendDates: [...state.selectedWeekendDates],
          totalActivities
        };

        set(state => ({
          ...state,
          sharedPlans: {
            ...state.sharedPlans,
            [shareId]: sharedPlan
          }
        }));

        return `${window.location.origin}/shared/${shareId}`;
      },

      getSharedPlan: (shareId: string): SharedPlan | null => {
        const state = get();
        return state.sharedPlans[shareId] || null;
      },
    }),
    {
      name: 'weekend-planner-storage',
      version: 1,
      onRehydrateStorage: (state) => {
        // Log rehydration for debugging
        console.log('Rehydrating store with state:', state);
        return (state) => {
          if (state) {
            console.log('Store rehydrated with', state.activities.length, 'activities');
          }
        };
      }
    }
  )
);

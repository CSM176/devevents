import mongoose, { Schema, Document, Types } from 'mongoose';

// Strongly-typed Event shape
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string
  time: string; // normalized time string (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventDocument extends IEvent, Document {}

// Simple slugify helper: lowercase, replace non-alnum with '-', collapse hyphens
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Normalize a Date string to an ISO timestamp (full ISO). Throws on invalid.
function normalizeDateToISO(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date format; expected a parseable date');
  }
  return d.toISOString();
}

// Normalize time to HH:mm (24-hour). Attempts parsing with the provided date/time,
// supports common formats including 12-hour times with AM/PM.
function normalizeTimeToHHMM(time: string, fallbackDate = '1970-01-01'): string {
  // Try parsing as combined date+time first (handles '2023-01-01 7:30 PM')
  let dt = new Date(`${fallbackDate} ${time}`);
  if (Number.isNaN(dt.getTime())) {
    // If direct parse failed, try parsing time-only patterns like '7:30 PM' by using Date.parse on an explicit string
    // Fall back to treating numeric times as already normalized
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1], 10);
      const minute = parseInt(timeMatch[2], 10);
      const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
      const ampm = timeMatch[4];
      let hh = hour;
      if (ampm) {
        const isPM = ampm.toUpperCase() === 'PM';
        if (hour === 12) hh = isPM ? 12 : 0;
        else hh = isPM ? hour + 12 : hour;
      }
      dt = new Date(`${fallbackDate}T${String(hh).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`);
    }
  }

  if (Number.isNaN(dt.getTime())) {
    throw new Error('Invalid time format; expected a parseable time');
  }

  // return HH:mm
  return dt.toISOString().substring(11, 16);
}

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'title required' } },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'description required' } },
    overview: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'overview required' } },
    image: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'image required' } },
    venue: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'venue required' } },
    location: { type: String, required: true, trim: true, validate: { validator: (v: string) => v.trim().length > 0, message: 'location required' } },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: { validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0, message: 'agenda must be a non-empty array of strings' },
    },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, validate: { validator: (arr: string[]) => Array.isArray(arr), message: 'tags must be an array of strings' } },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Ensure a unique index on slug for fast lookups and uniqueness enforcement
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook: generate/refresh slug when title changes, normalize date and time.
EventSchema.pre<EventDocument>('save', function (next: any) {
  try {
    // Generate slug only if title modified (prevents changing URLs inadvertently)
    if (this.isModified('title')) {
      this.slug = slugify(this.title);
    }

    // Normalize date to full ISO string (throws if invalid)
    if (this.isModified('date')) {
      this.date = normalizeDateToISO(this.date);
    }

    // Normalize time to consistent HH:mm format (throws if invalid)
    if (this.isModified('time') || this.isModified('date')) {
      // Use date value (if present) to better parse ambiguous times
      const fallbackDate = this.date ? this.date.substring(0, 10) : '1970-01-01';
      this.time = normalizeTimeToHHMM(this.time, fallbackDate);
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

// Export model (avoid recompilation/model overwrite during HMR by reusing existing model)
export const Event = (mongoose.models.Event as mongoose.Model<EventDocument>) || mongoose.model<EventDocument>('Event', EventSchema);

export default Event;

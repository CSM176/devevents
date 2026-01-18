import mongoose, { Schema, Document, Types, HydratedDocument } from 'mongoose';
import { Event } from './event.model';

// Strongly-typed Booking shape
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingDocument extends IBooking, Document {}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Index eventId for faster lookups
BookingSchema.index({ eventId: 1 });

// Pre-save hook: ensure referenced Event exists before saving booking.
BookingSchema.pre<BookingDocument>('save', async function (this: BookingDocument) {
  // Ensure referenced event exists
  const exists = await Event.exists({ _id: this.eventId });
  if (!exists) {
    throw new Error('Referenced event not found');
  }
});

// Export model (reuse existing model if compiled already)
export const Booking = (mongoose.models.Booking as mongoose.Model<BookingDocument>) || mongoose.model<BookingDocument>('Booking', BookingSchema);

export default Booking;

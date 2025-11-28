import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

    },
    password: {
      type: String,
      required: true,
      select: false,

    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'police', 'sub-admin', 'admin'],
      default: "user",
    },
    dob: {
      type: Date,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    nextOfKin: {
      type: String,
    },
    nextOfKinRelationship: {
      type: String,
      enum: ["family", "friend", "partner", "colleague", "other"],
    },
    nextOfKinAddress: {
      type: String,
    },
    nextOfKinPhoneNumber: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpiresAt: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiresAt: {
      type: Date,
      default: null,
    },
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        medicationReminders: {
          type: Boolean,
          default: true,
        },
        healthTips: {
          type: Boolean,
          default: false,
        },
        scanReminders: {
          type: Boolean,
          default: true,
        },
      },
      appearance: {
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "system",
        },
        language: {
          type: String,
          enum: ["en", "yo", "ig", "ha"],
          default: "en",
        },
      },
      privacy: {
        shareData: {
          type: Boolean,
          default: false,
        },
        analytics: {
          type: Boolean,
          default: true,
        },
        crashReports: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

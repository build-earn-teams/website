import mongoose, { Document, Schema } from 'mongoose';

// ------------------------- Types -------------------------
export interface ProjectCard {
  name: string;
  description?: string;
  images?: string[];
  demoLink?: string;
  clientOrPersonal: 'personal' | 'client';
  techStack?: string[];
  createdAt?: Date;
}

export interface JobCard {
  title: string;
  description?: string;
  assignedBy: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  price?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ICollaborator extends Document {
  username: string;
  email: string;
  password: string;
  otp?: string;
  otpVerified?: boolean;

  name?: string;
  education?: string;
  skills?: string[];
  photoUrl?: string;
  description?: string;

  projects: ProjectCard[];
  jobs: JobCard[];
}

// ------------------------- Schemas -------------------------
const ProjectCardSchema = new Schema<ProjectCard>({
  name: { type: String, required: true },
  description: { type: String },
  images: { type: [String], default: [] },
  demoLink: { type: String },
  clientOrPersonal: { type: String, enum: ['personal', 'client'], required: true },
  techStack: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const JobCardSchema = new Schema<JobCard>({
  title: { type: String, required: true },
  description: { type: String },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  price: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

const CollaboratorSchema = new Schema<ICollaborator>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },

    name: { type: String },
    education: { type: String },
    skills: { type: [String], default: [] },
    photoUrl: { type: String },
    description: { type: String },

    projects: { type: [ProjectCardSchema], default: [] },
    jobs: { type: [JobCardSchema], default: [] }
  },
  { timestamps: true }
);

// ------------------------- Singleton export -------------------------
const CollaboratorModel = mongoose.models.Collaborator || mongoose.model<ICollaborator>('Collaborator', CollaboratorSchema);

export default CollaboratorModel;

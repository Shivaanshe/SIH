import mongoose from 'mongoose';

/**
 * SkillTaxonomy Schema
 * Canonical skill dictionary with synonyms, category, domain pack, and curated learning pathways.
 */
const skillTaxonomySchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  aliases: [{ type: String }],
  category: {
    type: String,
    default: 'General'
  },
  domainPack: {
    type: String,
    enum: ['ayush', 'tech'],
    default: 'ayush'
  },
  description: {
    type: String,
    default: ''
  },
  resources: [
    {
      title: { type: String, required: true },
      provider: { type: String, default: 'SWAYAM / NPTEL' },
      url: { type: String, default: 'https://swayam.gov.in' },
      type: { type: String, default: 'Online Certification' },
      estMinutes: { type: Number, default: 90 }
    }
  ],
  projectIdea: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const SkillTaxonomy = mongoose.model('SkillTaxonomy', skillTaxonomySchema);

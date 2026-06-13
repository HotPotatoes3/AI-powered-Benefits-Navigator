import admin from 'firebase-admin'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GCP_PROJECT_ID,
  })
}

const db = admin.firestore()

interface Benefit {
  id: string
  name: string
  description: string
  eligibility: string
  website?: string
  applicationProcess?: string
  benefits?: string
  state?: string
}

interface ConversationRecord {
  message: string
  lifeSituation?: string
  conversationHistory?: Array<{ role: string; content: string }>
  response?: string
  benefits?: Array<{ name: string; description: string }>
}

const DEFAULT_SITUATION_PROFILES = [
  { id: 'student', label: 'Student', summary: 'Students and recent learners', focus: 'education, tuition, and student support' },
  { id: 'employed', label: 'Employed', summary: 'Working adults and employees', focus: 'workplace benefits, income support, and training' },
  { id: 'unemployed', label: 'Unemployed', summary: 'People currently without work', focus: 'job-seeker support, unemployment aid, and retraining' },
  { id: 'retired', label: 'Retired', summary: 'Retirees and older adults', focus: 'pension, housing, and healthcare support' },
  { id: 'other', label: 'Other', summary: 'Other or mixed circumstances', focus: 'custom benefits recommendations' },
]

export const firestoreService = {
  async getAllBenefits(): Promise<Benefit[]> {
    try {
      const snapshot = await db.collection('benefits').get()
      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Benefit[]
    } catch (error) {
      console.error('Error fetching benefits:', error)
      throw new Error('Failed to fetch benefits')
    }
  },

  async getBenefitById(id: string): Promise<Benefit | null> {
    try {
      const doc = await db.collection('benefits').doc(id).get()
      if (!doc.exists) {
        return null
      }
      return {
        id: doc.id,
        ...doc.data(),
      } as Benefit
    } catch (error) {
      console.error('Error fetching benefit:', error)
      throw new Error('Failed to fetch benefit')
    }
  },

  async searchBenefitsByKeywords(keywords: string[]): Promise<Benefit[]> {
    try {
      const benefitsRef = db.collection('benefits')
      let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = benefitsRef

      for (const keyword of keywords) {
        query = query.where('keywords', 'array-contains', keyword.toLowerCase())
      }

      const snapshot = await query.get()
      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Benefit[]
    } catch (error) {
      console.error('Error searching benefits:', error)
      return []
    }
  },

  async saveBenefit(benefit: Benefit): Promise<string> {
    try {
      const docRef = await db.collection('benefits').add(benefit)
      return docRef.id
    } catch (error) {
      console.error('Error saving benefit:', error)
      throw new Error('Failed to save benefit')
    }
  },

  async seedSituationProfiles(): Promise<void> {
    try {
      const batch = db.batch()
      const situationsRef = db.collection('situations')

      DEFAULT_SITUATION_PROFILES.forEach((profile) => {
        batch.set(
          situationsRef.doc(profile.id),
          {
            label: profile.label,
            summary: profile.summary,
            focus: profile.focus,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
      })

      await batch.commit()
    } catch (error) {
      console.error('Error seeding life-situation profiles:', error)
    }
  },

  async saveConversationEntry(entry: ConversationRecord): Promise<string> {
    try {
      const docRef = await db.collection('conversations').add({
        ...entry,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      return docRef.id
    } catch (error) {
      console.error('Error saving conversation feedback:', error)
      throw new Error('Failed to save conversation entry')
    }
  },
}

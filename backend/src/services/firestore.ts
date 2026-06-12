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
}

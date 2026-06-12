import { Router, Request, Response } from 'express'
import { firestoreService } from '../services/firestore'

const router = Router()

// Get all benefits
router.get('/', async (req: Request, res: Response) => {
  try {
    const benefits = await firestoreService.getAllBenefits()
    res.json(benefits)
  } catch (error) {
    console.error('Error fetching benefits:', error)
    res.status(500).json({ error: 'Failed to fetch benefits' })
  }
})

// Get benefit by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const benefit = await firestoreService.getBenefitById(id)

    if (!benefit) {
      return res.status(404).json({ error: 'Benefit not found' })
    }

    res.json(benefit)
  } catch (error) {
    console.error('Error fetching benefit:', error)
    res.status(500).json({ error: 'Failed to fetch benefit' })
  }
})

export default router

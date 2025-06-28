const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Create new member
router.post('/', async (req, res) => {
  try {
    const member = new Member({
        ...req.body,
        totalPurchaseAmountLastMonth: 0,
        visitHistory: []
      });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a visit to a member

router.post('/:id/visit', async (req, res) => {
    try {
      const { activities, amount } = req.body;
  
      const member = await Member.findById(req.params.id);
      if (!member) return res.status(404).json({ error: 'Member not found' });
  
      // Add visit
      member.visitHistory.push({
        activities,
        purchaseAmount: amount || 0
      });
  
      // Recalculate total purchase in the last month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
      const totalLastMonth = member.visitHistory
        .filter(v => new Date(v.date) >= oneMonthAgo)
        .reduce((sum, v) => sum + (v.purchaseAmount || 0), 0);
  
      member.totalPurchaseAmountLastMonth = totalLastMonth;
  
      await member.save();
      res.json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  


// router.post('/:id/visit', async (req, res) => {
//   try {
//     const { activities } = req.body;
//     const member = await Member.findById(req.params.id);
//     member.visitHistory.push({ activities });
//     await member.save();
//     res.json(member);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// Get all members (or single member)
router.get('/', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

router.get('/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  res.json(member);
});

module.exports = router;

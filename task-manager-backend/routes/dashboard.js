const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authenticateToken = require('../middleware/authMiddleware');

// OBCIĄŻENIE ZESPOŁU

router.get('/:projectId/workload', authenticateToken, async (req, res) => {


  try {

  const workload = await prisma.user.findMany({
    where: { 
      projects: { 
        some: { 
          projectId: parseInt(req.params.projectId) 
        } 
      } 
    },
    select: {
      id: true,
      username: true,
      _count: { 
        select: {
          where: { 
            tasks: { 
              some: { 
                projectId: parseInt(req.params.projectId), 
                status: { not: 'DONE' } 
              } 
            } 
          }
        }
      }
    }
  });

  const result = workload.map(user => ({
    userId: user.id,
    username: user.username,
    activeTasksCount: user._count.tasks,
    isOverloaded: user._count.tasks > 5
  }));
  res.json({message:"Wysyłanie obciążenia..", result});
   } catch (e) {
     res.status(500).json({message:"Something went wrong..." +  e.message})
   }
});


// WYKRES POSTĘPU

router.get('/:projectId/progress', authenticateToken, async (req, res) => {


  try {

  const stats = await prisma.task.groupBy({

    by: ['status'],
    where: { projectId: parseInt(req.params.projectId) },
    _count: { id: true }

  });

  const totalTasks = await prisma.tasks.count({
    where: { projectId: projectId}
  });

  res.json({
    totalTasks,
    stats: stats.map(s => ({
      status: s.status,
      count: s._count.id,
      percentage: totalTasks > 0 ? ((s._count.id / totalTasks) * 100).toFixed(2) : 0
    }))
  });
  } catch (e) {
     res.status(500).json({message:"Something went wrong..." +  e.message})
  }
});

module.exports = router;
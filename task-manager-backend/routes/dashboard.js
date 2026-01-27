const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authenticateToken = require('../middleware/authMiddleware');


router.get('/:projectId/workload', authenticateToken, async (req, res) => {
  const projectId = parseInt(req.params.projectId);
  
  if (isNaN(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID" });
  }

  try {
    const workload = await prisma.user.findMany({
      where: {
        projects: { some: { projectId: projectId } }
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            tasks: { 
              where: {
                projectId: projectId,
                status: { not: 'DONE' }
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

    res.json(result);
  } catch (e) {
    console.error("DASHBOARD WORKLOAD ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});


router.get('/:projectId/progress', authenticateToken, async (req, res) => {
  const projectId = parseInt(req.params.projectId);

  if (isNaN(projectId)) {
    return res.status(400).json({ error: "Invalid Project ID" });
  }

  try {
    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: projectId },
      _count: { id: true }
    });

    const totalTasks = await prisma.task.count({
      where: { projectId: projectId }
    });

    
    const formattedStats = stats.map(s => ({
      status: s.status,
      count: s._count.id,
      percentage: totalTasks > 0 ? ((s._count.id / totalTasks) * 100).toFixed(2) : 0
    }));

    res.json({
      totalTasks,
      stats: formattedStats
    });
  } catch (e) {
    console.error("DASHBOARD PROGRESS ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
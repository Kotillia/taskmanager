const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authenticateToken = require('../middleware/authMiddleware');

// TWORZENIE ZADANIA

router.post ('/', authenticateToken, async (req, res) => {
    const { title, description, priority, projectId } = req.body;
    try {

    const task = await prisma.task.create({
        data: {
            title,
            description,
            priority: priority || 'MEDIUM',
            projectId: parseInt(projectId)
        }
    });

    res.status(201).json({message: "Task addded",task});

    } catch (e) {
        res.status(500).json({message:"Something went wrong.." , error: e.message});
    }
});

// EDYCJA

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updatedTask = await prisma.task.update({
        where: { id: parseInt(id)},
        data: req.body
    });
    res.json(updatedTask);
});

// USUNIĘCIE

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({ where: {id: parseInt(id)}});
    res.json({message: "Task deleted"});
});


// POBIERANIE ZADAŃ

router.get('/', authenticateToken, async ( req, res) => {
    const { status, priority, projectId, userId } = req.query;

    const tasks = await prisma.task.findMany({
        where: {
            status: status || undefined,
            priority: priority || undefined,
            assignees: userId ? { some: { id: parseInt(userId)}} : undefined,
            projectId: projectId ? parseInt(projectId) : undefined
        },
        include: { assignees: true }
    });
    res.json(tasks);
});

// PRZYPISYWANIE WIELU OSÓB (LUB JEDNEJ)
router.patch('/:id/assign', authenticateToken, async (req, res) => {

    const { userIds } = req.body;
    const taskId = parseInt(req.params.id);

    try {

    const task = await prisma.task.update ({
        where: {id: taskId},
        data: {
            assignees: {
                set: userIds.map(id => ({id: parseInt(id)}))
            }
        },
        include: { assignees: true }
    });

    res.status(201).json({message:"Make them work!!! Mu-ha-ha-ha!", task});


    } catch (e) {
         res.status(500).json({message:"Something went wrong..." +  e.message})
    }
});


//ZMIANA STATUSU I BLOKOWANIE

router.patch('/:id/status', authenticateToken, async (req, res) => {
    const { status, blockReason } = req.body;
    const taskId = parseInt(req.params.id);

    try {

    if (status === 'BLOCKED' && !blockReason) {
        return res.status(400).json({error: "Please provide reason"});
    }

    const task = await prisma.task.update({
        where: { id: taskId },
        data: { status,
            blockReason: status === 'BLOCKED' ? blockReason: null
        }
    });


    res.status(201).json({message: "Task updated!", task});


    } catch (e) {
        res.status(500).json({message:"Something went wrong..." +  e.message})
    }
});


module.exports = router;
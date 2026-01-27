const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const authenticateToken = require('../middleware/authMiddleware');
const crypto = require('crypto');
const { sendInvitationEmail } = require('../lib/emailService');


// UTWORZENIE PROJEKTU


router.post('/', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const project = await prisma.project.create({
        data: {
            name,
            members: {
                create: {userId: req.user.userId, role: 'OWNER'}
            }
        }
    });
    res.json(project);
});


// USUNIĘCIE PROJEKTU


router.delete('/:id', authenticateToken, async (req, res) => {
  const projectId = parseInt(req.params.id);

  try {
  
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.userId, projectId } }
    });

    if (!membership || membership.role !== 'OWNER') {
      return res.status(403).json({ error: "Only the Owner can delete the project." });
    }

    
    await prisma.task.deleteMany({ where: { projectId } });
    await prisma.projectMember.deleteMany({ where: { projectId } });
    await prisma.invitation.deleteMany({ where: { projectId } });
    
    
    await prisma.project.delete({ where: { id: projectId } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ZAPROSZENIE UŻYTKOWNIKA


router.post('/:id/invite', authenticateToken, async (req, res) => {
    const { email, role } = req.body;
    const projectId = parseInt(req.params.id);

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId }});

        const token = crypto.randomBytes(32).toString('hex');

        await prisma.invitation.create ({
            data: {
                email,
                role: role || 'WORKER',
                token,
                projectId
            }
        });
        const inviteLink = `http://localhost:3000/projects/accept-invitation?token=${token}`;
        await sendInvitationEmail(email, project.name, inviteLink);

        res.json({message: "Email sent - " + email});
    } catch (error) {
        res.status(500).json({error: "Something went wrong"});
    }
   
});

// AKCEPTACJA ZAPROSZENIA

router.get('/accept-invitation', async (req, res) => {
    const { token } = req.query;

    const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: { project: true }
    });

    if (!invitation || invitation.status !== 'PENDING') {
        return res.status(404).send("Already used or expired.");
    }

    const user = await prisma.user.findUnique({ where: { email: invitation.email }});

    if (!user) {
        return res.redirect(`http://localhost:5173/register?email=${invitation.email}&token=${token}`);
    }

    await prisma.projectMember.create({
        data: {
            projectId: invitation.projectId,
            userId: user.id,
            role: invitation.role
        }
    });

    res.send(`You succesfully joined ${invitation.project.name}. Now you can log in.`)
});

// ZARZĄDZANIE ROLAMI

router.patch('/:projectId/members/:userId/role', authenticateToken, async (req, res) => {
  const { projectId, userId } = req.params;
  const { role } = req.body; 

  try {
    
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.userId,
          projectId: parseInt(projectId)
        }
      }
    });

    if (!requester || requester.role !== 'OWNER') {
      return res.status(403).json({ error: "Only the Owner can change roles." });
    }

    
    const targetMember = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: parseInt(userId),
                projectId: parseInt(projectId)
            }
        }
    });

    if (targetMember.role === 'OWNER') {
        return res.status(400).json({ error: "Cannot change Owner's role." });
    }

   
    const updatedMember = await prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: parseInt(userId),
          projectId: parseInt(projectId)
        }
      },
      data: { role: role }
    });

    res.json({ message: "Role updated successfully", member: updatedMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update role." });
  }
});


// POBRANIE PROJEKTÓW

router.get('/my', authenticateToken, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      members: { some: { userId: req.user.userId } }
    }
  });
  res.json(projects);
});

//LISTA CZŁONKÓW

router.get('/:id/members', authenticateToken, async (req, res) => {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId: parseInt(req.params.id) },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania członków" });
  }
});

// USUNIĘCIE CZŁONKA Z PROJEKTU

router.delete('/:projectId/members/:userId', authenticateToken, async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    
    const requester = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.userId,
          projectId: parseInt(projectId)
        }
      }
    });

    if (!requester || requester.role !== 'OWNER') {
      return res.status(403).json({ error: "Only the Project Owner can remove members." });
    }


    if (parseInt(userId) === req.user.userId) {
      return res.status(400).json({ error: "You cannot remove yourself from your own project." });
    }


    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: parseInt(userId),
          projectId: parseInt(projectId)
        }
      }
    });

    res.json({ message: "Member removed from project." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove member." });
  }
});

module.exports = router;
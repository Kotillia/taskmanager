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
        return res.redirect(`http://localhost:3000/auth/register?email=${invitation.email}&token=${token}`);
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

router.patch('/:id/members/:userId', authenticateToken, async (req, res) => {
    const updateMember = await prisma.projectMember.update({
        where: {
            userId_projectId: {
                userId: parseInt(req.params.userId),
                projectId: parseInt(req.params.id)
            }
        },
        data: { role: req.body.role }
    });
    res.json(updateMember);
})

module.exports = router;
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
// REJESTRACJA

router.post('/register', async (req, res) => {
    const { email, password, username, token: invitationToken } = req.body;


    try {

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({

            data: {
                email,
                username,
                password: hashedPassword,
            }
                
        });
        if (invitationToken) {
        const invitation = await prisma.invitation.findFirst({
            where: {
                email: email,
                status: 'PENDING',
                token: invitationToken
            }
        
        });

            if (invitation) {
            await prisma.projectMember.create({
                data: {
                    projectId: invitation.projectId,
                    userId: user.id,
                    role: invitation.role
                }

            });

            await prisma.invitation.update({
                where: { id: invitation.id},
                data: { status: 'ACCEPTED' }
            });

            console.log(`User ${email} has been added to projectID: ${invitation.projectId}`);
            }
        }
        

        const token = jwt.sign(
            {userId: user.id},
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: "Regestration success",
            token, 
            user:  {id: user.id, username: user.username, email: user.email}
        });
        } catch (e) {
            res.status(400).json({ error: "Regestration failed."});
        }

});


// LOGOWANIE

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: {email} });

    if (!user) {
        return res.status(401).json({ error: "Incorect data."});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorect data."});
    }


    const token = jwt.sign(
        {userId: user.id},
        JWT_SECRET,
        {expiresIn: '24h'}
    );

    res.json({
        message: "Login success.",
        token: token,
        user: { id: user.id, username: user.username, role: user.role }
    });
    //old login
   /* if (user && await bcrypt.compare(password, user.password)) {
        res.json({ message: "Login success.", userId: user.id, role: user.role });
    } else {
        res.status(401).json({error:"Login failed."});
    }*/
});

module.exports = router;
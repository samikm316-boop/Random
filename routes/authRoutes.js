const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
          }

            try {
                // Verify the Google ID token
                    const ticket = await client.verifyIdToken({
                          idToken: token,
                                audience: process.env.GOOGLE_CLIENT_ID,
                                    });
                                        
                                            const payload = ticket.getPayload();
                                                const googleId = payload['sub'];
                                                    const email = payload['email'];
                                                        const name = payload['name'];
                                                            const picture = payload['picture'];

                                                                // Check if the user already exists in the database
                                                                    let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
                                                                        let user = userResult.rows[0];

                                                                            // If the user doesn't exist, create a new record
                                                                                if (!user) {
                                                                                      const insertQuery = `
                                                                                              INSERT INTO users (google_id, email, name, profile_picture, total_xp)
                                                                                                      VALUES ($1, $2, $3, $4, 0)
                                                                                                              RETURNING *;
                                                                                                                    `;
                                                                                                                          const insertValues = [googleId, email, name, picture];
                                                                                                                                const newRecord = await pool.query(insertQuery, insertValues);
                                                                                                                                      user = newRecord.rows[0];
                                                                                                                                          }

                                                                                                                                              // Generate a JWT for the authenticated session
                                                                                                                                                  const sessionToken = jwt.sign(
                                                                                                                                                        { userId: user.id, email: user.email },
                                                                                                                                                              process.env.JWT_SECRET,
                                                                                                                                                                    { expiresIn: '7d' } 
                                                                                                                                                                        );

                                                                                                                                                                            res.status(200).json({
                                                                                                                                                                                  message: 'Authentication successful',
                                                                                                                                                                                        token: sessionToken,
                                                                                                                                                                                              user: {
                                                                                                                                                                                                      id: user.id,
                                                                                                                                                                                                              name: user.name,
                                                                                                                                                                                                                      email: user.email,
                                                                                                                                                                                                                              picture: user.profile_picture,
                                                                                                                                                                                                                                      total_xp: user.total_xp
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                                                      console.error('Error verifying Google token:', error);
                                                                                                                                                                                                                                                          res.status(401).json({ error: 'Invalid Google token' });
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                            module.exports = router;
                                                                                                                                                                                                                                                            
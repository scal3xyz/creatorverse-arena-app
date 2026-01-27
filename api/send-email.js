// Vercel API Route for sending emails via Resend
// Environment variable needed: RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, to, data } = req.body;

  if (!type || !to) {
    return res.status(400).json({ error: 'Missing required fields: type, to' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Email templates
  const templates = {
    'team-invite': {
      subject: '🎉 You\'ve been invited to SCAL3 Arena Admin',
      html: `
        <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2D7FF9; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SCAL3 Arena</h1>
            <p style="color: #b3d4fc; margin: 10px 0 0 0;">Creatorverse Admin Portal</p>
          </div>
          <div style="background: white; padding: 30px; border: 2px solid #232324; border-top: none; border-radius: 0 0 16px 16px;">
            <h2 style="color: #232324; margin-top: 0;">You're Invited! 🎉</h2>
            <p style="color: #666; line-height: 1.6;">
              You've been invited to join the <strong>SCAL3 Arena</strong> admin team by ${data?.invitedBy || 'the team owner'}.
            </p>
            <p style="color: #666; line-height: 1.6;">
              As a team member, you'll be able to:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>View and manage campaigns</li>
              <li>Review and approve creator submissions</li>
              <li>View creator profiles</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://creatorverse-arena.vercel.app/" style="background: #2D7FF9; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; border: 3px solid #232324;">
                Access Admin Dashboard →
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Log in with this email address (${to}) to access the admin dashboard.
            </p>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © 2026 SCAL3 • The Creatorverse
          </p>
        </div>
      `
    },
    'password-reset': {
      subject: '🔐 Reset your SCAL3 Arena password',
      html: `
        <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2D7FF9; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SCAL3 Arena</h1>
            <p style="color: #b3d4fc; margin: 10px 0 0 0;">Password Reset</p>
          </div>
          <div style="background: white; padding: 30px; border: 2px solid #232324; border-top: none; border-radius: 0 0 16px 16px;">
            <h2 style="color: #232324; margin-top: 0;">Reset Your Password 🔐</h2>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password for your SCAL3 Arena account.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Your temporary password is:
            </p>
            <div style="background: #FFF7E9; border: 3px solid #232324; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <code style="font-size: 24px; font-weight: bold; color: #2D7FF9; letter-spacing: 2px;">${data?.tempPassword || 'ERROR'}</code>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Use this temporary password to log in, then change it immediately in your Profile settings.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://creatorverse-arena.vercel.app/" style="background: #2D7FF9; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; border: 3px solid #232324;">
                Log In Now →
              </a>
            </div>
            <p style="color: #ff6b6b; font-size: 14px; margin-top: 30px;">
              ⚠️ If you didn't request this password reset, please ignore this email or contact support.
            </p>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © 2026 SCAL3 • The Creatorverse
          </p>
        </div>
      `
    },
    'welcome': {
      subject: '🎉 Welcome to SCAL3 Arena!',
      html: `
        <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2D7FF9; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">SCAL3 Arena</h1>
            <p style="color: #b3d4fc; margin: 10px 0 0 0;">Welcome to the Creatorverse</p>
          </div>
          <div style="background: white; padding: 30px; border: 2px solid #232324; border-top: none; border-radius: 0 0 16px 16px;">
            <h2 style="color: #232324; margin-top: 0;">Welcome, ${data?.name || 'Creator'}! 🎉</h2>
            <p style="color: #666; line-height: 1.6;">
              You've been approved to join the <strong>SCAL3 Creatorverse Arena</strong>!
            </p>
            <p style="color: #666; line-height: 1.6;">
              As a Creatorverse creator, you can:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Participate in paid crypto campaigns</li>
              <li>Earn rewards for your content</li>
              <li>Compete with other creators</li>
              <li>Track your earnings and submissions</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://creatorverse-arena.vercel.app/" style="background: #18B369; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; border: 3px solid #232324;">
                Sign Up & Get Started →
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Use your email (${to}) to sign up and set your password.
            </p>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © 2026 SCAL3 • The Creatorverse
          </p>
        </div>
      `
    }
  };

  const template = templates[type];
  
  if (!template) {
    return res.status(400).json({ error: `Unknown email type: ${type}` });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SCAL3 Arena <noreply@resend.dev>', // Use your verified domain in production
        to: to,
        subject: template.subject,
        html: template.html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return res.status(response.status).json({ error: result.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e7ac1efd/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-e7ac1efd/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, userType, hostProfile, participantProfile, employerProfile } = body;

    // Create user with Supabase Auth
    // Auto-confirm email to allow immediate login after sign-up
    // Account verification (isVerified) is handled separately within account settings
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        userType,
        hostProfile,
        participantProfile,
        employerProfile,
        isVerified: false,
      },
      // Auto-confirm email so users can sign in immediately without email verification
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data in KV store
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      name,
      userType,
      hostProfile,
      participantProfile,
      employerProfile,
      isVerified: false,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: {
        id: userId,
        email: data.user.email,
        name,
        userType,
        hostProfile,
        participantProfile,
        employerProfile,
        isVerified: false,
      }
    });
  } catch (err) {
    console.log('Signup exception:', err);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-e7ac1efd/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`user:${userId}`);

    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ profile });
  } catch (err) {
    console.log('Get user profile error:', err);
    return c.json({ error: 'Failed to get user profile' }, 500);
  }
});

// Update user profile endpoint
app.put("/make-server-e7ac1efd/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    // Verify user is authenticated
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken ?? '');
    if (!user || user.id !== userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const currentProfile = await kv.get(`user:${userId}`);

    const updatedProfile = {
      ...currentProfile,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.log('Update user profile error:', err);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

Deno.serve(app.fetch);
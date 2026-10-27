import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  buildLyzrPrompt,
  generateLocalAuditKit,
  parseLyzrResponseToKit,
} from './src/services/biasEngine';
import { GenerateKitRequest, InterviewKit } from './src/types/fairhire';

dotenv.config();

const app = express();
app.use(express.json({ limit: '5mb' }));

// Basic In-Memory Rate Limiter (20 requests per minute per IP)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function rateLimitMiddleware(req: Request, res: Response, next: () => void) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before generating another interview kit.',
      retryAfterSeconds: retryAfter,
    });
  }

  record.count += 1;
  next();
}

// Check configuration status endpoint
app.get('/api/config-status', (_req: Request, res: Response) => {
  const hasLyzrKey = Boolean(process.env.LYZR_API_KEY && process.env.LYZR_API_KEY.trim().length > 0);
  const hasAgentId = Boolean(process.env.LYZR_AGENT_ID && process.env.LYZR_AGENT_ID.trim().length > 0);
  
  res.json({
    configured: hasLyzrKey && hasAgentId,
    hasLyzrKey,
    hasAgentId,
    mode: hasLyzrKey && hasAgentId ? 'Lyzr Agent V3' : 'FairHire Local Compliance Engine (Fallback Active)',
  });
});

// Primary generation endpoint (/api/generate)
app.post('/api/generate', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const body: GenerateKitRequest = req.body;
    if (!body || !body.jd || !body.jd.trim()) {
      return res.status(400).json({ error: 'Job description text (jd) is required.' });
    }

    const lyzrApiKey = process.env.LYZR_API_KEY?.trim();
    const lyzrAgentId = process.env.LYZR_AGENT_ID?.trim();
    const sessionId = body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userId = body.userId || 'anonymous-recruiter@fairhire.app';

    // If Lyzr credentials exist, attempt Lyzr Agent API call
    if (lyzrApiKey && lyzrAgentId) {
      const promptMessage = buildLyzrPrompt(body);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      try {
        const lyzrResponse = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': lyzrApiKey,
          },
          body: JSON.stringify({
            user_id: userId,
            agent_id: lyzrAgentId,
            session_id: sessionId,
            message: promptMessage,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!lyzrResponse.ok) {
          const errText = await lyzrResponse.text();
          console.warn(`Lyzr API error (${lyzrResponse.status}):`, errText);
          // Fall back gracefully to local audit engine with notification
          const kit = generateLocalAuditKit(body);
          kit.sessionId = sessionId;
          return res.json({
            kit,
            source: 'fallback_engine',
            warning: `Lyzr returned status ${lyzrResponse.status}. Generated via FairHire Local Compliance Engine.`,
          });
        }

        const data: any = await lyzrResponse.json();
        // Lyzr typically returns { response: "..." } or { data: { message: "..." } }
        const rawContent = data.response || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
        
        const kit: InterviewKit = parseLyzrResponseToKit(rawContent, body);
        kit.sessionId = sessionId;
        return res.json({
          kit,
          source: 'lyzr',
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        console.warn('Lyzr fetch error or timeout:', fetchErr.message);

        // Fallback to high-quality local audit
        const kit = generateLocalAuditKit(body);
        kit.sessionId = sessionId;
        return res.json({
          kit,
          source: 'fallback_engine',
          warning: fetchErr.name === 'AbortError'
            ? 'Lyzr API request timed out (45s). Generated kit via FairHire Local Compliance Engine.'
            : `Network error connecting to Lyzr (${fetchErr.message}). Generated kit via FairHire Local Compliance Engine.`,
        });
      }
    } else {
      // Lyzr credentials are not configured in .env, run local compliance engine seamlessly
      const kit = generateLocalAuditKit(body);
      kit.sessionId = sessionId;
      return res.json({
        kit,
        source: 'fallback_engine',
        warning: 'LYZR_API_KEY / LYZR_AGENT_ID not configured in server environment. Generated via FairHire Local Compliance Engine.',
      });
    }
  } catch (error: any) {
    console.error('Unhandled generation error:', error);
    res.status(500).json({
      error: 'An unexpected error occurred while processing the interview kit.',
      details: error.message,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Parse command line arguments (e.g. tsx server.ts --port 3000 --host 0.0.0.0)
  const args = process.argv.slice(2);
  let port = 3000;
  let host = '0.0.0.0';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      const parsed = Number(args[i + 1]);
      if (!isNaN(parsed) && parsed !== 8080) port = parsed;
      i++;
    } else if (args[i].startsWith('--port=')) {
      const parsed = Number(args[i].split('=')[1]);
      if (!isNaN(parsed) && parsed !== 8080) port = parsed;
    } else if (args[i] === '--host' && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (args[i].startsWith('--host=')) {
      host = args[i].split('=')[1];
    }
  }

  // AI Studio requires port 3000 for the applet dev server
  if (!isProd) {
    port = 3000;
  }

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // Disable HMR to avoid port 24678 conflicts
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(port, host, () => {
    console.log(`FairHire server running at http://${host}:${port} [${isProd ? 'production' : 'development'}]`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Retrying...`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();

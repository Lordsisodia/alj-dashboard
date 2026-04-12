// Notification service for job completion/failure
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export interface JobNotification {
  jobName: string;
  modelName: string;
  provider: string;
  status: 'completed' | 'failed' | 'ready';
  videoUrl?: string;
}

export async function sendJobNotification(notification: JobNotification) {
  const { jobName, modelName, provider, status, videoUrl } = notification;

  const emoji = status === 'failed' ? '❌' : status === 'ready' ? '✅' : '⏳';
  const message = status === 'failed'
    ? `❌ Job failed: ${jobName}\nModel: ${modelName} (${provider})`
    : status === 'completed'
    ? `✅ Job complete: ${jobName}\nModel: ${modelName} (${provider})${videoUrl ? `\n🔗 ${videoUrl}` : ''}`
    : `⏳ Job ready: ${jobName}\nModel: ${modelName} (${provider})`;

  // Send to Telegram if configured
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('[notifications] Telegram send failed:', err);
    }
  }

  // Send to Slack if configured
  if (SLACK_WEBHOOK_URL) {
    try {
      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
    } catch (err) {
      console.error('[notifications] Slack send failed:', err);
    }
  }
}

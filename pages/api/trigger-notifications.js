import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    exec('node scripts/sendDailyNotifications.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing script:', error);
        return res.status(500).json({ error: 'Script execution failed' });
      }
      console.log('Script output:', stdout);
      res.status(200).json({ message: 'Script executed successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

# Remotion render runner

A manually dispatched Remotion render on a standard GitHub-hosted Linux runner.
The source bundle and output file use AES-256-GCM envelopes. Each job uses a
fresh 32-byte key, supplied as the RENDER_KEY Actions secret, and a private,
time-limited input download URL in INPUT_URL. The application implements
npm run check and npm run render. Only the sealed result is uploaded.

#!/bin/bash
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:$PATH"
export NODE_OPTIONS="--max-old-space-size=8192"
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
exec node node_modules/.bin/next dev

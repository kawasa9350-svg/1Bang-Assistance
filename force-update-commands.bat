@echo off
echo Forcing update of Discord commands (Instant Guild Update)...
set DEPLOY_TARGET=guild
node deploy-commands.js
pause

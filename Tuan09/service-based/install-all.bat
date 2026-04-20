@echo off
echo ============================================
echo  Mini Food Ordering System - Install All
echo ============================================
echo.

echo [1/5] Installing User Service dependencies...
cd /d "%~dp0user-service"
call npm install

echo [2/5] Installing Food Service dependencies...
cd /d "%~dp0food-service"
call npm install

echo [3/5] Installing Order Service dependencies...
cd /d "%~dp0order-service"
call npm install

echo [4/5] Installing Payment Service dependencies...
cd /d "%~dp0payment-service"
call npm install

echo [5/5] Installing Frontend dependencies...
cd /d "%~dp0frontend"
call npm install

echo.
echo ============================================
echo  All dependencies installed successfully!
echo  Run start-all.bat to start all services.
echo ============================================
pause

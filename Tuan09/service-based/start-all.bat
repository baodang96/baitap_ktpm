@echo off
echo ============================================
echo  Mini Food Ordering System - Starting...
echo ============================================
echo.

echo Starting User Service on port 8081...
start "User Service :8081" cmd /c "cd /d %~dp0user-service && node server.js"

echo Starting Food Service on port 8082...
start "Food Service :8082" cmd /c "cd /d %~dp0food-service && node server.js"

echo Starting Order Service on port 8083...
start "Order Service :8083" cmd /c "cd /d %~dp0order-service && node server.js"

echo Starting Payment Service on port 8084...
start "Payment Service :8084" cmd /c "cd /d %~dp0payment-service && node server.js"

timeout /t 2 >nul

echo Starting Frontend on port 5173...
start "Frontend :5173" cmd /c "cd /d %~dp0frontend && npx vite --host"

echo.
echo ============================================
echo  All services started!
echo  Frontend: http://localhost:5173
echo  User Service: http://localhost:8081
echo  Food Service: http://localhost:8082
echo  Order Service: http://localhost:8083
echo  Payment Service: http://localhost:8084
echo ============================================
echo.
echo Press any key to stop all services...
pause >nul

echo Stopping all services...
taskkill /FI "WINDOWTITLE eq User Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Food Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Order Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Payment Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul 2>&1
echo All services stopped.

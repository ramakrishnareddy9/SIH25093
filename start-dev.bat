@echo off
echo Starting Smart Student Hub Development Environment...
echo.

echo Creating .env files if they don't exist...

REM Create backend .env file if it doesn't exist
if not exist "BackEnd\server\.env" (
    echo Creating backend .env file...
    copy "BackEnd\server\.env.example" "BackEnd\server\.env" >nul 2>&1
    echo Backend .env file created. Please update it with your MongoDB credentials.
)

REM Create frontend .env file if it doesn't exist
if not exist "FrontEnd\.env" (
    echo Creating frontend .env file...
    copy "FrontEnd\.env.example" "FrontEnd\.env" >nul 2>&1
    echo Frontend .env file created.
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd BackEnd\server && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd FrontEnd && npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul

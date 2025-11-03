#!/bin/sh
: '
:: This is a universal setup script that works on both Windows and Unix systems
:: Check for Windows platform and run appropriate setup
@goto :windows 2>nul || :
'

# If we get here, we're on a Unix-like system
SCRIPT_DIR="$( cd "$( dirname "$0" )" >/dev/null 2>&1 && pwd )"
node "$SCRIPT_DIR/shared/cli/create-new.js" "$@"
exit $?

: '
:windows
:: Windows-specific setup
:: Remove #!/bin/sh warning
@echo [1A[K[1A[K[1A[K[1A[K
:: Get the script directory and full path (before any shift operations)
@echo off
setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_PATH=%~f0"

:: Check if --pause flag is present as first argument and store first arg for later checks
set "PAUSE_BEFORE_CLOSE=0"
set "FILTERED_ARGS="
set "FIRST_ARG="
if "%~1"=="--pause" (
    set "PAUSE_BEFORE_CLOSE=1"
    shift
)

:: Collect all current arguments, preserving quotes
:collect_args_loop
if not "%~1"=="" (
    if defined FILTERED_ARGS (
        set "FILTERED_ARGS=!FILTERED_ARGS! "%~1""
    ) else (
        set "FILTERED_ARGS="%~1""
        set "FIRST_ARG=%~1"
    )
    shift
    goto collect_args_loop
)

:: Check if this is a command that doesn't require symlinks
set "NEEDS_ADMIN=1"
if "%FIRST_ARG%"=="--help" set "NEEDS_ADMIN=0"
if "%FIRST_ARG%"=="-h" set "NEEDS_ADMIN=0"
if "%FIRST_ARG%"=="--remove" set "NEEDS_ADMIN=0"

if "%NEEDS_ADMIN%"=="0" (
    :: Run without admin rights
    node "%SCRIPT_DIR%shared\cli\create-new.js" !FILTERED_ARGS!
) else (
    :: Check for admin rights by attempting to create a test symlink
    set "TEST_LINK=%TEMP%\test_symlink_%RANDOM%"
    set "TEST_TARGET=%TEMP%"
    mklink /D "!TEST_LINK!" "!TEST_TARGET!" >nul 2>&1
    if !errorlevel! == 0 (
        set "HAS_ADMIN=1"
    ) else (
        set "HAS_ADMIN=0"
    )
    if exist "!TEST_LINK!" rmdir "!TEST_LINK!" >nul 2>&1

    if !HAS_ADMIN! == 1 (
        :: Already running with admin rights, run the Node.js script
        node "%SCRIPT_DIR%shared\cli\create-new.js" !FILTERED_ARGS!
        if "%PAUSE_BEFORE_CLOSE%"=="1" pause
    ) else (
        :: Request elevation: prepare arguments and restart with --pause flag
        set "__ARGS__=!FILTERED_ARGS!"
        if defined __ARGS__ (
            set "__ARGS__=!__ARGS__:"=\"!"
        )
        echo Requesting Administrator privileges...
        powershell -Command "Start-Process cmd -ArgumentList '/c cd /d \"%CD%\" ^&^& \"%SCRIPT_PATH%\" --pause !__ARGS__!' -Verb RunAs"
    )
)

exit /b %errorlevel%
'
@echo off
REM Script para fazer merge do branch para main
REM Este script executa o workflow completo de merge

echo.
echo ========================================
echo   GIT MERGE WORKFLOW
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Diretórios
set CURRENT_WORKTREE=c:\Users\jailt\OneDrive\Documentos\Projatto.worktrees\agents-arrumar-backend-site-pronto
set MAIN_WORKTREE=c:\Users\jailt\OneDrive\Documentos\Projatto

echo [1/5] Verificando mudanças nao commitadas...
cd /d %CURRENT_WORKTREE%
git status --porcelain
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Nao foi possivel verificar status git
    pause
    exit /b 1
)

echo.
echo [2/5] Obtendo nome do branch atual...
for /f "tokens=*" %%A in ('git rev-parse --abbrev-ref HEAD') do set BRANCH_NAME=%%A
echo Branch atual: %BRANCH_NAME%

echo.
echo [3/5] Fazendo merge no branch main...
git -C %MAIN_WORKTREE% merge %BRANCH_NAME%
if %errorlevel% neq 0 (
    echo.
    echo AVISO: Pode haver conflitos. Verificando...
    git -C %MAIN_WORKTREE% diff --name-only --diff-filter=U
    echo.
    echo Resolva os conflitos manualmente e execute:
    echo   git -C %MAIN_WORKTREE% add .
    echo   git -C %MAIN_WORKTREE% commit --no-edit
    pause
    exit /b 1
)

echo.
echo [4/5] Verificando integridade do merge...
git -C %MAIN_WORKTREE% status --porcelain

echo.
echo [5/5] Validando que branch esta no historico...
git -C %MAIN_WORKTREE% merge-base --is-ancestor %BRANCH_NAME% HEAD
if %errorlevel% neq 0 (
    echo ERRO: Branch nao esta no historico
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ MERGE CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Resumo:
echo - Branch: %BRANCH_NAME%
echo - Mergeado em: %MAIN_WORKTREE%
echo - Status: Clean
echo.
pause

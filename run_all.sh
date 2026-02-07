#!/bin/bash

echo "🚀 Iniciando proceso de instalación y despliegue..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# 2. Construir la aplicación (Deploy/Build)
echo "🏗️  Construyendo la aplicación..."
pnpm run build

# 3. Iniciar servidor de desarrollo
echo "▶️  Iniciando servidor de desarrollo..."
pnpm run dev

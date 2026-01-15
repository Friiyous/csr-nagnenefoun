#!/bin/bash

# ============================================
# Script de déploiement EPS Manager
# ============================================

echo "🚀 Déploiement EPS Manager"

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que les variables sont configurées
check_env() {
    echo ""
    echo "📋 Vérification des variables d'environnement..."
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL manquant${NC}"
        echo "   Ajoutez-le dans .env.local ou les variables Vercel"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquant${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Variables d'environnement configurées${NC}"
}

# Build de l'application
build_app() {
    echo ""
    echo "🔨 Build de l'application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build réussi${NC}"
    else
        echo -e "${RED}❌ Build échoué${NC}"
        exit 1
    fi
}

# Vérification de la connexion Supabase
check_supabase() {
    echo ""
    echo "🗄️ Vérification connexion Supabase..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
        "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/eps?limit=1")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ Connexion Supabase OK${NC}"
    else
        echo -e "${YELLOW}⚠️ Connexion Supabase: code $response (continuation)${NC}"
    fi
}

# Instructions pour Vercel
show_vercel_instructions() {
    echo ""
    echo "============================================"
    echo -e "${GREEN}🎉 Prêt pour le déploiement !${NC}"
    echo "============================================"
    echo ""
    echo "Pour déployer sur Vercel:"
    echo ""
    echo "1. ${YELLOW}Push vers GitHub${NC}"
    echo "   git add ."
    echo "   git commit -m 'Ready for production'"
    echo "   git push origin main"
    echo ""
    echo "2. ${YELLOW}Aller sur Vercel${NC}"
    echo "   https://vercel.com/new"
    echo ""
    echo "3. ${YELLOW}Importer le repository${NC}"
    echo "   Choisir 'eps-manager'"
    echo ""
    echo "4. ${YELLOW}Configurer les variables${NC}"
    echo "   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
    echo "   SUPABASE_SERVICE_ROLE_KEY=eyJ..."
    echo ""
    echo "5. ${YELLOW}Déployer${NC}"
    echo "   Cliquer sur Deploy"
    echo ""
}

# Menu interactif
case "${1:-check}" in
    check)
        check_env
        ;;
    build)
        check_env
        build_app
        ;;
    all)
        check_env
        build_app
        check_supabase
        show_vercel_instructions
        ;;
    vercel)
        show_vercel_instructions
        ;;
    *)
        echo "Usage: $0 {check|build|all|vercel}"
        echo ""
        echo "  check    - Vérifier les variables d'environnement"
        echo "  build    - Build l'application"
        echo "  all      - Tout vérifier + build + instructions"
        echo "  vercel   - Afficher instructions Vercel"
        exit 1
        ;;
esac
#!/bin/zsh
# Sobe a versao do CRU nos TRES lugares que precisam bater: o numero que o app
# carregado compara (VERSAO no index), o que o servidor responde (versao.json) e
# o nome do cache do service worker. Fora de sincronia, o app ou nao se atualiza
# ou se atualiza em laco. Uso: ./bump.sh 13
[ -z "$1" ] && { echo "uso: ./bump.sh <numero>"; exit 1 }
cd "$(dirname "$0")"
sed -i '' "s|const VERSAO = \"[0-9]*\";|const VERSAO = \"$1\";|" index.html
sed -i '' "s|const CACHE = \"cru-v[0-9]*\";|const CACHE = \"cru-v$1\";|" sw.js
echo "{\"v\":\"$1\"}" > versao.json
grep -h "const VERSAO\|const CACHE" index.html sw.js; cat versao.json

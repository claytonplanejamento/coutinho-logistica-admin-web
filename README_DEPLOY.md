# Coutinho Logística - Central Administrativa Vercel

## Arquitetura
Navegador -> Vercel (index.html + /api/proxy) -> Apps Script

## 1. Apps Script
Cole o conteúdo de `AppsScript_API.gs` no final do seu `Code.gs`.

Depois execute UMA VEZ:
`gerarSegredoApiWebAdmin`

Copie o valor retornado. Ele será usado na Vercel como `COUTINHO_API_SECRET`.

Depois publique uma nova versão da implantação Web App mantendo:
- Executar como: Eu
- Quem pode acessar: Qualquer pessoa

## 2. Vercel
Crie um novo projeto na Vercel com estes arquivos.

Framework Preset: Other

Variáveis de ambiente:
- APPS_SCRIPT_URL = URL atual do /exec do Apps Script
- COUTINHO_API_SECRET = segredo gerado pelo Apps Script

Faça o Deploy.

## 3. Teste antes do domínio
Use a URL temporária da Vercel e confirme:
- login ADMIN
- online/offline
- rotas
- usuários
- dispositivos
- saúde do sistema

## 4. Domínio
Somente após o teste, configure na Vercel:
admin.claytonplanejamento.com.br

Não mude o DNS antes de o painel estar funcionando na URL temporária da Vercel.

// ============================================================
// COUTINHO LOGÍSTICA - API WEB ADMIN
// Cole este bloco no Code.gs do Apps Script.
// Não substitua suas funções existentes.
// Depois execute gerarSegredoApiWebAdmin() UMA VEZ.
// ============================================================

function gerarSegredoApiWebAdmin() {
  const secret = Utilities.getUuid() + Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('COUTINHO_API_SECRET', secret);
  return secret;
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('COUTINHO_API_SECRET');

    if (!expected) throw new Error('API Web Admin ainda não foi configurada. Execute gerarSegredoApiWebAdmin().');
    if (!body.secret || body.secret !== expected) throw new Error('Acesso API não autorizado.');

    const action = String(body.action || '').trim();
    const args = Array.isArray(body.args) ? body.args : [];

    const allowed = {
      loginMobile: function() { return loginMobile(args[0], args[1], args[2]); },
      validarSessaoMobile: function() { return validarSessaoMobile(args[0]); },
      logoutMobile: function() { return logoutMobile(args[0]); },
      heartbeatMobile: function() { return heartbeatMobile(args[0], args[1], args[2]); },
      getCentralOperacionalMobile: function() { return getCentralOperacionalMobile(args[0]); },
      getSecurityAdminMobile: function() { return getSecurityAdminMobile(args[0]); },
      createUserMobile: function() { return createUserMobile(args[0], args[1]); },
      setUserActiveMobile: function() { return setUserActiveMobile(args[0], args[1], args[2]); },
      resetUserPasswordMobile: function() { return resetUserPasswordMobile(args[0], args[1], args[2]); },
      approveDeviceMobile: function() { return approveDeviceMobile(args[0], args[1]); },
      revokeDeviceMobile: function() { return revokeDeviceMobile(args[0], args[1]); },
      getAppVersion: function() { return getAppVersion(); }
    };

    if (!allowed[action]) throw new Error('Ação API não permitida: ' + action);

    const result = allowed[action]();
    return ContentService.createTextOutput(JSON.stringify({ ok: true, result: result })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

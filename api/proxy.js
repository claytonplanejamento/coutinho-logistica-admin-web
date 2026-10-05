export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  const secret = process.env.COUTINHO_API_SECRET;

  if (!appsScriptUrl || !secret) {
    return res.status(500).json({
      ok: false,
      error: 'Variáveis APPS_SCRIPT_URL/COUTINHO_API_SECRET não configuradas na Vercel.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const upstream = await fetch(appsScriptUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        action: body.action,
        args: Array.isArray(body.args) ? body.args : []
      })
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); }
    catch {
      return res.status(502).json({ ok: false, error: 'Resposta não JSON recebida do Apps Script.', detail: text.slice(0, 500) });
    }

    if (data && data.ok === false) return res.status(400).json(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error && error.message ? error.message : String(error) });
  }
}

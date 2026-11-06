/**
 * Kontaktní formulář gabrielkozik.cz → Google tabulka + e-mailové upozornění.
 *
 * Skript musí být VÁZANÝ na tabulku (tabulka → Rozšíření → Apps Script),
 * nasazený jako webová aplikace: Spustit jako = Já, Přístup = Kdokoli.
 */

const CONFIG = {
  NOTIFY_TO: 'info@gabrielkozik.cz',   // kam chodí upozornění
  SHEET_NAME: 'Poptávky',
  TIMEZONE: 'Europe/Prague',
  RETENTION_DAYS: 365,                 // „smažu nejpozději do 12 měsíců“
  KEEP_STATUS: 'spolupráce',           // řádky s tímto stavem se nemažou
  MIN_FILL_MS: 3000,                   // rychleji vyplněný formulář = robot
  MAX_PER_10_MIN: 20,                  // pojistka proti zahlcení
};

const HEADER = ['Přijato', 'Jméno', 'E-mail', 'Zpráva', 'Jazyk', 'Stránka', 'Stav'];

/* ------------------------------------------------------------------ */
/* Příjem formuláře                                                    */
/* ------------------------------------------------------------------ */

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Past na roboty: vyplněné skryté pole nebo chybějící/příliš krátký čas vyplnění.
    // Robotovi tváříme úspěch, ať nezkouší jiné cesty.
    if (p.website) return json_({ ok: true });
    const ts = Number(p.ts || 0);
    if (!ts || Date.now() - ts < CONFIG.MIN_FILL_MS) return json_({ ok: true });

    const name = clean_(p.name, 200);
    const email = clean_(p.email, 254).toLowerCase();
    const message = clean_(p.message, 5000, true);
    const lang = p.lang === 'en' ? 'en' : 'cs';
    const page = clean_(p.page, 300);

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ ok: false, error: 'invalid' });
    }

    // Omezení opakovaného odesílání (stejný e-mail 1× za minutu, celkem 20 za 10 minut).
    const cache = CacheService.getScriptCache();
    if (cache.get('rl:' + email)) return json_({ ok: true });
    const total = Number(cache.get('rl:all') || 0);
    if (total >= CONFIG.MAX_PER_10_MIN) return json_({ ok: false, error: 'busy' });
    cache.put('rl:' + email, '1', 60);
    cache.put('rl:all', String(total + 1), 600);

    const now = new Date();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([now, safe_(name), safe_(email), safe_(message), lang, safe_(page), 'nová']);
    } finally {
      lock.releaseLock();
    }

    notify_({ name: name, email: email, message: message, lang: lang, page: page, at: now });
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

// Kontrola, že nasazení běží: otevři URL webové aplikace v prohlížeči.
function doGet() {
  return ContentService.createTextOutput('OK – kontaktní formulář běží.');
}

/* ------------------------------------------------------------------ */
/* Jednorázové nastavení + mazání starých poptávek                     */
/* ------------------------------------------------------------------ */

/** Spusť jednou ručně z editoru: založí list, nastaví denní mazání a pošle testovací e-mail. */
function nastavit() {
  sheet_();
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'smazStarePoptavky'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('smazStarePoptavky').timeBased().everyDays(1).atHour(3).create();
  MailApp.sendEmail(CONFIG.NOTIFY_TO, 'Test: kontaktní formulář je nastavený',
    'Upozornění z webu budou chodit sem.\nEvidence poptávek: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}

/** Smaže poptávky starší než RETENTION_DAYS, kromě řádků se stavem KEEP_STATUS. */
function smazStarePoptavky() {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return;
  const limit = Date.now() - CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const rows = sh.getRange(2, 1, last - 1, HEADER.length).getValues();
  for (let i = rows.length - 1; i >= 0; i--) {
    const date = rows[i][0];
    const status = String(rows[i][6] || '').trim().toLowerCase();
    if (date instanceof Date && date.getTime() < limit && status !== CONFIG.KEEP_STATUS) {
      sh.deleteRow(i + 2);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Pomocné funkce                                                      */
/* ------------------------------------------------------------------ */

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
    sh.getRange('A:A').setNumberFormat('d. M. yyyy H:mm');
    sh.setColumnWidth(4, 420);
  }
  return sh;
}

function notify_(d) {
  const when = Utilities.formatDate(d.at, CONFIG.TIMEZONE, 'd. M. yyyy H:mm');
  const body = [
    'Nová zpráva z kontaktního formuláře na gabrielkozik.cz',
    '',
    'Jméno: ' + d.name,
    'E-mail: ' + d.email,
    'Jazyk: ' + d.lang.toUpperCase(),
    'Stránka: ' + d.page,
    'Přijato: ' + when,
    '',
    'Zpráva:',
    d.message,
    '',
    '—',
    'Na tento e-mail můžete rovnou odpovědět, odpověď půjde odesílateli.',
    'Evidence poptávek: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ].join('\n');

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_TO,
    replyTo: d.email,
    name: 'Web gabrielkozik.cz',
    subject: 'Nová poptávka z webu – ' + d.name,
    body: body,
  });
}

// Ořízne, odstraní řídicí znaky; u jednořádkových polí i zalomení řádků.
function clean_(value, max, multiline) {
  let s = String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  if (!multiline) s = s.replace(/[\r\n\t]+/g, ' ');
  return s.trim().slice(0, max);
}

// Ochrana proti „formula injection“: text začínající =, +, -, @ se v tabulce nevyhodnotí jako vzorec.
function safe_(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

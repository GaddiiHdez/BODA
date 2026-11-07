/* Calendario: invitación preparada; el usuario confirma el guardado en su app. */
function initCalendar() {
  const button = document.getElementById('addToCalendarBtn');
  if (!button) return;

  // Tepic/Puga, UTC-7. The UTC instant is shared with countdown.js and the ICS.
  const start = Date.parse('2026-12-26T17:00:00-07:00');
  const end = Date.parse('2026-12-27T00:00:00-07:00');
  const title = 'Boda Alexis & Estefanía';
  const location = 'Parroquia Inmaculada Concepción y Casino El Campesino, Tepic, Puga, Nayarit';
  const description = 'Ceremonia: 5:00 p. m., Parroquia Inmaculada Concepción. Recepción: 6:00 p. m., Casino El Campesino.';
  const params = new URLSearchParams({
    action: 'TEMPLATE', text: title, dates: '20261227T000000Z/20261227T070000Z',
    ctz: 'America/Mazatlan', details: description, location
  });
  const googleUrl = `https://calendar.google.com/calendar/render?${params}`;
  const googleLink = document.getElementById('googleCalendarLink');
  if (googleLink) googleLink.href = googleUrl;

  const ua = navigator.userAgent;
  const apple = /iPhone|iPad|iPod|Macintosh/.test(ua);
  if (/Android/.test(ua)) {
    // Android resolves the calendar editor; Chrome provides the HTTPS fallback.
    button.href = 'intent://com.android.calendar/events#Intent;scheme=content;' +
      'action=android.intent.action.INSERT;type=vnd.android.cursor.dir/event;' +
      `S.title=${encodeURIComponent(title)};S.eventLocation=${encodeURIComponent(location)};` +
      `S.description=${encodeURIComponent(description)};l.beginTime=${start};l.endTime=${end};` +
      `S.browser_fallback_url=${encodeURIComponent(googleUrl)};end`;
  } else if (apple) {
    // A real calendar MIME type is served for this static .ics file.
    button.href = 'assets/boda-alexis-estefania.ics';
  } else {
    button.href = googleUrl;
    button.target = '_blank';
    button.rel = 'noopener';
  }
}

# Railway versiooni kontrollid

Kontrollitud 29.10.2026. Projekt: SoftWater-Assist-Railway.

- 20 automaattesti läbisid: 11 serveri API testi, 5 simuleeritud vastuste testi, 4 nõuandetaimeri testi.
- API testides on andmebaas asendatud kontrollitava testobjektiga. Need ei tõenda tegelikku PostgreSQL ühendust.
- Prisma 6.19.3 andmemudel valideerus. Kontroll ei loonud kohalikku andmebaasi.
- Next.js 16.4.3 lõplik tootmisversioon ehitus edukalt pärast mobiilipaigutuse ja serveriühenduse parandusi.
- Brauseris avanes pilveversiooni kohalik eelvaade. Andmebaasi puudumisel ilmus arusaadav veateade ja Retry nupp; leht jäi kasutatavaks.
- 390 × 844 telefonivaates olid mudelivalik, promptivalik ja Manage Prompts nähtavad. Mobiilne külgmenüü avanes ja sulgus.
- Töölaua ja mobiili kontrollpildid: qa/desktop-no-database.png ja qa/mobile-no-database.png. Need näitavad ühendamata andmebaasiga eelvaadet, mitte valmis Railway teenust.

## Pärast kontode ühendamist kontrollida

Päris Railway deploy, PostgreSQL migratsioon ja algandmed; vestluste ja sõnumite kirjutamine; seaded iga vestluse kohta; promptide lisamine, muutmine ja kustutamine; tühjendamine ja kustutamine poolelioleva vastuse ajal; brauseri taaslaadimine; sama vestluse avamine arvutis ja päris telefonis; uue deploy järel andmete säilimine; GitHub PR harjutus; Railway Usage.

GitHubi ja Railway kontod pole veel ühendatud. Avalikku teenust pole loodud. Claude Code'i kasutust, isiklikke rahuloluhinnanguid ega tegelikku tööaega ei ole välja mõeldud.


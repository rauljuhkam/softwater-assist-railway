# SoftWater Assist Railway

Ingliskeelne veepehmendi õppeassistent. Next.js App Router ja PostgreSQL koos Prisma ORM-iga. Kõik mudelid on simuleeritud; API võtmeid pole vaja. Vestlused, sõnumid, personad ning vestluse mudel, temperatuur ja top-P säilivad PostgreSQL-is.

## Avaldamine sammhaaval

1. Logi GitHubi sisse. Uue hoidla saad järgmises sammus luua otse VS Code kaudu.
2. Ava VS Code'is just see kaust `SoftWater-Assist-Railway`. Source Control vaates vali Initialize Repository. Lisa failid, sisesta commit'i kirjeldus `Prepare SoftWater Assist for Railway` ning vali Commit ja Publish to GitHub. Logi vajadusel sisse ning pane hoidla nimeks `softwater-assist-railway`. Kui hoidla on juba veebis loodud, ühenda see Source Control menüü Remote → Add Remote kaudu enne Publish Branch kasutamist. Ära avalda vanemat SoftWater-Assist kausta ega node_modules kausta.
3. Logi [Railway](https://railway.com) sisse GitHubiga. Loo uus projekt ning lisa PostgreSQL andmebaas.
4. Lisa samasse Railway projekti teenus GitHubi hoidlast. Vajadusel anna Railway GitHubi rakendusele ligipääs ainult sellele hoidlale.
5. Ava ÄPI teenuse Variables. Lisa `DATABASE_URL` viitena Postgres teenuse muutujale: `${{Postgres.DATABASE_URL}}`. Kui andmebaasi teenusel on teine nimi, kasuta selle nime. Ära kopeeri salasõna vestlusse ega koodi.
6. Käivita deploy. Railway kasutab Dockerfile'i. Ehitamisel tehakse `prisma generate` ja `next build`; käivitamisel `prisma migrate deploy`, algandmete lisamine ning `next start`. Port tuleb Railway muutujast `PORT`.
7. Eduka deploy järel ava äpi Settings → Networking → Generate Domain. Ava saadud HTTPS aadress. Kui Railway küsib sihtporti, kasuta käivituslogis kuvatud porti.
8. Kontrolli `/api/health` aadressi: vastus peab sisaldama `status: ok` ja `storage: PostgreSQL`.
9. Alusta vestlust arvutis, saada sõnum ja värskenda lehte. Ava sama avalik aadress telefonis ning vali ajaloost seesama vestlus. See kinnitab, et andmed on ühises andmebaasis.
10. Muuda mudelit, personat ja seadeid; loo teine vestlus ning naase esimese juurde. Kontrolli, et esimese seaded taastuvad. Lisa, muuda ja kustuta oma persona. Kontrolli nimega manuse lisamist, vestluse tühjendamist ja kustutamist ning koera nõuande vaigistamist.
11. Tee töölaua ja telefoni kuvatõmmis. Kirjuta töölehele tegelik algus- ja lõpuaeg, GitHubi ning Railway aadressid ja enda hinnangud. Avaldamise õnnestumist ei saa kinnitada enne päris Railway testi.

## Pull request harjutus

Loo VS Code'is haru `feature/footer`. Lisa jalusesse enda kinnitatud ettevõttenimega autoriõiguse tekst. Käivita testid ja build, tee commit ning Publish Branch. Loo GitHub Pull Requests laiendusega PR põhiharusse main. Vaata muudatus üle ja lisa vähemalt üks reakohane kommentaar. Liida PR, uuenda kohalik main ja kontrolli Railway uut deploy'd ning vestluste säilimist.

Kui koodi tegi Codex, ära märgi autoriks Claude Code'i. Claude Code'i kasutamist nõudva õppeharjutuse puhul tee selle tööriista etapid päriselt ja kirjelda kasutatud tööriistu ausalt.

## Kohalik kontroll

Loe ENVIRONMENT.md. `pnpm install`, `pnpm test`, `pnpm build`. Ehitamine ei vaja töötavat andmebaasi. Andmebaasita eelvaates `pnpm dev` näitab selget andmebaasi veateadet; vestlused hakkavad tööle pärast Railway ühendamist. Ära kasuta placeholder-aadressi päris ühendusena. `.env.example` näitab ainult muutuja kuju.

## Piirangud

See on autentimiseta ühine õppedemo. Kõik külastajad näevad samu vestlusi ning saavad neid muuta ja kustutada. Isikuandmeid ei sisestata. Mudelivalik ja parameetrid on demonstratsioon; vaba prompti sisu ei täideta keelemudeli juhisena. Manusest saadetakse serverisse ja salvestatakse vaid nimi ja suurus, mitte failisisu. Nõuandekoer töötab ainult avatud lehel iga 60 sekundi järel. Vana kohaliku demo brauseriajalugu automaatselt üle ei kanta. Teenuse hinnad ja krediit vaata oma Railway Usage vaatest.

Tehnilised allikad: [Next.js serverimajutus](https://nextjs.org/docs/app/getting-started/deploying), [Railway PostgreSQL](https://docs.railway.com/databases/postgresql), [Prisma 6 migratsioonid](https://www.prisma.io/docs/orm/v6/prisma-client/deployment/deploy-database-changes-with-prisma-migrate).

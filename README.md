# blinqx-financial-services

Website voor **financial-services.blinqx.tech** (design gebaseerd op hypotheekonderzoek.nl). Statische HTML, geen build-step, geen externe API's of fonts.

| Bestand | Inhoud |
|---|---|
| `index.html` | Homepagina: hero, doelgroepen, uitgelichte diensten, Blinqx, AI, markt, contactpersonen |
| `diensten.html` | Alle 14 diensten met doelgroepfilter, AI-agents, marktduiding, positie in de keten |
| `assets/site.css` | Gedeelde stijl |
| `assets/site.js` | Taalwissel, navigatie, doelgroepfilter |
| `img/` | Portretten contactpersonen |

- Taal: knop NL/EN of `?lang=en`; blijft behouden bij navigeren.
- Doelgroep direct openen: `diensten.html?doelgroep=banken` (ook `verzekeraars`, `kredietbemiddelaars`, `serviceproviders`, `pensioen`, `partners`, `vastgoed`).
- Geen links naar externe sites; alleen tussen eigen pagina's.

# Localized Home trophy lookup

Home metadata and the native trophy catalog can name the same game in
different languages. If the native NP-title index has no mapping, matching
only the Home display name can miss an existing trophy set. This is a
general lookup problem across titles and language pairs.

The verified 13.20 hub service is module 2578's named `fetchTitleData` export;
module 2559 is not that firmware's provider. The adapter validates that
export before using the native TrophyAccessor (module 210), User (module 8)
and Account (module 1009) APIs. Loaded named progress providers and the
legacy 2559 default export remain supported.

The local path resolves `Account.getInfo({userId}).accountId`, preserving its
64-bit decimal string, and creates a private offline accessor. It first tries
the NP-title mappings, then reads the `{read,close}` title-definition cursor
when those mappings are empty. A candidate must have an exact name alias
and the same platform (`prospero` for PS5, `ps4` for PS4). Only one distinct
set may match. Configuration and earned records are then read using that
set's native trophy title ID. Native handles/cursors are released on errors,
timeouts and late create replies. Missing records do not become zero counts.

The existing installed-game list now includes all publisher-localized
`titleName` values from `param.json.localizedParameters` in a `names` array.
The default display name remains the same. Names are parsed with the bundled
cJSON library, deduplicated and bounded to 64 aliases per application. The
console-verified PRAGMATA/Прагмата pair is also canonicalized explicitly for
mounts that only expose English metadata. No trophy-set ID is hardcoded.
Other translations are matched through publisher-provided localized names;
translations absent from all metadata still need a reliable alias or ID mapping.

The existing Home/hub console relay carries metadata snapshots by game ID.
Replies use per-title keys (`trophies-<id>`) so prefetch replies do not replace
one another before Home polls. Positive caching, stale-notification guards
and per-request watchdogs prevent a missing/slow set from hiding good cached
records or blocking the queue for later games. These changes stay within
SceShellUI; they add no process, network service, SDK dependency or runtime path.

## Evidence and verification

The hardware-confirmed reproduction on PS5 13.20 is Home `PRAGMATA`
(PPSA02530) versus native `Прагмата` (`20:NPWR53259_00`), with 8% progress
and earned counts `[0, 0, 1, 4]`. Pragmata is the regression example, not
the scope of the general metadata lookup. Other games and languages have
not been separately verified on hardware.

The supplied decrypted Hermes v89 payloads have source hashes:

| App | Source hash |
| --- | --- |
| Home | `80837fe66ccb00ba923f279c90b78c7c4813e543` |
| Game hub | `6281c2fc2085b197285788df14feb56ecdcccdfb` |
| Trophies | `64cea6a0515f212c1e75066dbffb6ab6c126b621` |

The Trophies app's functions 803/814 establish the definition/record cursor
contract. Functions 13614/14116 resolve the native account ID; function 5979
passes it into offline reads. The hub's factories 2576–2580 establish the
progress-fetch call chain. Raw firmware payloads and account identifiers are
not included in this repository.

A tester confirmed the combined fix in fork build 384 on PS5 13.20. The
isolated PR branch has host regression coverage; it has not received a
separate hardware test or a new ELF build.

Run the targeted checks from the repository root:

```sh
node --check theme/theme.js
node theme/test_trophies.js
node theme/test_trophies_offline.js
c++ -std=c++11 -Wall -Wextra -Werror -Isrc/third_party/cjson \
  theme/test_title_names.cpp src/third_party/cjson/cJSON.cpp -o /tmp/test_title_names
/tmp/test_title_names
```

Tests cover the English-only Home/Russian catalog reproduction, actual earned
counts, publisher translations, duplicate region stacks, wrong platforms,
64-bit account identity, cleanup, stalled/late replies, shared requests,
queue recovery, stale focus notifications and legacy provider compatibility.
Native replies in these tests are simulated.

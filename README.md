# Siri-Speaking

Short daily English speaking practice for Vietnamese adults who want clearer speech in daily life and at work. It is a static web app: no build step, no backend, no account, no API key. Recordings and progress stay in the browser.

## Run it

```bash
npm start        # serves the folder at http://localhost:8080 (Node 18+)
npm test         # unit tests (node:test)
```

Any static file server works too, for example `python3 -m http.server 8080`. The microphone needs `http://localhost` or HTTPS. Use Chrome, Edge or Safari for the model voice and optional transcription.

## What is in it

- **Practice today**: one button on Home that starts the first unfinished task of the day (three tasks, a few minutes each). A plain day streak, no points.
- **Role-play**: ten scripted conversations (restaurant, daily small talk, workplace update, hotel check-in, asking for directions, pharmacy, meeting a new neighbor, helping a delivery driver find you, a short job interview, and an optional second interview). Each has four guided turns: you answer, hear your recording, repeat one focus phrase with one tip, then answer again with the text hidden. A short answer is fine. Last comes one optional question to answer without the script. Each new day you return, one turn changes (the waiter asks "Sorry, did you say two or three?"). "Play full dialogue" plays the whole conversation in the coach voice, or with your saved takes for your lines.
- **Sound drills and shadowing**: 25 lessons on the sounds Vietnamese speakers find hardest (/θ/, /ð/, final consonants, /s/ vs /ʃ/, -s and -ed endings, stress), with IPA and stress guides.
- **Free talk**: speak for 30–60 seconds on a topic. No scores: you get "Here's what the app heard" and "Here's one thing to practice".
- **My deck**: one tap saves a hard phrase with your recording and its Vietnamese meaning. The next day you see the Vietnamese situation first, try it, then reveal the English and both recordings.
- **Weekly voice check**: save one line, say it again a week later, play both back and answer one concrete question ("Can you hear the final s in two parts?").
- **Coach voice**: the 🗣️ Voice button on every practice screen (and in Profile) lists the English voices installed in your browser, grouped by accent. Tap one to hear it; the choice is remembered. "Listen (Coach)" always plays this voice, at 1x or 0.8x.
- **My saved takes**: after an attempt, "Save this take" keeps your recording for that line. "My saved take" plays it back, or says "Not recorded yet"; the coach voice never stands in for it, and Listen (Coach) never plays it. The recording screen (Home → My saved takes) shows "Recorded: X / Y lines" and lets you play, replace or delete each one, upload a recording of your own, and clear recordings nothing uses any more. Takes are plain recordings replayed as they are: no voice cloning. Audio is stored as Blobs in IndexedDB with its format and the text of its line; only small settings and progress go in localStorage. Recordings in `audio/my-voice/` (an `index.json` listing a sample and one mp3 per sentence) are added as takes on the first visit.

## How feedback works

- Recording uses `getUserMedia` + `MediaRecorder` and always works on its own: you can replay yourself next to the model voice and finish every lesson without transcription.
- Word matching (Web Speech API transcription) is optional. On phones it is off by default, because some mobile browsers cannot record and transcribe at once; change it in Profile → "Word matching". When it is on, the browser's speech service may receive the audio of that attempt; recordings and saved takes never leave the device. If the service fails, the recording is kept and the app says "Word matching unavailable".
- In exact-repeat lines the words are matched in order and each is labelled **Heard** (green), **Heard differently** (amber) or **Unclear** (red). Green means the browser heard the expected word; it is not a grade of your sounds. Written forms are normalised (15 / fifteen, $12, 5:30, I'd, it's, neighbour / neighbor), but endings are not: "part" for "parts" or "check" for "checked" is reported.
- Free answers in a conversation are never graded. A guided turn shows what the browser heard and which key words it picked up, as a hint; the final unscripted answer is not checked at all. You can always continue.
- A recording that is too quiet gets no result, only a request to try again.
- No microphone at all: type the answer, or tap Skip/Next.

## Layout

```
index.html, css/style.css, favicon.svg
js/app.js            router and app context
js/store.js          state in localStorage (streak, plan, deck, voice check, history)
js/recorder.js       MediaRecorder capture, loudness, quiet detection
js/audiodb.js        saved recordings in IndexedDB
js/speech.js         coach voice and optional speech recognition
js/takes.js          the learner's saved takes (one recording per line)
js/voicescript.js    the lines a take can be saved for, as listed on the recording screen
js/match.js          "what the browser heard" and key-word hints
js/scoring.js, js/phonics.js   text alignment and likely-cause hints
js/dialogue.js, js/plan.js     daily conversation version and today's tasks
js/freetalk.js       free-talk topics and the single practice suggestion
js/content/          lessons, scenarios, phrases, tips, voice-check lines (all original)
js/views/            one file per screen
tests/               unit tests
```

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
- **Role-play**: three scripted conversations (restaurant, daily small talk, workplace update), four turns each. For every turn you answer, hear your recording, repeat one focus phrase with one tip, then answer again with the text hidden. Each new day you return, one turn changes (the waiter asks "Sorry, did you say two or three?").
- **Sound drills and shadowing**: 25 lessons on the sounds Vietnamese speakers find hardest (/θ/, /ð/, final consonants, /s/ vs /ʃ/, -s and -ed endings, stress), with IPA and stress guides.
- **Free talk**: speak for 30–60 seconds on a topic. No scores: you get "Here's what the app heard" and "Here's one thing to practice".
- **My deck**: one tap saves a hard phrase with your recording and its Vietnamese meaning. The next day you see the Vietnamese situation first, try it, then reveal the English and both recordings.
- **Weekly voice check**: save one line, say it again a week later, play both back and answer one concrete question ("Can you hear the final s in two parts?").
- **Model voice**: the 🗣️ Voice button on every practice screen (and in Profile) lists the English voices installed in your browser, grouped by accent. Tap one to hear it; the choice is remembered and used for every Listen, Slow and conversation line.
- **My voice**: "Upload my voice" in the picker and in Profile adds your own recordings (an mp3/wav/m4a file or a sample recorded in the browser) as a named voice. It replays each recording as it is: Listen plays your recording for a sentence you have recorded and the browser voice for the rest. It is not voice cloning and cannot read new sentences in your voice.

## How feedback works

- Recording uses `getUserMedia` + `MediaRecorder` and always works on its own: you can replay yourself next to the model voice and finish every lesson without transcription.
- Transcription (Web Speech API) is optional. On phones it is off by default, because some mobile browsers cannot record and transcribe at once; change it in Profile → "Show what the app heard".
- In exact-repeat lines each word is labelled **Heard** (green), **Heard differently** (amber) or **Unclear** (red). Green means the browser heard the expected word; it is not a grade of your sounds.
- Free answers in a conversation are never marked word by word. Any reply that carries an accepted idea completes the turn.
- A recording that is too quiet gets no result, only a request to try again.
- No microphone at all: type the answer, or tap Skip/Next.

## Layout

```
index.html, css/style.css, favicon.svg
js/app.js            router and app context
js/store.js          state in localStorage (streak, plan, deck, voice check, history)
js/recorder.js       MediaRecorder capture, loudness, quiet detection
js/audiodb.js        saved recordings in IndexedDB
js/speech.js         model voice and optional speech recognition
js/myvoice.js        the learner's own recordings used as a model voice
js/match.js          "what the browser heard" and accepted replies
js/scoring.js, js/phonics.js   text alignment and likely-cause hints
js/dialogue.js, js/plan.js     daily conversation version and today's tasks
js/freetalk.js       free-talk topics and the single practice suggestion
js/content/          lessons, scenarios, phrases, tips, voice-check lines (all original)
js/views/            one file per screen
tests/               unit tests
```

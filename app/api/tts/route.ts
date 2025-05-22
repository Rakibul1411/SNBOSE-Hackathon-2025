import { NextRequest, NextResponse } from "next/server";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";
import { promises as fs } from 'fs';

// Explicitly load credentials
const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || 
  await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS || '', 'utf8')
);

    const client = new textToSpeech.TextToSpeechClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id
    });

    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceConfig = {
      en: {
        languageCode: "en-US",
        name: "en-US-Wavenet-D",
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE
      },
      bn: {
        languageCode: "bn-IN",
        name: "bn-IN-Standard-A",
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE
      }
    };

    const voice = lang === "bn" ? voiceConfig.bn : voiceConfig.en;

    const request = {
      input: { text },
      voice,
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
      },
    };

    const [response] = await client.synthesizeSpeech(request);
    
    if (!response.audioContent) {
      throw new Error("No audio content received");
    }

    return new NextResponse(response.audioContent, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to convert text to speech" },
      { status: 500 }
    );
  }
}
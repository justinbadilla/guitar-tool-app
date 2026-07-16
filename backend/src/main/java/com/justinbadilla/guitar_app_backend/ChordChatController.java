package com.justinbadilla.guitar_app_backend;

import org.springframework.web.bind.annotation.*;

/**
 * ChordChatController
 *
 * Handles Q&A about current selected chord (Has no conversation memory
 * (each question only uses current chord context and question) 
 * Asking new question replaces previous message, and switching chords resets whole panel.
 */
@RestController
@RequestMapping("/api/chord-chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChordChatController {

    private final GeminiService geminiService;

    public ChordChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public String chat(@RequestBody ChordChatRequest request) {
        String prompt = buildPrompt(request);
        return geminiService.generateContent(prompt);
    }

    private String buildPrompt(ChordChatRequest request) {
        String chordContext = String.format(
                "The user has selected this on an interactive guitar fretboard (standard tuning unless otherwise specified):\n" +
                "- String positions: %s\n" +
                "- Tuning: %s\n" +
                "- Detected chord: %s",
                request.getPositionsJson(),
                request.getTuningJson(),
                request.getChordName() != null ? request.getChordName() : "unknown"
        );

        return "You are a guitar theory assistant embedded next to an interactive fretboard.\n" +
                chordContext + "\n\n" +
                "Answer the user's question about this chord, theory, or technique. " +
                "Keep your response to 2-3 sentences maximum. " +
                "Politely decline if the question is unrelated to guitar or music theory.\n\n" +
                "User's question: " + request.getQuestion();
    }
}
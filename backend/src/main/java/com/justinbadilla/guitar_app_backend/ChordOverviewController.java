package com.justinbadilla.guitar_app_backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chord-overview")
@CrossOrigin(origins = "http://localhost:5173")
public class ChordOverviewController {

    private final GeminiService geminiService;

    public ChordOverviewController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public String getOverview(@RequestBody ChordOverviewRequest request) {
        String prompt = buildPrompt(request);
        return geminiService.generateContent(prompt);
    }

    private String buildPrompt(ChordOverviewRequest request) {
        String chordContext = String.format(
                "The user has selected this on an interactive guitar fretboard:\n" +
                "- String positions: %s\n" +
                "- Tuning: %s\n" +
                "- Detected chord: %s",
                request.getPositionsJson(),
                request.getTuningJson(),
                request.getChordName() != null ? request.getChordName() : "unknown"
        );

        return chordContext + "\n\n" +
                "Respond ONLY with valid JSON, no markdown fences, in exactly this shape:\n" +
                "{\n" +
                "  \"overview\": \"1-2 sentence description of this chord's sound and common uses\",\n" +
                "  \"alternateNames\": [\"...\"],\n" +
                "  \"keys\": [\"keys this chord diatonically belongs to\"],\n" +
                "  \"nextChords\": [{ \"chord\": \"...\", \"why\": \"...\" }]\n" +
                "}";
    }
}
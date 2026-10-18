package com.justinbadilla.guitar_app_backend;

public class ChordChatRequest {
    private String chordName;
    private String positionsJson;
    private String tuningJson;
    private String question;

    public String getChordName() { return chordName; }
    public void setChordName(String chordName) { this.chordName = chordName; }

    public String getPositionsJson() { return positionsJson; }
    public void setPositionsJson(String positionsJson) { this.positionsJson = positionsJson; }

    public String getTuningJson() { return tuningJson; }
    public void setTuningJson(String tuningJson) { this.tuningJson = tuningJson; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
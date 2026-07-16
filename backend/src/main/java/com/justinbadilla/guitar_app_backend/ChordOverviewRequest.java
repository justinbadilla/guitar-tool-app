package com.justinbadilla.guitar_app_backend;

public class ChordOverviewRequest {
    private String chordName;
    private String positionsJson;
    private String tuningJson;

    public String getChordName() { return chordName; }
    public void setChordName(String chordName) { this.chordName = chordName; }

    public String getPositionsJson() { return positionsJson; }
    public void setPositionsJson(String positionsJson) { this.positionsJson = positionsJson; }

    public String getTuningJson() { return tuningJson; }
    public void setTuningJson(String tuningJson) { this.tuningJson = tuningJson; }
}
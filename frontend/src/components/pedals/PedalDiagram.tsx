import "./PedalDiagram.css";
import { PEDAL_SHAPES } from "../songwriting/type";
import type { PedalPreset } from "../songwriting/type";

interface PedalDiagramProps {
    preset: PedalPreset;
}

/**
 * PedalDiagram
 *
 * Read only visual rendering of saved pedal preset: the pedal body (an SVG rectangle sized shape config)
 * with each knob drawn as a small rotated circle at grid position. Presentational only (like ChordDiagram)
 */
function PedalDiagram({ preset }: PedalDiagramProps) {


    const shapeConfig = PEDAL_SHAPES.find((s) => s.id === preset.shape);
    if (!shapeConfig) return null;

    const { width, height, gridColumns, gridRows } = shapeConfig;

    // even spacing between slot centers, with a margin so knobs don't sit against pedal edges.
    const marginX = width * 0.15;
    const marginY = height * 0.15;
    const usableWidth = width - marginX * 2;
    const usableHeight = height - marginY * 2;

    const knobRadius = Math.min(width, height) * 0.08;

    /**
     * Converts a flat slotIndex (0, 1, 2...) into real (x, y) SVG coordinates within this pedal's grid 
     * for scalable knobs and keeping ratio
     */
    function slotPosition(slotIndex: number) {
        const col = slotIndex % gridColumns;
        const row = Math.floor(slotIndex / gridColumns);

        const x = gridColumns === 1
            ? width / 2
            : marginX + (col / (gridColumns - 1)) * usableWidth;

        const y = gridRows === 1
            ? height / 2
            : marginY + (row / (gridRows - 1)) * usableHeight;

        return { x, y };
    }

    return (
        <div className="pedal-diagram">


            <svg viewBox={`0 0 ${width} ${height}`} className="pedal-diagram-svg">
                <rect
                    x={2}
                    y={2}
                    width={width - 4}
                    height={height - 4}
                    rx={10}
                    className="pedal-body"
                />

                {preset.knobs.map((knob) => {
                    const { x, y } = slotPosition(knob.slotIndex);
                    const angle = (knob.value / 100) * 270 - 135;
                    const indicatorLength = knobRadius * 0.8;

                    return (
                        <g key={knob.id} transform={`translate(${x}, ${y})`}>
                            <circle r={knobRadius} className="knob-body" />
                            <line
                                x1={0}
                                y1={0}
                                x2={0}
                                y2={-indicatorLength}
                                className="knob-indicator"
                                transform={`rotate(${angle})`}
                            />
                        </g>
                    );
                })}
            </svg>
            <p className="pedal-diagram-name">{preset.name}</p>
        </div>
    );
}

export default PedalDiagram;
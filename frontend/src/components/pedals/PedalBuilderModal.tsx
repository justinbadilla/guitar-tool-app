import { useEffect, useRef, useState } from "react";
import { PEDAL_SHAPES } from "../songwriting/type";
import type { PedalShape, Knob, PedalPreset } from "../songwriting/type";
import "./PedalBuilderModal.css";

interface PedalBuilderModalProps {
    onClose: () => void;
    onSave: (preset: PedalPreset) => void;
}

//different windows/stages for building pedal
type BuilderStage = "layout" | "tweak" | "name";

/**
 * PedalBuilderModal
 * 
 * Window pop up to save your pedal presets. Has three stages: layout, tweak knobs, name pedal/preset
 */
function PedalBuilderModal({ onClose, onSave }: PedalBuilderModalProps) {
    const [stage, setStage] = useState<BuilderStage>("layout"); //Different stage/window for building pedal
    const [shape, setShape] = useState<PedalShape>("vertical"); //Choose shape of pedal
    const [knobs, setKnobs] = useState<Knob[]>([]); //array of knobs and positions
    const [draggingKnobId, setDraggingKnobId] = useState<string | null>(null); //knob id being dragged (if not, null)
    const [previewSlot, setPreviewSlot] = useState<number | null>(null); //shows which shape you are using
    const svgRef = useRef<SVGSVGElement>(null); 

    const shapeConfig = PEDAL_SHAPES.find((s) => s.id === shape)!;
    const { gridColumns, gridRows, width: canvasWidth, height: canvasHeight } = shapeConfig;
    const totalSlots = gridColumns * gridRows;

    //for knob tweaking for stage 2
    const [tweakingKnobId, setTweakingKnobId] = useState<string | null>(null);
    const [dragStartY, setDragStartY] = useState(0);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartValue, setDragStartValue] = useState(0);

    //updating name for stage 3
    const [name, setName] = useState("");

    function handleSave() {
        const trimmed = name.trim();
        if (trimmed === "") return;

        const preset: PedalPreset = {
            id: crypto.randomUUID(),
            name: trimmed,
            shape,
            knobs,
        };

        onSave(preset);
    }

    //handling shape change of pedal and makes new empty array of button
    function handleShapeChange(newShape: PedalShape) {
        setShape(newShape);
        setKnobs([]);
    }

    //grid positions into slots, and equal spacing
    function slotPosition(slotIndex: number) {
        const col = slotIndex % gridColumns;
        const row = Math.floor(slotIndex / gridColumns);

        const marginX = canvasWidth * 0.15;
        const marginY = canvasHeight * 0.15;
        const usableWidth = canvasWidth - marginX * 2;
        const usableHeight = canvasHeight - marginY * 2;

        const x = gridColumns === 1 ? canvasWidth / 2 : marginX + (col / (gridColumns - 1)) * usableWidth;
        const y = gridRows === 1 ? canvasHeight / 2 : marginY + (row / (gridRows - 1)) * usableHeight;

        return { x, y };
    }

    //for adding knobs, finds empty space
    function findNextEmptySlot(): number | null {
        for (let i = 0; i < totalSlots; i++) {
            if (!knobs.some((k) => k.slotIndex === i)) return i;
        }
        return null;
    }

    //when button is clicked, add button to the next empty slot. Stops, if no more space
    function handleAddKnob() {
        const nextSlot = findNextEmptySlot();
        if (nextSlot === null) return; // pedal is full
        setKnobs((prev) => [...prev, { id: crypto.randomUUID(), value: 50, slotIndex: nextSlot }]);
    }

    //finds nearest slot when dragging, by x and y position
    function findNearestSlot(x: number, y: number): number {
        let closestSlot = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < totalSlots; i++) {
            const pos = slotPosition(i);
            const distance = Math.hypot(pos.x - x, pos.y - y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSlot = i;
            }
        }
        return closestSlot;
    }

    //gets the point of knob x and y, so it can be used (handleMouseMove) find the nearest slot
    function getSvgPoint(clientX: number, clientY: number) {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };

        const rect = svg.getBoundingClientRect();
        const scaleX = canvasWidth / rect.width;
        const scaleY = canvasHeight / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }

    //which knob is being dragged, and sets it
    function handleKnobMouseDown(knobId: string) {
        setDraggingKnobId(knobId);
    }

    //handles the dragging of the knob, gets the point (getSvgPoint) and finds the nearest slot (findNearestSlot)
    //this renders with the preview of dragging knobs
    function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
        if (!draggingKnobId) return;

        const point = getSvgPoint(e.clientX, e.clientY);
        const nearest = findNearestSlot(point.x, point.y);
        setPreviewSlot(nearest);
    }

    //final result on where it is placed. Writes into knob array
    function handleMouseUp() {
        if (!draggingKnobId || previewSlot === null) {
            setDraggingKnobId(null);
            setPreviewSlot(null);
            return;
        }

        setKnobs((prev) => {
            // if another knob already occupies the target slot, swap them
            const otherKnob = prev.find((k) => k.slotIndex === previewSlot && k.id !== draggingKnobId);

            return prev.map((k) => {
                if (k.id === draggingKnobId) return { ...k, slotIndex: previewSlot };
                if (otherKnob && k.id === otherKnob.id) {
                    const draggedKnob = prev.find((dk) => dk.id === draggingKnobId)!;
                    return { ...k, slotIndex: draggedKnob.slotIndex };
                }
                return k;
            });
        });

        setDraggingKnobId(null);
        setPreviewSlot(null);
    }

    //FOR STAGE 2: Remembers where the drag began for updating the value (runs once, from drag)
    function handleKnobTweakStart(e: React.MouseEvent, knob: Knob) {
        setTweakingKnobId(knob.id);
        setDragStartY(e.clientY);
        setDragStartX(e.clientX);
        setDragStartValue(knob.value);
    }

    //mouse move listener, continuously measuring how far past that mouse has traveled, translatingvdistance to rotation
    useEffect(() => {
        if (!tweakingKnobId) return;

        function handleWindowMouseMove(e: MouseEvent) {
            const deltaY = dragStartY - e.clientY;
            const deltaX = e.clientX - dragStartX;
            const combinedDelta = deltaY + deltaX;

            const sensitivity = 0.5;
            const newValue = Math.min(100, Math.max(0, dragStartValue + combinedDelta * sensitivity));

            setKnobs((prev) =>
                prev.map((k) => (k.id === tweakingKnobId ? { ...k, value: newValue } : k))
            );
        }

        function handleWindowMouseUp() {
            setTweakingKnobId(null);
        }

        window.addEventListener("mousemove", handleWindowMouseMove);
        window.addEventListener("mouseup", handleWindowMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleWindowMouseMove);
            window.removeEventListener("mouseup", handleWindowMouseUp);
        };
    }, [tweakingKnobId, dragStartY, dragStartX, dragStartValue]); //update



    return (
        <>
            <div className="pedal-builder-backdrop" onClick={onClose} />
            <div className="pedal-builder-fullscreen">

                <div className="pedal-builder-sidebar">
                    <h3>Build a Pedal</h3>

                    {stage === "layout" && (
                        <>
                            <div className="pedal-builder-section">
                                <p className="pedal-builder-label">Shape</p>
                                <div className="pedal-shape-options">
                                    {PEDAL_SHAPES.map((s) => (
                                        <button
                                            key={s.id}
                                            className={`pedal-shape-option ${shape === s.id ? "active" : ""}`}
                                            onClick={() => handleShapeChange(s.id)}
                                        >
                                            <svg viewBox={`0 0 ${s.width} ${s.height}`} className="pedal-shape-preview-svg">
                                                <rect
                                                    x={4} y={4}
                                                    width={s.width - 8}
                                                    height={s.height - 8}
                                                    rx={16}
                                                    className="pedal-body"
                                                />
                                            </svg>
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pedal-builder-section">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleAddKnob}
                                    disabled={knobs.length >= totalSlots}
                                >
                                    + Add Knob
                                </button>
                            </div>

                            <p className="pedal-builder-hint">
                                Drag knobs onto the pedal. They'll snap into place.
                            </p>

                            <div className="pedal-builder-sidebar-actions">
                                <button onClick={onClose}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setStage("tweak")}
                                    disabled={knobs.length === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {stage === "tweak" && (
                        <>
                            <p className="pedal-builder-hint">
                                Drag a knob up, down, left, or right to set its value.
                            </p>
                            <div className="pedal-builder-sidebar-actions">
                                <button onClick={() => setStage("layout")}>Back</button>
                                <button className="btn btn-primary" onClick={() => setStage("name")}>Next</button>
                            </div>
                        </>
                    )}

                    {stage === "name" && (
                        <>
                            <div className="pedal-builder-section">
                                <p className="pedal-builder-label">Pedal Name</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Fuzz Machine"
                                    className="pedal-name-input"
                                    autoFocus
                                />
                            </div>

                            <p className="pedal-builder-hint">
                                Give your pedal a name, then save it.
                            </p>

                            <div className="pedal-builder-sidebar-actions">
                                <button onClick={() => setStage("tweak")}>Back</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                    disabled={name.trim() === ""}
                                >
                                    Save Pedal
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {stage === "layout" && (
                    <div className="pedal-builder-canvas">
                        <svg
                            ref={svgRef}
                            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                            className="pedal-canvas-svg"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <rect
                                x={4} y={4}
                                width={canvasWidth - 8}
                                height={canvasHeight - 8}
                                rx={20}
                                className="pedal-body"
                            />

                            {draggingKnobId && previewSlot !== null && (() => {
                                const pos = slotPosition(previewSlot);
                                return <circle cx={pos.x} cy={pos.y} r={26} className="slot-preview" />;
                            })()}

                            {knobs.map((knob) => {
                                const isDragging = knob.id === draggingKnobId;
                                const pos = isDragging && previewSlot !== null
                                    ? slotPosition(previewSlot)
                                    : slotPosition(knob.slotIndex);

                                return (
                                    <g key={knob.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                        <circle
                                            r={22}
                                            className={`knob-body ${isDragging ? "dragging" : ""}`}
                                            onMouseDown={() => handleKnobMouseDown(knob.id)}
                                        />
                                        <line x1={0} y1={0} x2={0} y2={-16} className="knob-indicator" />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}

                {stage === "tweak" && (
                    <div className="pedal-builder-canvas">
                        <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="pedal-canvas-svg">
                            <rect
                                x={4} y={4}
                                width={canvasWidth - 8}
                                height={canvasHeight - 8}
                                rx={20}
                                className="pedal-body"
                            />

                            {knobs.map((knob) => {
                                const pos = slotPosition(knob.slotIndex);
                                const angle = (knob.value / 100) * 270 - 135;

                                return (
                                    <g key={knob.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                        <circle
                                            r={22}
                                            className="knob-body"
                                            onMouseDown={(e) => handleKnobTweakStart(e, knob)}
                                        />
                                        <line
                                            x1={0} y1={0} x2={0} y2={-16}
                                            className="knob-indicator"
                                            transform={`rotate(${angle})`}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}

                {stage === "name" && (
                    <div className="pedal-builder-canvas">
                        <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="pedal-canvas-svg">
                            <rect
                                x={4} y={4}
                                width={canvasWidth - 8}
                                height={canvasHeight - 8}
                                rx={20}
                                className="pedal-body"
                            />

                            {knobs.map((knob) => {
                                const pos = slotPosition(knob.slotIndex);
                                const angle = (knob.value / 100) * 270 - 135;

                                return (
                                    <g key={knob.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                        <circle r={22} className="knob-body" />
                                        <line
                                            x1={0} y1={0} x2={0} y2={-16}
                                            className="knob-indicator"
                                            transform={`rotate(${angle})`}
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}
            </div>
        </>
    );
}

export default PedalBuilderModal;
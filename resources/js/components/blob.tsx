import { useEffect, useMemo, useRef, useState } from "react";
import { set } from "zod";

function Gradient({ id, from, to }: { id: string; from: string; to: string }) {
    return (
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
        </linearGradient>
    );
}

function createPath({
    nodes,
    controlPoints,
}: {
    nodes: Array<Node>;
    controlPoints: Array<ControlPoint>;
}) {
    return `M${nodes[nodes.length - 1].x} ${nodes[nodes.length - 1].y}
      ${nodes
          .map(
              (n, i) => `
  C ${
      i === 0
          ? controlPoints[controlPoints.length - 1].c2x
          : controlPoints[i - 1].c2x
  } ${
                  i === 0
                      ? controlPoints[controlPoints.length - 1].c2y
                      : controlPoints[i - 1].c2y
              }, ${controlPoints[i].c1x} ${controlPoints[i].c1y}, ${n.x} ${n.y}
  `
          )
          .join("")}
      Z
    `;
}

export function Blob({
    radius = 50,
    totalNodes = 4,
    amplitude = 10,
}: {
    radius: number;
    totalNodes?: number;
    amplitude?: number;
}) {
    const width = useMemo(() => radius * 2.5, [radius]);
    const offset: Point = { x: radius * 0.25, y: radius * 0.25 };

    const [initialNodes] = useState<Node[]>(() =>
        createNodes({ totalNodes, radius, offset })
    );
    const [initialControlPoints] = useState<ControlPoint[]>(() =>
        createControlPoints({
            totalNodes,
            nodes: initialNodes,
            radius,
            offset,
        })
    );
    const [path, setPath] = useState<string>("");

    const nodesRef = useRef(initialNodes);
    const controlPointsRef = useRef(initialControlPoints);

    useEffect(() => {
        // Continuously update the blob path for animation
        const animate = () => {
            const updated = update({
                nodes: nodesRef.current,
                controlPoints: controlPointsRef.current,
                amplitude,
            });
            nodesRef.current = updated.nodes;
            controlPointsRef.current = updated.controlPoints;
            setPath(createPath(updated));

            // Trigger the next animation frame without re-rendering
            requestAnimationFrame(animate);
        };

        animate(); // Start the animation loop
    }, [totalNodes, radius, amplitude]);

    return (
        <svg
            viewBox={`0 0 ${width} ${width}`}
            width={width}
            height={width}
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
        >
            <defs>
                <Gradient id="gradient1" from="#50F6C2" to="#80FFF2" />
            </defs>
            <path fill="url(#gradient1)" d={path} />
        </svg>
    );
}

type Point = { x: number; y: number };
type Node = Point & {
    id: number;
    prev: Point;
    next: Point;
    base: Point;
    angle: number;
};
type ControlPoint = { c1x: number; c1y: number; c2x: number; c2y: number };

function createNodes({
    totalNodes,
    radius,
    offset,
}: {
    totalNodes: number;
    radius: number;
    offset: Point;
}) {
    let num = totalNodes,
        nodes: Array<Node> = [],
        width = radius * 2,
        angle,
        x,
        y;
    for (let i = 0; i < num; i++) {
        angle = (i / (num / 2)) * Math.PI; // Angle at which the node will be placed
        x = radius * Math.cos(angle) + width / 2;
        y = radius * Math.sin(angle) + width / 2;
        nodes.push({
            id: i,
            x: x + offset.x,
            y: y + offset.y,
            prev: { x: x + offset.x, y: y + offset.y },
            next: { x: x + offset.x, y: y + offset.y },
            base: { x: x + offset.x, y: y + offset.y },
            angle,
        });
    }
    return nodes;
}

function rotate({
    cx,
    cy,
    x,
    y,
    radians,
}: {
    cx: number;
    cy: number;
    x: number;
    y: number;
    radians: number;
}) {
    const cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = cos * (x - cx) + sin * (y - cy) + cx,
        ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
}

function createControlPoints({
    totalNodes,
    nodes,
    radius,
    offset,
}: {
    totalNodes: number;
    nodes: Array<Node>;
    radius: number;
    offset: Point;
}): Array<ControlPoint> {
    const idealControlPointDistance =
        (4 / 3) * Math.tan(Math.PI / (2 * totalNodes)) * radius;

    const cp0 = {
        c1x: nodes[0].x,
        c1y: nodes[0].y - idealControlPointDistance,
        c2x: nodes[0].x,
        c2y: nodes[0].y + idealControlPointDistance,
    };

    return nodes.map((n, i) => {
        if (i === 0) {
            return cp0;
        } else {
            const angle = -n.angle;
            const rotatedC1 = rotate({
                cx: radius + offset.x,
                cy: radius + offset.y,
                x: cp0.c1x,
                y: cp0.c1y,
                radians: angle,
            });
            const rotatedC2 = rotate({
                cx: radius + offset.x,
                cy: radius + offset.y,
                x: cp0.c2x,
                y: cp0.c2y,
                radians: angle,
            });
            return {
                c1x: rotatedC1[0],
                c1y: rotatedC1[1],
                c2x: rotatedC2[0],
                c2y: rotatedC2[1],
            };
        }
    });
}

function ease(t: number, speed = 0.5) {
    return (-(Math.cos((Math.PI / 2) * t * 5) - 2) / 256) * speed;
}

function update({
    nodes,
    controlPoints,
    amplitude,
}: {
    nodes: Array<Node>;
    controlPoints: Array<ControlPoint>;
    amplitude: number;
}) {
    const updatedNodes = [...nodes];
    const updatedControlPoints = [...controlPoints];

    for (const i in nodes) {
        if (Math.abs(nodes[i].next.x - nodes[i].x) < 10) {
            const shiftX =
                ((~~(Math.random() * 5) - 2) * Math.random() * amplitude) / 2;
            nodes[i].prev.x = nodes[i].x;
            nodes[i].next.x = nodes[i].base.x + shiftX;
        }
        if (Math.abs(nodes[i].next.y - nodes[i].y) < 10) {
            const shiftY =
                ((~~(Math.random() * 5) - 2) * Math.random() * amplitude) / 2;
            nodes[i].prev.y = nodes[i].y;
            nodes[i].next.y = nodes[i].base.y + shiftY;
        }
        const distanceX = nodes[i].next.x - nodes[i].prev.x;
        const distanceY = nodes[i].next.y - nodes[i].prev.y;
        const remainingDistanceX = nodes[i].next.x - nodes[i].x;
        const remainingDistanceY = nodes[i].next.y - nodes[i].y;
        let tX = 1 - remainingDistanceX / distanceX;
        let tY = 1 - remainingDistanceY / distanceY;

        const shiftX = ease(tX > 0 ? tX : 0.2) * distanceX;
        const shiftY = ease(tY > 0 ? tY : 0.2) * distanceY;

        nodes[i].x += shiftX;
        nodes[i].y += shiftY;
        controlPoints[i].c1x += shiftX;
        controlPoints[i].c1y += shiftY;
        controlPoints[i].c2x += shiftX;
        controlPoints[i].c2y += shiftY;
    }

    return { nodes: updatedNodes, controlPoints: updatedControlPoints };
}

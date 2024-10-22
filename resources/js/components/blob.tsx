import { useEffect, useRef, useState } from "react";

function Gradient({ id, from, to }: { id: string; from: string; to: string }) {
    return (
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
        </linearGradient>
    );
}

function drawBlobPath(nodes, controlPoints, path) {
    path.setAttributeNS(
        null,
        "d",
        `
      M${nodes[nodes.length - 1].x} ${nodes[nodes.length - 1].y}
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
    `
    );
}

function Blob({
    radius = 50,
    totalNodes = 6,
    amplitude = 1,
}: {
    radius: number;
    totalNodes?: number;
    amplitude?: number;
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Create nodes and control points for three layers
        const nodes = createNodes({
            totalNodes,
            radius,
            offsetX: 100,
            offsetY: 100,
        });

        const controlPoints = createControlPoints({
            totalNodes,
            nodes,
            radius,
            offsetX: 100,
            offsetY: 100,
        });

        // Continuously update the blob path for animation
        const animate = () => {
            const update({ nodes, controlPoints, amplitude });
            drawBlobPath(nodes, controlPoints);
            requestAnimationFrame(animate);
        };

        animate(); // Start the animation loop
    }, [radius, totalNodes, amplitude]);

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="auto"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: "1000px", boxSizing: "border-box" }}
        >
            <defs>
                <Gradient id="gradient1" from="#50F6C2" to="#80FFF2" />
            </defs>
            <path fill="url(#gradient1)" />
        </svg>
    );
}

export default BlobSVG;

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
    offsetX,
    offsetY,
}: {
    totalNodes: number;
    radius: number;
    offsetX: number;
    offsetY: number;
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
            x: x + offsetX,
            y: y + offsetY,
            prev: { x: x + offsetX, y: y + offsetY },
            next: { x: x + offsetX, y: y + offsetY },
            base: { x: x + offsetX, y: y + offsetY },
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
    offsetX,
    offsetY,
}: {
    totalNodes: number;
    nodes: Array<Node>;
    radius: number;
    offsetX: number;
    offsetY: number;
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
                cx: radius + offsetX,
                cy: radius + offsetY,
                x: cp0.c1x,
                y: cp0.c1y,
                radians: angle,
            });
            const rotatedC2 = rotate({
                cx: radius + offsetX,
                cy: radius + offsetY,
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

function ease(t: number, speed = 1) {
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
    nodes.forEach((n, i) => {
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
    });
}

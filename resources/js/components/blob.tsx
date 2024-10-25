import React, { useRef, useEffect, useCallback } from "react";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import { Point, PropsWithClassName } from "@/types";
import { spline } from "@/utils/splines";
import { cn } from "@/utils/classnames";

type PointType = Point & {
    originX: number;
    originY: number;
    noiseOffsetX: number;
    noiseOffsetY: number;
};

const map = (
    n: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
): number => {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
};

const noise = (x: number, y: number, simplex: NoiseFunction2D): number => {
    return simplex(x, y);
};

const createPoints = ({
    totalPoints = 10,
    radius = 75,
}: {
    totalPoints?: number;
    radius?: number;
}): PointType[] => {
    const points: PointType[] = [];
    const angleStep = (Math.PI * 2) / totalPoints;

    for (let i = 1; i <= totalPoints; i++) {
        const theta = i * angleStep;

        const x = 100 + Math.cos(theta) * radius;
        const y = 100 + Math.sin(theta) * radius;

        points.push({
            x,
            y,
            originX: x,
            originY: y,
            noiseOffsetX: Math.random() * 10000,
            noiseOffsetY: Math.random() * 10000,
        });
    }

    return points;
};

export function Blob({
    className,
    active,
    size = 50,
}: PropsWithClassName<{ active: boolean; size?: number }>) {
    const pathRef = useRef<SVGPathElement>(null);
    const pointsRef = useRef<PointType[]>(createPoints({ radius: size }));
    const noiseStepRef = useRef<number>(0);
    const simplexRef = useRef<NoiseFunction2D>(createNoise2D());

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            const points = pointsRef.current;
            if (pathRef.current) {
                const path = pathRef.current;
                const newD = spline({ points, tension: 1, close: true });
                path.setAttribute("d", newD);
            }

            // Update points
            for (let i = 0; i < points.length; i++) {
                const point = points[i];

                const nX = noise(
                    point.noiseOffsetX,
                    point.noiseOffsetX,
                    simplexRef.current
                );
                const nY = noise(
                    point.noiseOffsetY,
                    point.noiseOffsetY,
                    simplexRef.current
                );

                const x = map(nX, -1, 1, point.originX - 5, point.originX + 5);
                const y = map(nY, -1, 1, point.originY - 5, point.originY + 5);

                point.x = x;
                point.y = y;

                point.noiseOffsetX += noiseStepRef.current;
                point.noiseOffsetY += noiseStepRef.current;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const setAmplitude = useCallback((amount: number) => {
        noiseStepRef.current = amount;
    }, []);

    useEffect(() => {
        setAmplitude(active ? 0.002 : 0);
    }, [active]);

    return (
        <svg
            width={size}
            height={size}
            className={cn(className, "fill-current text-foreground")}
            viewBox="0 0 200 200"
        >
            <path d="" ref={pathRef}></path>
        </svg>
    );
}

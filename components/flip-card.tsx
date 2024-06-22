"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

const mockCards = [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is the square root of 16?", answer: "4" },
];

export const FlipCard = () => {
    const [flipped, setFlipped] = useState(false);
    const [cards, setCards] = useState(mockCards);
    const [currentIndex, setCurrentIndex] = useState(0);

    const front = useRef(null);
    const back = useRef(null);
    const card = useRef(null);
    const flipAni = useRef<gsap.core.Timeline>();
    const scaleAni = useRef<gsap.core.Timeline>();

    useGSAP(() => {
        gsap.set(card.current, {
            transformStyle: "preserve-3d",
            transformPerspective: 1000,
        });

        gsap.set(back.current, { rotationY: -180 });
        flipAni.current = gsap
            .timeline({ paused: true })
            .to(front.current, { duration: 0.3, rotationY: 180 })
            .to(back.current, { duration: 0.3, rotationY: 0 }, 0);

        scaleAni.current = gsap
            .timeline({ paused: true })
            .to(card.current, { scale: 0, duration: 0.3 })
            .to(card.current, { scale: 1, duration: 0.3 }, 0.3);
    });

    const flipCard = () => {
        setFlipped(!flipped);
        flipped ? flipAni.current?.reverse() : flipAni.current?.play();
    };

    const changeCard = (indexChange: number) => {
        if (flipped) {
            flipAni.current?.reverse();
            setTimeout(() => {
                scaleAni.current?.restart();
                setTimeout(() => {
                    setFlipped(false);
                    setCurrentIndex(
                        (prevIndex) =>
                            (prevIndex + indexChange + cards.length) %
                            cards.length,
                    );
                }, 300);
            }, 300);
        } else {
            scaleAni.current?.restart();
            setTimeout(() => {
                setCurrentIndex(
                    (prevIndex) =>
                        (prevIndex + indexChange + cards.length) % cards.length,
                );
            }, 300);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-5">
                <button
                    className="size-[50px] rounded-full bg-gray-300"
                    onClick={() => changeCard(-1)}
                >
                    {"<"}
                </button>
                <div
                    className="card relative h-[450px] w-[300px]"
                    ref={card}
                    onClick={flipCard}
                >
                    <div
                        className="backface-hidden front absolute z-10 flex h-[450px] w-[300px] items-center justify-center rounded-lg bg-blue-400 shadow-md"
                        ref={front}
                    >
                        {cards[currentIndex].question}
                    </div>
                    <div
                        className="backface-hidden back absolute flex h-[450px] w-[300px] items-center justify-center rounded-lg bg-red-400 shadow-md"
                        ref={back}
                    >
                        {cards[currentIndex].answer}
                    </div>
                </div>
                <button
                    className="size-[50px] rounded-full bg-gray-300"
                    onClick={() => changeCard(1)}
                >
                    {">"}
                </button>
            </div>

            <div className="flex items-center justify-center gap-5">
                <button
                    className="rounded bg-green-300 px-5 py-3"
                    onClick={() => {}}
                >
                    Correct
                </button>
                <button
                    className="rounded bg-red-300 px-5 py-3"
                    onClick={() => {}}
                >
                    Wrong
                </button>
            </div>
        </div>
    );
};

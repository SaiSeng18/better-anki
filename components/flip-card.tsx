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
						(prevIndex) => (prevIndex + indexChange + cards.length) % cards.length
					);
				}, 300);
			}, 300);
		} else {
			scaleAni.current?.restart();
			setTimeout(() => {
				setCurrentIndex(
					(prevIndex) => (prevIndex + indexChange + cards.length) % cards.length
				);
			}, 300);
		}
	};

	return (
		<>
			<div
				className="relative w-[300px] h-[450px] card"
				ref={card}
				onClick={flipCard}>
				<div
					className="w-[300px] h-[450px] rounded-lg shadow-md bg-blue-400 absolute backface-hidden front flex justify-center items-center z-10"
					ref={front}>
					{cards[currentIndex].question}
				</div>
				<div
					className="w-[300px] h-[450px] rounded-lg shadow-md bg-red-400 absolute backface-hidden back flex justify-center items-center"
					ref={back}>
					{cards[currentIndex].answer}
				</div>
			</div>

			<div className="mt-4 flex justify-center space-x-4">
				<button
					className="px-4 py-2 bg-gray-300 rounded"
					onClick={() => changeCard(-1)}>
					Previous
				</button>
				<button
					className="px-4 py-2 bg-gray-300 rounded"
					onClick={() => changeCard(1)}>
					Next
				</button>
			</div>
		</>
	);
};

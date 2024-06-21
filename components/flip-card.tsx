"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export const FlipCard = () => {
	const [flipped, setFlipped] = useState(false);

	const front = useRef(null);
	const back = useRef(null);
	const card = useRef(null);
	const tl = useRef<gsap.core.Timeline>();

	useGSAP(() => {
		gsap.set(card.current, {
			transformStyle: "preserve-3d",
			transformPerspective: 1000,
		});

		gsap.set(back.current, { rotationY: -180 });
		tl.current = gsap
			.timeline({ paused: true })
			.to(front.current, { duration: 1, rotationY: 180 })
			.to(back.current, { duration: 1, rotationY: 0 }, 0)
			.to(card.current, { z: 50 }, 0)
			.to(card.current, { z: 0 }, 0.5);
	});

	const flipCard = () => {
		setFlipped(!flipped);
		flipped ? tl.current?.reverse() : tl.current?.play();
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
					Front
				</div>
				<div
					className="w-[300px] h-[450px] rounded-lg shadow-md bg-red-400 absolute backface-hidden back flex justify-center items-center"
					ref={back}>
					Back
				</div>
			</div>

			{/* <button onClick={flipCard}>Click</button> */}
		</>
	);
};

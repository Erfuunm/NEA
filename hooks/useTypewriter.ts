import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
}

export function useTypewriter(
  text: string,
  { speed = 32, startDelay = 0, onDone }: UseTypewriterOptions = {}
) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [trackedText, setTrackedText] = useState(text);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  if (text !== trackedText) {
    setTrackedText(text);
    setDisplayed("");
    setIsDone(false);
  }

  useEffect(() => {
    let index = 0;
    let interval: ReturnType<typeof setInterval> | null = null;

    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (interval) clearInterval(interval);
          setIsDone(true);
          onDoneRef.current?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

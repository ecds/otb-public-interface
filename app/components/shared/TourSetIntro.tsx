import { useLayoutEffect, useRef, useState } from "react";

const TourSetIntro = ({ intro }: { intro: string }) => {
  const [shouldExpand, setShouldExpand] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!elementRef.current) return;
    setShouldExpand(
      elementRef.current.scrollHeight > elementRef.current.offsetHeight,
    );
  }, [intro]);

  if (!intro) return <></>;

  return (
    <div
      className={`mx-auto bg-white rounded-md p-4 md:p-6 mb-4 md:mb-6 max-w-[65ch]`}
    >
      <div
        ref={elementRef}
        id="tour-set-intro"
        className={`prose transition-all ${isExpanded ? "line-clamp-none" : "line-clamp-2"} md:line-clamp-none md:overflow-auto`}
        dangerouslySetInnerHTML={{
          __html: intro,
        }}
      />
      {shouldExpand && (
        <button
          className={`block md:hidden bg-blue-600 px-1 text-white rounded-md`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="tour-set-intro"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default TourSetIntro;

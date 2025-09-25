import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faInfoCircle,
  faList,
  faMap,
} from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router";
import { TourContext } from "~/contexts/tourContext";

const MobileNav = () => {
  const { theme, tour, currentStop } = useContext(TourContext);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);
  const [previousLink, setPreviousLink] = useState<string>("#");
  const [nextLink, setNextLink] = useState<string>("#");

  useEffect(() => {
    setIsFirst(!Boolean(currentStop?.attributes.previous));
    setIsLast(!Boolean(currentStop?.attributes.next));
  }, [currentStop]);

  useEffect(() => {
    if (!isFirst)
      setPreviousLink(
        `/${tour?.attributes.slug}/${currentStop?.attributes.previous_slug}/intro`
      );

    if (!isLast)
      setNextLink(
        `/${tour?.attributes.slug}/${currentStop?.attributes.next_slug}/intro`
      );
  }, [isFirst, isLast, currentStop, tour]);

  const classNames = (isActive: boolean, disabled = false) => {
    return `w-full text-center flex flex-col m-auto text-${theme}-accent-text aria-disabled:text-${theme}-accent-text/45 bg-${theme}-${
      isActive ? "accent" : "primary"
    } h-full py-1 ${disabled ? "pointer-events-none" : ""}`;
  };

  if (tour && !currentStop) {
    return (
      <nav
        className={`grid grid-rows-1 grid-cols-3 bg-${theme}-primary text-${theme}-secondary text-xl z-10 fixed bottom-0 h-16 w-screen`}
      >
        <NavLink
          to={`/${tour.attributes.slug}/intro`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div>info</div>
        </NavLink>
        <NavLink
          to={`/${tour.attributes.slug}/map`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faMap} />
          </div>
          <div>map</div>
        </NavLink>
        <NavLink
          to={`/${tour.attributes.slug}/stops`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faList} />
          </div>
          <div>stops</div>
        </NavLink>
      </nav>
    );
  }

  if (tour && currentStop) {
    return (
      <nav
        className={`grid grid-rows-1 grid-cols-4 bg-${theme}-primary text-${theme}-secondary text-xl z-10 fixed bottom-0 h-16 w-screen`}
      >
        <NavLink
          to={`/${tour.attributes.slug}/${currentStop.attributes.previous_slug}/intro`}
          viewTransition
          className={classNames(false, isFirst)}
          aria-disabled={!Boolean(currentStop.attributes.previous_slug)}
        >
          <div>
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div>Prev</div>
        </NavLink>
        <NavLink
          to={`/${tour.attributes.slug}/${currentStop.attributes.slug}/intro`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div>info</div>
        </NavLink>
        <NavLink
          to={`/${tour.attributes.slug}/${currentStop.attributes.slug}/map`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faMap} />
          </div>
          <div>map</div>
        </NavLink>
        <NavLink
          to={nextLink}
          viewTransition
          className={classNames(false, isLast)}
          aria-disabled={isLast}
        >
          <div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div>next</div>
        </NavLink>
      </nav>
    );
  }
};

export default MobileNav;

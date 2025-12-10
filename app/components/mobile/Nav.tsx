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
import { TourContext } from "~/contexts/TourContext";

const MobileNav = () => {
  const { tour, currentStop } = useContext(TourContext);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);

  useEffect(() => {
    setIsFirst(!currentStop?.previous);
    setIsLast(!currentStop?.next);
  }, [currentStop]);

  const classNames = (isActive: boolean, disabled = false) => {
    return `w-full text-center flex flex-col m-auto text-${
      tour?.theme ?? "default"
    }-accent-text aria-disabled:text-${
      tour?.theme ?? "default"
    }-accent-text/45 bg-${tour?.theme ?? "default"}-${
      isActive ? "accent" : "primary"
    } h-full py-1 ${disabled ? "pointer-events-none" : ""}`;
  };

  if (tour && !currentStop) {
    return (
      <nav
        className={`grid grid-rows-1 grid-cols-3 bg-${tour.theme}-primary text-${tour.theme}-secondary text-xl z-10 fixed bottom-0 h-16 w-screen`}
      >
        <NavLink
          to={`/${tour.slug}/intro`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div>info</div>
        </NavLink>
        <NavLink
          to={`/${tour.slug}/map`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faMap} />
          </div>
          <div>map</div>
        </NavLink>
        <NavLink
          to={`/${tour.slug}/stops`}
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
        className={`grid grid-rows-1 grid-cols-4 bg-${tour.theme}-primary text-${tour.theme}-secondary text-xl z-10 fixed bottom-0 h-16 w-screen`}
      >
        <NavLink
          to={`/${tour.slug}/${currentStop.previous?.slug}/intro`}
          viewTransition
          className={classNames(false, isFirst)}
          aria-disabled={isFirst}
        >
          <div>
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div>Prev</div>
        </NavLink>
        <NavLink
          to={`/${tour.slug}/${currentStop.slug}/intro`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div>info</div>
        </NavLink>
        <NavLink
          to={`/${tour.slug}/${currentStop.slug}/map`}
          viewTransition
          className={({ isActive }) => classNames(isActive)}
        >
          <div>
            <FontAwesomeIcon icon={faMap} />
          </div>
          <div>map</div>
        </NavLink>
        <NavLink
          to={`/${tour.slug}/${currentStop.next?.slug}/intro`}
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

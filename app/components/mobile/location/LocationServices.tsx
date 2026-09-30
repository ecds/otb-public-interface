import { useDeviceLocation } from "~/hooks/deviceLocation";
import { useLocationPermission } from "~/hooks/locationPermission";
import detectBrowserEnv from "~/utils/browser";
import type { TPreferenceName } from "~/types";

interface Props {
  dismiss: (pref: TPreferenceName) => void;
  locationAllowed: boolean;
}

const Instructions = () => {
  const browser = detectBrowserEnv();
  switch (browser) {
    case "safari-ios":
      return (
        <>
          <p>
            Open the <strong>Settings</strong> app on your iPhone or iPad.
          </p>
          <p>
            Tap <strong>Privacy & Security</strong> →{" "}
            <strong>Location Services</strong> and make sure it is turned{" "}
            <strong>On</strong>.
          </p>
          <p>
            Scroll down and tap <strong>Safari Websites</strong>.
          </p>
          <p>
            Under &quot;Allow Location Access&quot; choose{" "}
            <strong>While Using the App</strong>.
          </p>
          <p>Return to Safari and reload this page.</p>
        </>
      );
    case "chrome-ios":
      return (
        <>
          <p>
            Open the <strong>Settings</strong> app on your iPhone or iPad.
          </p>
          <p>
            Tap <strong>Privacy & Security</strong> →{" "}
            <strong>Location Services</strong>.
          </p>
          <p>
            Scroll down and tap <strong>Chrome</strong>.
          </p>
          <p>
            Choose <strong>While Using the App</strong>.
          </p>
          <p>Return to Chrome and reload this page.</p>
        </>
      );
    case "chrome-android":
      return (
        <>
          <p>
            Tap the <strong>lock icon</strong> (🔒) in the address bar.
          </p>
          <p>
            Tap <strong>Permissions</strong>.
          </p>
          <p>
            Tap <strong>Location</strong> and choose <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    case "chrome-desktop":
      return (
        <>
          <p>
            Click the <strong>lock icon</strong> or ⓘ in the address bar.
          </p>
          <p>
            Click <strong>Site settings</strong>.
          </p>
          <p>
            Under <strong>Location</strong>, change &quot;Block&quot; to{" "}
            <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    case "safari-mac":
      return (
        <>
          <p>
            In the menu bar choose <strong>Safari → Settings</strong> (macOS
            Ventura+) or <strong>Preferences</strong> (older).
          </p>
          <p>
            Click the <strong>Websites</strong> tab.
          </p>
          <p>
            Select <strong>Location</strong> in the left sidebar.
          </p>
          <p>
            Find this site and set its permission to <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    case "edge-desktop":
      return (
        <>
          <p>
            Click the <strong>lock icon</strong> in the address bar.
          </p>
          <p>
            Click <strong>Permissions for this site</strong>.
          </p>
          <p>
            Under <strong>Location</strong>, change &quot;Block&quot; to{" "}
            <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    case "edge-android":
      return (
        <>
          <p>
            Tap the <strong>lock icon</strong> (🔒) in the address bar.
          </p>
          <p>
            Tap <strong>Site permissions</strong>.
          </p>
          <p>
            Tap <strong>Location</strong> and choose <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    case "firefox":
      return (
        <>
          <p>
            Click the <strong>lock icon</strong> in the address bar.
          </p>
          <p>
            Next to the blocked Location permission, click the{" "}
            <strong>✕</strong> to clear it.
          </p>
          <p>Reload the page — Firefox will prompt you again.</p>
          <p>
            Click <strong>Allow</strong> when the location request appears.
          </p>
        </>
      );
    case "other":
      return (
        <>
          <p>
            Look for a <strong>lock icon</strong> or ⓘ in the address bar.
          </p>
          <p>Open site settings or permissions.</p>
          <p>
            Find <strong>Location</strong> and set it to <strong>Allow</strong>.
          </p>
          <p>Reload this page.</p>
        </>
      );
    default:
      return <></>;
  }
};

const GrantLocationAccess = ({ dismiss, locationAllowed }: Props) => {
  const locationPermission = useLocationPermission();
  const browser = detectBrowserEnv();
  const deviceLocation = useDeviceLocation();

  if (locationAllowed && locationPermission === "granted" && deviceLocation)
    return <></>;

  return (
    <div className="mt-16 flex flex-col space-y-4 p-2">
      <h2 className="font-semibold">
        Enable Location Services on <em>{browser}</em>
      </h2>
      <div className="text-sm">
        <Instructions />
      </div>
      <button onClick={() => dismiss("locationAllowed")}>
        Continue Blocking Location
      </button>
    </div>
  );
};

export default GrantLocationAccess;
